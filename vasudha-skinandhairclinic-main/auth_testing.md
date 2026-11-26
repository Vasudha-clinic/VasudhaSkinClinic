# Auth Testing Playbook — Vasudha Skin and Hair Clinic

## Environment
- Admin account is seeded on backend startup from `/app/backend/.env`:
  - ADMIN_EMAIL: vasudhavarada@gmail.com
  - ADMIN_PASSWORD: VasudhaClinic@2025
- Collections: users (role=admin), enquiries, services, login_attempts.

## Step 1: MongoDB verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, unique index on users.email, index on login_attempts.identifier.

## Step 2: API testing (backend on 0.0.0.0:8001, external via REACT_APP_BACKEND_URL)
```
# Login (sets httpOnly cookies)
curl -c /tmp/cookies.txt -X POST "$API_URL/api/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"vasudhavarada@gmail.com","password":"VasudhaClinic@2025"}'

# Session check
curl -b /tmp/cookies.txt "$API_URL/api/auth/me"

# Admin data
curl -b /tmp/cookies.txt "$API_URL/api/admin/enquiries"
curl -b /tmp/cookies.txt "$API_URL/api/admin/services"

# Logout
curl -b /tmp/cookies.txt -X POST "$API_URL/api/auth/logout"
```

## Public endpoints
- POST /api/enquiries (contact form + appointment requests; also emails the clinic)
- GET /api/services (active services for the website)

## Brute force
- 5 failed logins per IP:email → 15-minute lockout (HTTP 429).
