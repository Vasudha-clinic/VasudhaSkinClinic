import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { SITE } from "@/lib/siteConfig";
import { Logo } from "./Header";
import { useAppointmentModal } from "@/components/AppointmentModal";

const QUICK = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact Us" },
  { to: "/book", label: "Book an Appointment" },
];

const InstagramBrand = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
    <defs>
      <radialGradient id="igGrad" cx="0.3" cy="1.1" r="1.3">
        <stop offset="0" stopColor="#FFD600" />
        <stop offset="0.35" stopColor="#FF7A00" />
        <stop offset="0.6" stopColor="#FF0069" />
        <stop offset="0.9" stopColor="#D300C5" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#igGrad)" />
    <rect x="11.5" y="11.5" width="25" height="25" rx="8" fill="none" stroke="#fff" strokeWidth="3" />
    <circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="3" />
    <circle cx="31.5" cy="16.5" r="2" fill="#fff" />
  </svg>
);

const FacebookBrand = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#1877F2" />
    <path
      d="M27.6 15.8H31V10h-4.3c-4 0-6.2 2.6-6.2 6.2V20h-3.6v5.6h3.6V38h5.9V25.6h4.2l.7-5.6h-4.9v-3c0-1 .3-1.2 1.2-1.2z"
      fill="#fff"
    />
  </svg>
);

const MailBrand = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="#4F6B5C" />
    <rect x="12.5" y="16.5" width="23" height="16" rx="3" fill="none" stroke="#fff" strokeWidth="2.5" />
    <path d="M14 19l10 7.5L34 19" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Footer() {
  const { openModal } = useAppointmentModal();
  return (
    <footer className="bg-ink text-ivory/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-5">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/60">
            A trusted dermatology clinic in Visakhapatnam offering personalised, evidence-based care for your skin
            and hair — led by Dr. Vasudha Varada, M.D. (Dermatology).
          </p>
          <div className="mt-6 flex items-center gap-3" data-testid="footer-social-icons">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vasudha Skin and Hair Clinic on Instagram"
              data-testid="footer-instagram-link"
              className="inline-flex transition-transform duration-200 hover:-translate-y-0.5"
            >
              <InstagramBrand />
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer external"
              aria-label="Vasudha Skin and Hair Clinic on Facebook."
              title="Vasudha Skin and Hair Clinic on Facebook"
              data-testid="footer-facebook-link"
              className="inline-flex transition-transform duration-200 hover:-translate-y-0.5"
            >
              <FacebookBrand />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email the clinic"
              data-testid="footer-email-link"
              className="inline-flex transition-transform duration-200 hover:-translate-y-0.5"
            >
              <MailBrand />
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {QUICK.map((q) => (
              <li key={q.to}>
                {q.to === "/book" ? (
                  <button
                    type="button"
                    onClick={() => openModal()}
                    data-testid="footer-link-book-an-appointment"
                    className="cursor-pointer transition-colors duration-200 hover:text-gold"
                  >
                    Book an Appointment
                  </button>
                ) : (
                  <Link to={q.to} data-testid={`footer-link-${q.label.toLowerCase().replace(/\s/g, "-")}`} className="transition-colors duration-200 hover:text-gold">
                    {q.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <span className="leading-relaxed">{SITE.addressOneLine}</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <span className="leading-relaxed">{SITE.hoursLine}</span>
            </li>
            <li>
              <a href={SITE.mapsLink} target="_blank" rel="noopener noreferrer external" data-testid="footer-directions-link" className="inline-flex items-center gap-2 transition-colors hover:text-gold">
                <Navigation className="h-4 w-4 shrink-0 text-sage" />
                Get Directions
              </a>
            </li>
            <li>
              <a href={SITE.phoneHref} data-testid="footer-phone-link" className="flex gap-3 transition-colors hover:text-gold">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} data-testid="footer-mailto-link" className="flex gap-3 transition-colors hover:text-gold">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 pb-24 text-xs text-ivory/45 sm:flex-row sm:pb-6 sm:pr-44">
          <p data-testid="footer-copyright">© {new Date().getFullYear()} Vasudha Skin and Hair Clinic. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" data-testid="footer-legal-privacy-policy" className="transition-colors duration-200 hover:text-gold">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer" data-testid="footer-legal-terms-and-conditions" className="transition-colors duration-200 hover:text-gold">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/5">
        <div className="container-x flex flex-col items-center justify-center py-5 pb-20 text-center sm:pb-5" data-testid="footer-credit">
          <p className="text-[11px] tracking-wide text-ivory/35">
            Website Designed &amp; Developed by{" "}
            <span className="font-medium text-ivory/50 transition-colors duration-200 hover:text-gold">
              Digitalnyne Growth Studio
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
