import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AppointmentForm from "./AppointmentForm";

const Ctx = createContext({ openModal: () => {}, closeModal: () => {} });
export const useAppointmentModal = () => useContext(Ctx);

const SESSION_KEY = "vasudha_appt_popup_seen";

export function AppointmentModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [concern, setConcern] = useState("");
  const openerRef = useRef(null);
  const dialogRef = useRef(null);
  const { pathname } = useLocation();

  const openModal = useCallback((prefill) => {
    openerRef.current = document.activeElement;
    setConcern(typeof prefill === "string" ? prefill : "");
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // storage unavailable — popup may reappear on next page load
    }
    const opener = openerRef.current;
    if (opener && document.contains(opener) && typeof opener.focus === "function") opener.focus();
  }, []);

  useEffect(() => {
    let timer;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // storage unavailable — still auto-show once per page load
    }
    if (pathname.startsWith("/admin")) return;
    timer = setTimeout(() => {
      try {
        if (sessionStorage.getItem(SESSION_KEY)) return;
      } catch {
        // ignore
      }
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (window.__lenis && typeof window.__lenis.stop === "function") window.__lenis.stop();

    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])") || []
      ).filter((el) => el.offsetParent !== null);

    const focusTimer = setTimeout(() => {
      dialogRef.current?.querySelector("input")?.focus();
    }, 120);

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && !dialogRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (window.__lenis && typeof window.__lenis.start === "function") window.__lenis.start();
    };
  }, [open, closeModal]);

  return (
    <Ctx.Provider value={{ openModal, closeModal }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80]"
          >
            <div
              aria-hidden="true"
              onClick={closeModal}
              data-testid="appointment-modal-backdrop"
              className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Book your appointment"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-x-0 bottom-0 top-0 flex items-end justify-center sm:items-center sm:p-6"
            >
              <div
                ref={dialogRef}
                data-testid="appointment-modal"
                className="pointer-events-auto flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-sand bg-ivory shadow-2xl sm:rounded-3xl"
              >
                <div className="flex items-start justify-between gap-4 border-b border-sand bg-white px-5 py-4 sm:px-6 sm:py-5">
                  <div>
                    <h2 className="font-serif text-2xl leading-tight text-ink">Book Your Appointment</h2>
                    <p className="mt-1 text-xs leading-relaxed text-smoke">
                      Share your details and our clinic team will contact you to confirm your appointment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close appointment form"
                    data-testid="appointment-modal-close-button"
                    className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white transition-transform duration-150 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="overflow-y-auto px-5 py-5 sm:px-6">
                  <AppointmentForm key={concern} defaultConcern={concern} onDone={closeModal} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
