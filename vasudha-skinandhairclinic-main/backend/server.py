import os
import re
import ipaddress
import logging
import uuid
from contextlib import suppress
from datetime import datetime, timedelta, timezone
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from typing import List, Optional
from urllib.parse import urlparse

import asyncio

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

import bcrypt
import httpx
import jwt
from fastapi import Depends, FastAPI, APIRouter, HTTPException, Query, Request, Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pymongo import ASCENDING, DESCENDING, IndexModel
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

ROOT_DIR = Path(__file__).parent

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

INDEXES: dict = {
    "users": [IndexModel([("email", ASCENDING)], name="email", unique=True)],
    "enquiries": [
        IndexModel([("created_at", DESCENDING)], name="created_at_desc"),
        IndexModel([("status", ASCENDING)], name="status"),
    ],
    "services": [IndexModel([("order", ASCENDING)], name="order")],
    "login_attempts": [IndexModel([("identifier", ASCENDING)], name="identifier")],
}

async def ensure_indexes() -> None:
    for collection, models in INDEXES.items():
        for model in models:
            try:
                await db[collection].create_indexes([model])
            except Exception as exc:
                logging.getLogger(__name__).error("ensure_indexes(%s): %s", collection, exc)

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", ADMIN_EMAIL)

# ---------------------------------------------------------------------------
# Managed email (Emergent Resend proxy)
# ---------------------------------------------------------------------------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        try:
            code = e.response.json().get("code", "")
        except ValueError:
            code = ""
        if code in ("insufficient_credits", "integration_disabled", "daily_limit_reached"):
            logger.warning(f"Email paused: {code} ({e.response.status_code}): {e.response.json().get('message', '')}")
            raise HTTPException(status_code=503, detail="Email is temporarily unavailable")
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


def _enquiry_email_html(data: dict) -> str:
    typ = "Appointment request" if data.get("type") == "appointment" else "Website enquiry"
    rows = [
        ("Type", typ),
        ("Name", data.get("name", "-")),
        ("Mobile", data.get("mobile", "-")),
        ("Email", data.get("email") or "Not provided"),
        ("Service interested in", data.get("service") or "-"),
        ("Preferred date", data.get("preferred_date") or "-"),
        ("Preferred time", data.get("preferred_time") or "-"),
        ("Preferred session", data.get("preferred_session") or "-"),
        ("Message", data.get("message") or "-"),
        ("Received at", data.get("created_at", "-")),
    ]
    cells = "".join(
        f'<tr>'
        f'<td style="padding:8px 16px 8px 0;color:#6B6258;font-size:13px;vertical-align:top">{escape(str(k))}</td>'
        f'<td style="padding:8px 0;color:#2B241E;font-size:14px;vertical-align:top">{escape(str(v))}</td>'
        f'</tr>'
        for k, v in rows
    )
    return (
        f'<div style="background:#FAF9F6;padding:24px;font-family:Arial,sans-serif">'
        f'<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #E5E0D8;border-radius:12px">'
        f'<div style="padding:20px 24px;border-bottom:1px solid #E5E0D8">'
        f'<p style="margin:0;color:#E8785A;font-size:12px;letter-spacing:2px;text-transform:uppercase">{escape(EMAIL_FROM_NAME)}</p>'
        f'<h1 style="margin:6px 0 0;color:#2B241E;font-size:20px">{escape(typ)} received</h1>'
        f'</div>'
        f'<table role="presentation" style="border-collapse:collapse;width:100%;padding:8px 24px">'
        f'<tbody>{cells}</tbody></table>'
        f'<div style="padding:16px 24px 24px">'
        f'<p style="margin:0;font-size:12px;color:#8A8178">You can also review this entry in the clinic dashboard.</p>'
        f'<p style="margin:8px 0 0;font-size:12px;color:#8A8178">Sent by {escape(EMAIL_FROM_NAME)} website. We never ask for your password or card details by email.</p>'
        f'</div></div></div>'
    )


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _set_auth_cookies(response, access_token: str, refresh_token: str):
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="none", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Not authorised")
    user.pop("password_hash", None)
    return user


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class EnquiryIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    type: str = Field(default="enquiry", pattern="^(enquiry|appointment)$")
    name: str = Field(min_length=2, max_length=100)
    mobile: str = Field(min_length=7, max_length=15)
    email: Optional[EmailStr] = None
    service: str = Field(default="General Consultation", max_length=120)
    preferred_date: Optional[str] = Field(default=None, max_length=40)
    preferred_time: Optional[str] = Field(default=None, max_length=40)
    preferred_session: Optional[str] = Field(default=None, max_length=60)
    message: Optional[str] = Field(default=None, max_length=2000)
    consent: Optional[bool] = False
    source: Optional[str] = Field(default=None, max_length=100)


class EnquiryStatusIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    status: str = Field(pattern="^(new|reviewed)$")


class ServiceIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=10, max_length=1200)
    image: str = Field(default="", max_length=1000)
    order: int = Field(default=99)
    active: bool = True


class LoginIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


# ---------------------------------------------------------------------------
# Public routes
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Vasudha Skin and Hair Clinic API", "status": "ok"}


@api_router.get("/services")
async def get_services():
    services = await db.services.find({"active": True}, {"_id": 0}).sort("order", ASCENDING).to_list(100)
    return services


PHONE_RE = re.compile(r"^(\+91|0)?[6-9]\d{9}$")
ALLOWED_SESSIONS = {"Morning: 11:00 AM to 2:00 PM", "Evening: 5:30 PM to 8:30 PM"}


@api_router.post("/enquiries")
async def create_enquiry(input: EnquiryIn):
    now = datetime.now(timezone.utc)
    mobile = re.sub(r"[\s\-]", "", input.mobile.strip())
    if not PHONE_RE.match(mobile):
        raise HTTPException(status_code=422, detail="Please enter a valid Indian mobile number")
    preferred_session = (input.preferred_session or "").strip() or None
    if preferred_session and preferred_session not in ALLOWED_SESSIONS:
        raise HTTPException(status_code=422, detail="Invalid consultation session")
    if input.type == "appointment" and not input.consent:
        raise HTTPException(status_code=422, detail="Consent is required to request an appointment")
    doc = {
        "id": str(uuid.uuid4()),
        "type": input.type,
        "name": input.name.strip(),
        "mobile": mobile,
        "email": (input.email or None),
        "service": input.service.strip(),
        "preferred_date": (input.preferred_date or None),
        "preferred_time": (input.preferred_time or None),
        "preferred_session": preferred_session,
        "message": (input.message or "").strip() or None,
        "consent": bool(input.consent),
        "source": (input.source or "Website").strip()[:100],
        "status": "Pending" if input.type == "appointment" else "new",
        "emailed": False,
        "created_at": now.isoformat(),
    }
    await db.enquiries.insert_one(doc)
    email_sent = False
    try:
        label = "New appointment request" if doc["type"] == "appointment" else "New website enquiry"
        subject = f"{label} - {doc['name']}".replace("\n", " ").replace("\r", " ")
        await send_email(to=OWNER_EMAIL, subject=subject, html=_enquiry_email_html(doc))
        email_sent = True
        await db.enquiries.update_one({"id": doc["id"]}, {"$set": {"emailed": True}})
    except Exception as exc:
        logger.warning(f"Enquiry saved but email notification failed: {exc}")
    return {"ok": True, "id": doc["id"], "email_sent": email_sent}


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------
@api_router.post("/auth/login")
async def login(input: LoginIn, request: Request, response: Response):
    email = input.email.lower().strip()
    identifier = f"{request.client.host}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        locked_until = datetime.fromisoformat(attempt["locked_until"])
        if datetime.now(timezone.utc) < locked_until:
            raise HTTPException(status_code=429, detail="Too many attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user.get("password_hash", "")):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {
                "$inc": {"count": 1},
                "$set": {
                    "locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
                    if (attempt or {}).get("count", 0) + 1 >= 5
                    else None,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
            },
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    access_token = create_access_token(user["id"], user["email"])
    refresh_token = create_refresh_token(user["id"])
    _set_auth_cookies(response, access_token, refresh_token)
    return {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


@api_router.post("/auth/refresh")
async def refresh(request: Request):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Not authorised")
    response = JSONResponse({"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": "admin"})
    _set_auth_cookies(response, create_access_token(user["id"], user["email"]), token)
    return response


@api_router.post("/auth/logout")
async def logout(request: Request):
    response = JSONResponse({"ok": True})
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return response


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_admin)):
    return user


# ---------------------------------------------------------------------------
# Admin routes
# ---------------------------------------------------------------------------
@api_router.get("/admin/enquiries")
async def list_enquiries(status: Optional[str] = Query(None), limit: int = Query(100, ge=1, le=500), user: dict = Depends(get_current_admin)):
    query = {"status": status} if status else {}
    enquiries = await db.enquiries.find(query, {"_id": 0}).sort("created_at", DESCENDING).limit(limit).to_list(limit)
    return enquiries


@api_router.patch("/admin/enquiries/{enquiry_id}")
async def update_enquiry(enquiry_id: str, input: EnquiryStatusIn, user: dict = Depends(get_current_admin)):
    result = await db.enquiries.update_one({"id": enquiry_id}, {"$set": {"status": input.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"ok": True}


@api_router.get("/admin/services")
async def admin_list_services(user: dict = Depends(get_current_admin)):
    return await db.services.find({}, {"_id": 0}).sort("order", ASCENDING).to_list(200)


@api_router.post("/admin/services")
async def admin_create_service(input: ServiceIn, user: dict = Depends(get_current_admin)):
    doc = {"id": str(uuid.uuid4()), **input.model_dump()}
    await db.services.insert_one(doc)
    return {k: v for k, v in doc.items()}


@api_router.put("/admin/services/{service_id}")
async def admin_update_service(service_id: str, input: ServiceIn, user: dict = Depends(get_current_admin)):
    result = await db.services.update_one({"id": service_id}, {"$set": input.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"ok": True}


@api_router.delete("/admin/services/{service_id}")
async def admin_delete_service(service_id: str, user: dict = Depends(get_current_admin)):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"ok": True}


# ---------------------------------------------------------------------------
# Seeds
# ---------------------------------------------------------------------------
SEED_SERVICES = [
    {"name": "Acne & Pimple Treatment", "description": "Medical evaluation and treatment for acne, pimples and oil-prone skin, tailored to your skin type to clear breakouts and prevent scarring.", "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200&auto=format&fit=crop", "order": 1},
    {"name": "Hair Fall & Hair Loss Treatment", "description": "Diagnosis and medically proven treatment for hair fall, thinning and hair-loss conditions, helping you regain stronger, healthier hair.", "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200&auto=format&fit=crop", "order": 2},
    {"name": "Pigmentation & Dark Spots", "description": "Treatment for melasma, tanning, dark spots and uneven skin tone to restore clear, even-toned and radiant skin.", "image": "https://images.unsplash.com/photo-1643684391140-c5056cfd3436?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200&auto=format&fit=crop", "order": 3},
    {"name": "Chemical Peels", "description": "Medical-grade peels that gently exfoliate and renew dull, rough or blemish-prone skin for a fresh, healthy glow.", "image": "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200&auto=format&fit=crop", "order": 4},
    {"name": "Anti-Ageing & Skin Rejuvenation", "description": "Advanced rejuvenation treatments including botox and skin-renewal procedures to soften fine lines and restore youthful skin.", "image": "https://images.unsplash.com/photo-1670201203208-055d6d79db4a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200&auto=format&fit=crop", "order": 6},
    {"name": "PRP & GFC Hair Therapy", "description": "Regenerative growth-factor therapies that stimulate natural hair growth and improve hair density in thinning areas.", "image": "https://images.unsplash.com/photo-1564141696939-9eb6e957ccfc?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200&auto=format&fit=crop", "order": 7},
    {"name": "Skin Allergy & Eczema Care", "description": "Diagnosis and long-term management of eczema, allergies, rashes and other chronic skin conditions for lasting relief.", "image": "https://images.unsplash.com/photo-1693004927824-f2623bbedc8b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200&auto=format&fit=crop", "order": 8},
]


async def seed_admin():
    admin_email = ADMIN_EMAIL.lower()
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Dr. Vasudha Varada",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user seeded")


async def seed_services():
    count = await db.services.count_documents({})
    if count == 0:
        for s in SEED_SERVICES:
            await db.services.insert_one({"id": str(uuid.uuid4()), "active": True, **s})
        logger.info("Services seeded")


async def cleanup_removed_services():
    result = await db.services.delete_many({"name": {"$regex": "laser", "$options": "i"}})
    if result.deleted_count:
        logger.info(f"Removed {result.deleted_count} laser service record(s) per clinic request")


@app.on_event("startup")
async def startup():
    app.state.index_task = asyncio.create_task(ensure_indexes())
    await seed_admin()
    await seed_services()
    await cleanup_removed_services()


@app.on_event("shutdown")
async def shutdown_db_client():
    app.state.index_task.cancel()
    with suppress(asyncio.CancelledError):
        await app.state.index_task
    client.close()


app.include_router(api_router)

origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]
if not origins:
    origins = [os.environ.get("FRONTEND_URL", "http://localhost:3000")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
