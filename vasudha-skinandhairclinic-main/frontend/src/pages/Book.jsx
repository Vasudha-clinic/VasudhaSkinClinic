import { Phone, ClipboardList, CalendarCheck, Bell } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal, FadeIn } from "@/components/Reveal";
import AppointmentForm from "@/components/AppointmentForm";
import { SITE } from "@/lib/siteConfig";

const STEPS = [
  { icon: ClipboardList, text: "Share your details and concern through the form." },
  { icon: Bell, text: "The clinic reviews your request and calls you back." },
  { icon: CalendarCheck, text: "Your slot is confirmed — visit the clinic at ease." },
];

export default function Book() {
  return (
    <>
      <Seo
        title="Book an Appointment — Vasudha Skin & Hair Clinic"
        description="Book a dermatology appointment at Vasudha Skin and Hair Clinic, Muralinagar, Visakhapatnam. Request online, call +91 78427 37710 or WhatsApp the clinic."
      />
      <section className="container-x pb-10 pt-28 lg:pt-36">
        <FadeIn>
          <p className="eyebrow">Appointments</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] tracking-tighter text-ink sm:text-6xl">
            Book an <span className="italic text-coral">appointment.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-smoke">
            Fill in your details below — the clinic will call you to confirm your consultation slot.
          </p>
        </FadeIn>
      </section>

      <section className="container-x pb-24 lg:pb-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="rounded-3xl bg-sage-soft p-8">
                <h2 className="font-serif text-2xl text-ink">How it works</h2>
                <ul className="mt-6 space-y-6">
                  {STEPS.map((s, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sage-dark">
                        <s.icon className="h-4.5 w-4.5" />
                      </span>
                      <p className="pt-2 text-sm leading-relaxed text-ink">{s.text}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-sage/20 pt-6">
                  <p className="text-sm text-smoke">Consultation Hours</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">11:00 AM to 2:00 PM and 5:30 PM to 8:30 PM</p>
                  <p className="mt-4 text-sm text-smoke">Prefer to talk first?</p>
                  <a href={SITE.phoneHref} data-testid="book-phone-link" className="mt-1 block font-serif text-2xl text-ink transition-colors hover:text-coral">
                    {SITE.phoneDisplay}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.08}>
              <div className="rounded-3xl border border-sand bg-white p-6 sm:p-8">
                <AppointmentForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
