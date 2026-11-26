import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { SITE } from "@/lib/siteConfig";
import { useAppointmentModal } from "@/components/AppointmentModal";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact Us" },
];

export const Logo = ({ light = false }) => (
  <Link to="/" data-testid="header-logo-link" className="flex items-center gap-2.5">
    <img
      src="/assets/logo.webp"
      alt="Vasudha Skin and Hair Clinic logo"
      className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/40"
      width="44"
      height="44"
    />
    <span className="leading-tight">
      <span className={`font-serif text-xl tracking-tight ${light ? "text-ivory" : "text-ink"}`}>Vasudha</span>
      <span className={`block text-[10px] font-semibold uppercase tracking-[0.22em] ${light ? "text-ivory/60" : "text-smoke"}`}>
        Skin &amp; Hair Clinic
      </span>
    </span>
  </Link>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { openModal } = useAppointmentModal();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled ? "border-b border-sage/20 bg-sage-soft/95 backdrop-blur-xl" : "border-b border-transparent bg-sage-soft/70 backdrop-blur-md"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between lg:h-20">
        <Logo />
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-link-${n.label.toLowerCase().replace(/\s/g, "-")}`}
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#D97732] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#c26826] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97732]/40"
                  : "relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-coral after:transition-all after:duration-300 after:w-0 text-smoke hover:text-ink"
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={SITE.phoneHref}
            data-testid="header-phone-link"
            className="hidden items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-coral md:flex"
          >
            <Phone className="h-4 w-4 text-sage" />
            {SITE.phoneDisplay}
          </a>
          <button
            type="button"
            onClick={() => openModal()}
            data-testid="header-book-appointment-button"
            className="btn-glow hidden rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-[background-color,transform,box-shadow] duration-200 hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/25 sm:inline-block"
          >
            Book an Appointment
          </button>
          <button
            type="button"
            data-testid="mobile-menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white/70 text-ink lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b border-sand bg-white/95 backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  data-testid={`mobile-nav-link-${n.label.toLowerCase().replace(/\s/g, "-")}`}
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-2xl bg-[#D97732] px-4 py-3 text-base font-semibold text-white"
                      : "rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-white"
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openModal();
                }}
                data-testid="mobile-book-appointment-button"
                className="btn-glow mt-2 rounded-full bg-coral px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Book an Appointment
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
