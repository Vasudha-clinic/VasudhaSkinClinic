import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ArrowRight, Award, Stethoscope, Sparkles, HeartHandshake, ShieldCheck, Phone } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal, MaskedLine, Rise, EASE } from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import { useAppointmentModal } from "@/components/AppointmentModal";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { SITE, DOCTOR, IMG, MARQUEE_ITEMS } from "@/lib/siteConfig";
import { useServices } from "@/lib/api";

function Hero() {
  const { openModal } = useAppointmentModal();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  return (
    <section ref={ref} className="relative overflow-hidden pb-16 pt-28 lg:pb-24 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 z-0 h-[420px] w-[420px] rounded-full bg-coral-soft/70 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-1/2 z-0 h-[380px] w-[380px] rounded-full bg-sage-soft blur-3xl" />
      <div className="container-x relative z-10 grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Rise>
            <p className="eyebrow">Dermatology &amp; Cosmetology in Visakhapatnam</p>
          </Rise>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tighter text-ink sm:text-6xl lg:text-7xl">
            <MaskedLine index={0}>Healthy Skin.</MaskedLine>
            <MaskedLine index={1} className="italic text-sage-dark">Beautiful Hair.</MaskedLine>
            <MaskedLine index={2} className="text-coral">Confident You.</MaskedLine>
          </h1>
          <Rise delay={0.45}>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/75">
              Vasudha Skin and Hair Clinic brings personalised, evidence-based dermatology to Muralinagar,
              Visakhapatnam. From acne, pigmentation and allergy care to hair loss therapy and aesthetic
              treatments, everything you need is here under one roof.
            </p>
          </Rise>
          <Rise delay={0.55}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => openModal()} data-testid="hero-book-appointment-button" className="btn-primary btn-glow">
                Book an Appointment <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="hero-whatsapp-button"
                className="btn-outline"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp Us
              </a>
            </div>
          </Rise>
          <Rise delay={0.65}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/70">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sage" /> M.D. Dermatologist
              </span>
              <span>Regd. No. {DOCTOR.regdNo}</span>
              <span>Muralinagar, Visakhapatnam</span>
            </div>
          </Rise>
        </div>
        <div className="lg:col-span-6">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div aria-hidden className="absolute -inset-3 rounded-b-[2.5rem] rounded-t-[10rem] border border-gold/50" />
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
              className="relative aspect-[4/5] overflow-hidden rounded-b-[2.5rem] rounded-t-[10rem] bg-sand/40"
            >
              <motion.img
                src={IMG.hero}
                alt="Consultation room at Vasudha Skin and Hair Clinic"
                style={{ y: imgY }}
                className="h-[112%] w-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
              className="absolute -bottom-6 -left-3 max-w-[270px] rounded-2xl border border-sand bg-white/95 px-5 py-4 shadow-xl shadow-ink/5 backdrop-blur-sm sm:-left-8"
              data-testid="hero-doctor-card"
            >
              <p className="font-serif text-lg leading-snug text-ink">{DOCTOR.name}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-smoke">{DOCTOR.degrees}</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-smoke">{DOCTOR.designation}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  return (
    <section className="border-y border-sand bg-white py-5" aria-label="Our treatments">
      <Marquee speed={45} gradient={false} pauseOnHover>
        {MARQUEE_ITEMS.map((item) => (
          <span key={item} className="mx-7 inline-flex items-center gap-7 font-serif text-xl italic text-ink/80">
            {item}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}

const APPROACH = [
  "Personalised, evidence-based treatment plans",
  "Comfortable, hygienic clinic environment",
  "Medical and cosmetic skin & hair care",
];

function AboutPreview() {
  return (
    <section className="container-x py-20 lg:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
              <img src={IMG.aboutPreview} alt="Skin care treatment at Vasudha Skin and Hair Clinic" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 right-4 rounded-2xl border border-sand bg-white/95 px-5 py-4 shadow-xl shadow-ink/5 backdrop-blur-sm sm:right-8">
              <p className="font-serif text-lg text-ink">Dr. Vasudha Varada</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-smoke">Consultant Dermatologist</p>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:pl-8">
          <Reveal>
            <p className="eyebrow">About the Clinic</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
              Care that is clinical at heart, warm in spirit.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-smoke">
              Vasudha Skin and Hair Clinic is a dedicated dermatology practice in Muralinagar, Visakhapatnam.
              Led by Dr. Vasudha Varada, the clinic combines sound medical dermatology with proven aesthetic
              treatments — so every patient receives honest advice, safe procedures and realistic results.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-4">
              {APPROACH.map((a) => (
                <li key={a} className="flex items-start gap-3 text-sm font-medium text-ink">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2}>
            <Link to="/about" data-testid="home-know-more-button" className="btn-outline mt-10">
              Know More <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ServicesPreview() {
  const { data: services = [], isLoading } = useServices();
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Our Services</p>
              <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
                Treatments for every skin and hair concern.
              </h2>
            </div>
            <Link to="/services" data-testid="home-view-all-services-link" className="inline-flex items-center gap-2 text-sm font-semibold text-coral transition-colors hover:text-coral-dark">
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {(isLoading ? Array.from({ length: 6 }) : services.slice(0, 6)).map((s, i) =>
            isLoading ? (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-sand/50" />
            ) : (
              <Reveal key={s.name} delay={0.05 * (i % 3)}>
                <ServiceCard service={s} index={i} />
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}

const HIGHLIGHTS = [
  { icon: Award, title: "Expert Dermatologist", text: "Qualified M.D. (Dermatology) specialist with consultant experience across Kochi, Bengaluru and Vijayawada." },
  { icon: Stethoscope, title: "Comprehensive Care", text: "Diagnosis and treatment for skin, hair and nail concerns — medical, procedural and cosmetic." },
  { icon: Sparkles, title: "Advanced Procedures", text: "Chemical peels, PRP therapy, botox and minor dermatosurgery performed with care." },
  { icon: HeartHandshake, title: "Patient-First Approach", text: "Personalised plans, clear guidance and comfortable, hygienic care at every visit." },
];

function Highlights() {
  return (
    <section className="container-x py-20 lg:py-28">
      <Reveal>
        <p className="eyebrow">Clinic Highlights</p>
        <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          Why patients trust Vasudha Skin and Hair Clinic.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h, i) => (
          <Reveal key={h.title} delay={0.06 * i}>
            <div className="h-full rounded-3xl border border-sand bg-white p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5" data-testid={`highlight-card-${i}`}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-soft text-sage-dark">
                <h.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-serif text-2xl text-ink">{h.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-smoke">{h.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AppointmentCTA() {
  const { openModal } = useAppointmentModal();
  return (
    <section className="container-x pb-24 pt-4 lg:pb-32" id="appointment">
      <Reveal>
        <div className="overflow-hidden rounded-[2.5rem] bg-ink text-ivory">
          <div className="grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Appointments</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                Healthy skin starts with one visit.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/70">
                Request an appointment online and the clinic will call you back to confirm a time that suits
                you. Prefer to talk first? Call us or send a WhatsApp message.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href={SITE.phoneHref}
                  data-testid="appointment-call-button"
                  className="inline-flex items-center gap-2 rounded-full border border-ivory/25 px-6 py-3 text-sm font-semibold text-ivory transition-colors duration-200 hover:border-gold hover:text-gold"
                >
                  <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
                </a>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="appointment-whatsapp-button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-ivory/15 bg-white/5 p-8 text-center sm:p-10" data-testid="appointment-panel-card">
              <p className="font-serif text-3xl text-ivory">Consultation Hours</p>
              <p className="text-sm leading-relaxed text-ivory/75">11:00 AM to 2:00 PM and 5:30 PM to 8:30 PM</p>
              <button type="button" onClick={() => openModal()} data-testid="appointment-panel-book-button" className="btn-glow btn-primary mt-1 w-full sm:w-auto">
                Book an Appointment
              </button>
              <p className="text-xs leading-relaxed text-ivory/55">
                Prefer to talk first? Call or WhatsApp us — the clinic will help you pick a slot.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        title="Vasudha Skin & Hair Clinic — Dermatologist in Visakhapatnam"
        description="Trusted dermatology clinic in Muralinagar, Visakhapatnam. Acne, hair loss, pigmentation and aesthetic treatments by Dr. Vasudha Varada, M.D. (Dermatology). Book an appointment today."
      />
      <Hero />
      <Ticker />
      <AboutPreview />
      <ServicesPreview />
      <Highlights />
      <AppointmentCTA />
    </>
  );
}
