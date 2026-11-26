# PRD — Vasudha Skin and Hair Clinic Website

## Original Problem Statement
Build a complete, functional, multi-page dermatology clinic website for Vasudha Skin and Hair Clinic (Muralinagar, Visakhapatnam) that builds trust, highlights services, introduces the doctor professionally, and makes it easy for patients to book appointments or contact the clinic. Design: clean, elegant, modern, professional; soft beige/ivory/white, muted rose, subtle earthy tones; premium but welcoming (not high-end spa); fast-loading, mobile responsive, SEO basics.

## Assets Provided (verified)
- Clinic logo (used in header, footer, favicon mark)
- Dr. Vasudha's photograph (About page only)
- Business card (address, phone, email)
- Dr. Vasudha Varada's CV (education, experience, achievements, publication)
- Google Maps place link (coordinates 17.7481451, 83.2599816)
- Instagram profile URL

## Architecture
- Frontend: React (CRA + craco), Tailwind, framer-motion (masked hero reveal, scroll reveals, parallax), lenis (momentum scroll), react-fast-marquee, react-helmet-async (per-route meta), sonner (toasts), shadcn/ui.
- Backend: FastAPI on 0.0.0.0:8001 (/api prefix), MongoDB via motor (DB_NAME env).
  - POST /api/enquiries — saves enquiry/appointment + emails clinic via Emergent managed Resend
  - GET /api/services — active services for public pages
  - JWT admin auth (/api/auth/login|logout|me|refresh, bcrypt, brute-force lockout)
  - Admin: GET/PATCH /api/admin/enquiries, CRUD /api/admin/services
  - Seeds: admin user + 8 services (idempotent)
- SEO: static head (title/description/OG/Twitter/JSON-LD MedicalBusiness), robots.txt (with AI-crawler group), llms.txt, favicon.svg, per-route Helmet meta. Canonical/og:url/sitemap omitted until a production domain is confirmed.

## User Personas
- Patient: wants to find services, trust the doctor, book an appointment or ask a question.
- Clinic owner (admin): reviews enquiries, marks them reviewed, edits services.

## Core Requirements (static)
1. Header: logo left, nav (Home, About, Services, Contact Us), Book an Appointment button.
2. Hero: clinic image, headline "Healthy Skin. Beautiful Hair. Confident You.", intro, Book + WhatsApp CTAs.
3. About the clinic section + Know More; Services card grid with images; Clinic Highlights; Appointment CTA.
4. About page: doctor photo, CV-based profile, qualifications, experience, achievements, publication. No invented facts.
5. Services page: editable service cards (DB-backed).
6. Contact page: address, phone, email, Google Maps embed, enquiry form (Name, Mobile, Email, Service, Message) + confirmation.
7. Floating WhatsApp button (wa.me/917842737710); appointment booking form flow (/book + home panel).
8. Footer: logo, intro, quick links, contact, Instagram/Facebook(email icon)/mail, copyright.

## Implemented (2026-11-10)
- All pages: Home, About, Services, Contact, Book, Admin dashboard (login, enquiries, service editor).
- Enquiry + appointment forms save to DB, email the clinic inbox, show confirmation.
- JWT admin auth with brute-force lockout; services editable add/remove/modify with visibility toggle.
- SEO head, JSON-LD, robots.txt, llms.txt, favicon, per-route meta; reduced-motion respected.
- Brand system: ivory/white base, coral #E8785A, sage #6B8E7B, gold #C5A880; Cormorant Garamond + Manrope.
- Update 1 (same day): refreshed logo asset, white header background, About-clinic image swapped to a clinic consultation photo, NMC-aligned Privacy Policy and Terms & Conditions pages (linked in header nav, mobile menu and footer), hero copy separators cleaned.
- Update 2 (2026-11-17): reusable appointment popup modal (auto-shows once per session 5s after entry, sessionStorage suppression, consent checkbox, inline validation, focus trap, scroll lock, Escape/backdrop/red-X close); all Book CTAs (header, mobile menu, hero, service cards, services/about CTAs, home panel, footer) open the same modal; appointments saved to the existing enquiries collection (status Pending, source "Website appointment popup", preferred_session, consent); laser treatments removed from DB, seeds, marquee, copy and meta; verified Google share link on Get Directions + View Google Business Profile CTAs; Facebook page linked; consultation hours displayed on Contact, footer, Book page and home panel.
- Update 3 (same day): hero image swapped to a simple, realistic clinic examination room; About-the-Clinic image swapped to a clean clinic waiting-room interior; About page doctor photo replaced with the updated desk portrait (optimized 190KB, centre-cropped in the arch frame).
- Update 4 (2026-11-17): clinic email updated to vasudhaskinclinic@gmail.com everywhere public (contact page, footer, Privacy/Terms, JSON-LD, llms.txt); About-page doctor photo background replaced with a clean clinic consultation room via AI image editing (face and identity preserved).
- Update 5 (2026-11-17): "Our Dermatology Expertise" subsection added to the About page (three cards: Medical Dermatology, Cosmetic Dermatology, Hair & Scalp Treatments with icons and treatment lists); Home navigation item highlighted with a burnt-orange (#E88A32) ribbon and white text on desktop and mobile menus.
- Update 6 (same day): expertise cards upgraded — every treatment now has a short patient-friendly description under its name; section retitled "Specialized Dermatology Treatments / Our Areas of Expertise"; Home ribbon recoloured to #D97732.
- Update 7 (same day): Services page rebuilt as tab-based treatment browser (Medical Dermatology, Cosmetic Dermatology, Hair & Scalp, Laser & Advanced) with numbered cards, per-treatment descriptions and "Enquire →" opening the appointment popup pre-filled; Laser & Advanced tab is fed dynamically by the existing services database (currently Pigmentation & Dark Spots and Anti-Ageing & Skin Rejuvenation — no invented procedures); category data single-sourced in siteConfig and shared with the About page.

## Backlog
- P0: Facebook page link (placeholder in footer); consultation hours (placeholder on Contact).
- P1: Patient testimonials section (admin-editable); gallery of clinic photos.
- P2: Canonical/sitemap/og:image once production domain confirmed; custom domain attach; deploy with bot-prerender toggle.

## Credentials
- Admin: vasudhavarada@gmail.com / VasudhaClinic@2025 (see /app/memory/test_credentials.md)

## 2026-11-24 — Treatment cleanup + header nav highlight
- Removed "Laser & Advanced" tab from Services.jsx and About.jsx (incl. DB-fed advanced items logic); only 3 tabs remain: Medical, Cosmetic, Hair & Scalp.
- Removed "Dermal Fillers" from Cosmetic (About + shared siteConfig).
- "Microneedling & RF" renamed to "Microneedling"; all radiofrequency copy removed.
- Header: active pill (#D97732, white text) now applies to Home, About, Services, Contact Us on desktop and mobile.
- Verified: no laser/RF/Dermal Filler references anywhere in frontend src/index.html; no mobile overflow-x.

## 2026-11-24 — Services cards with images
- Added a photo to every treatment card on the Services page (14 Pexels images, all verified 200 + loaded in browser).
- Cards restyled photo-led: image top (h-44, hover zoom), serial number overlaid as white pill on image — distinct from About's text-only cards.
- img field added to EXPERTISE_CATEGORIES in siteConfig.js; About ignores it (unchanged).
- Verified: 6/6 medical images loaded, no broken images, no mobile overflow-x.

## 2026-11-24 — Services page: six highlighted treatments
- Services.jsx replaced tab browser with a single grid of 6 clinic-highlighted services: Chemical Peels, Anti-Ageing Care, PRP & GFC Hair Therapy, Acne & Pimple Care, Pigmentation Correction, Hair Fall Treatments.
- Each card: image top + serial pill, name, one-line info, Enquire → (prefills appointment modal).
- About page tabbed expertise section untouched.
- Verified: 6/6 images loaded, 0 tabs remaining, no mobile overflow-x.

## 2026-11-24 — About treatment tabs: orange
- Active category tab pill in About treatments section changed from sage-dark to warm orange #D97732 (white text) for all three categories.
- Verified visually: Medical active tab orange, others white outline; cards unchanged.
