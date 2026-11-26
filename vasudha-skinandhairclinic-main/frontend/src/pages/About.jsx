import { useState } from "react";
import { GraduationCap, Briefcase, ScrollText, Award, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppointmentModal } from "@/components/AppointmentModal";
import Seo from "@/components/Seo";
import { Reveal, FadeIn } from "@/components/Reveal";
import { DOCTOR, EXPERTISE_CATEGORIES } from "@/lib/siteConfig";

const EDUCATION = [
  { degree: "M.B.B.S.", place: "Andhra Medical College, Visakhapatnam", year: "2013" },
  { degree: "M.D. (Dermatology)", place: "Rangaraya Government Medical College, Kakinada", year: "2017" },
];

const EXPERIENCE = [
  { role: "Consultant Dermatologist", place: "Twacha Skin and Hair Clinic, Kochi", period: "Jul 2024 – May 2025" },
  { role: "Consultant Dermatologist", place: "Idha Skin Clinic, Bengaluru", period: "Feb 2022 – Apr 2024" },
  { role: "Senior Resident", place: "Siddhartha Government Medical College, Vijayawada", period: "Aug 2017 – Jul 2018" },
];

const EXPERTISE = [
  "Clinical dermatology",
  "Cosmetic dermatology",
  "Procedural dermatology",
  "PRP therapy",
  "Chemical peels",
  "Botox",
  "Dermatosurgery & biopsies",
];

const ACHIEVEMENTS = [
  "Appreciation certificate at a state-level quiz competition, ASRAM College, Eluru.",
  "Oral paper presentation on childhood leprosy at the Andhra Pradesh State Dermatology Conference.",
  "Poster presentation at Dermacon 2015, Mangalore.",
  "Publication: Vukkadala ND, Kishore JCKLP, Varada V. Clinical, bacteriological and histopathological profile of childhood leprosy. J. Evolution Med. Dent. Sci. 2017;6(24):2042–2045.",
];

export default function About() {
  const { openModal } = useAppointmentModal();
  const [activeTab, setActiveTab] = useState("medical");
  const tabs = [
    { key: "medical", label: "Medical Dermatology", tagline: "Effective, evidence-based care for long-term skin health.", items: EXPERTISE_CATEGORIES[0].items },
    {
      key: "cosmetic",
      label: "Cosmetic Dermatology",
      tagline: "Subtle, natural enhancement — never overdone.",
      items: [
        { name: "Anti-Wrinkle Injectables", desc: "Precise, conservative dosing that softens lines while keeping expression natural." },
        { name: "Skin Boosters & Profhilo", desc: "Injectable hydration that improves skin quality, glow and elasticity from within." },
        { name: "Medical-Grade Peels", desc: "Customised chemical peels for glow, pigmentation, texture and early signs of ageing." },
        { name: "Microneedling", desc: "Collagen-boosting micro-treatment that improves skin texture, scars and open pores." },
        { name: "HydraFacial & Medi-Facials", desc: "Physician-supervised deep cleansing and infusion protocols for instant radiance." },
      ],
    },
    { key: "hair", label: "Hair & Scalp", tagline: "Thicker, healthier hair — starting with the right diagnosis.", items: EXPERTISE_CATEGORIES[2].items },
  ];
  const activeTabData = tabs.find((t) => t.key === activeTab) || tabs[0];
  return (
    <>
      <Seo
        title="About Dr. Vasudha Varada — Vasudha Skin & Hair Clinic"
        description="Meet Dr. Vasudha Varada, M.B.B.S., M.D. (Dermatology) — Consultant Dermatologist & Cosmetologist at Vasudha Skin and Hair Clinic, Visakhapatnam."
      />
      <section className="container-x pb-10 pt-28 lg:pt-36">
        <FadeIn>
          <p className="eyebrow">About</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] tracking-tighter text-ink sm:text-6xl">
            Meet <span className="italic text-coral">Dr. Vasudha Varada</span>
          </h1>
        </FadeIn>
      </section>

      <section className="container-x pb-20 lg:pb-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative mx-auto max-w-sm">
                <div aria-hidden className="absolute -inset-3 rounded-b-[2.5rem] rounded-t-[10rem] border border-gold/50" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2.5rem] rounded-t-[10rem] bg-sand/40">
                  <img
                    src={DOCTOR.photo}
                    alt={`${DOCTOR.name}, ${DOCTOR.degrees} — Consultant Dermatologist`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="mx-auto mt-8 max-w-sm rounded-3xl border border-sand bg-white p-6" data-testid="about-doctor-card">
                <p className="font-serif text-2xl text-ink">{DOCTOR.name}</p>
                <p className="mt-1 text-sm text-smoke">{DOCTOR.degrees}</p>
                <p className="text-sm text-smoke">{DOCTOR.designation}</p>
                <p className="mt-3 inline-block rounded-full bg-sage-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-dark">
                  Regd. No. {DOCTOR.regdNo}
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                A dermatologist devoted to honest, effective care.
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-smoke">
                <p>
                  Dr. Vasudha Varada is a Consultant Dermatologist and Cosmetologist practising at Vasudha
                  Skin and Hair Clinic, Visakhapatnam. She completed her M.B.B.S. at Andhra Medical College,
                  Visakhapatnam, and her M.D. in Dermatology at Rangaraya Government Medical College, Kakinada.
                </p>
                <p>
                  Over her clinical career she has served as a Consultant Dermatologist at Twacha Skin and
                  Hair Clinic in Kochi and Idha Skin Clinic in Bengaluru, and began her postgraduate career as
                  a Senior Resident at Siddhartha Government Medical College, Vijayawada.
                </p>
                <p>
                  Her practice spans clinical and cosmetic dermatology — diagnosing and treating a wide range
                  of skin, hair and nail conditions, and performing procedures such as PRP therapy, chemical
                  peels, botox and minor dermatosurgery. She believes in thorough skin
                  examinations, accurate diagnosis and treatment plans that are tailored to each patient.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">Special Interests &amp; Expertise</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {EXPERTISE.map((e) => (
                    <span key={e} className="rounded-full border border-sand bg-white px-4 py-2 text-xs font-semibold text-ink">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-x pb-20 lg:pb-28">
        <Reveal>
          <p className="eyebrow">Specialized Dermatology Treatments</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            Our Areas of Expertise.
          </h2>
        </Reveal>
        <div className="mt-10 flex flex-wrap gap-3" role="tablist" aria-label="Treatment categories">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-testid={`about-tab-${tab.key}`}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-300 ${
                activeTab === tab.key
                  ? "bg-[#D97732] text-white shadow-md"
                  : "border border-sand bg-white text-ink hover:border-sage"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <p className="mt-9 font-serif text-xl italic text-ink/80 sm:text-2xl" data-testid="about-tab-tagline">
              {activeTabData.tagline}
            </p>
            <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {activeTabData.items.map((t, i) => (
                <div
                  key={t.name}
                  className="group flex h-full flex-col rounded-2xl border border-sand bg-white p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5"
                  data-testid={`about-treatment-card-${i}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-2xl leading-snug text-ink">{t.name}</h3>
                    <span className="font-serif text-xl italic text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-smoke">{t.desc}</p>
                  <button
                    type="button"
                    onClick={() => openModal(t.name)}
                    data-testid={`about-treatment-enquire-${i}`}
                    className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-ink transition-colors duration-200 hover:text-coral"
                  >
                    Enquire <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-x grid gap-8 lg:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-3xl border border-sand p-8" data-testid="about-education-card">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-soft text-sage-dark">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-serif text-2xl text-ink">Education</h3>
              <ul className="mt-5 space-y-5">
                {EDUCATION.map((e) => (
                  <li key={e.degree}>
                    <p className="text-sm font-semibold text-ink">{e.degree}</p>
                    <p className="text-sm text-smoke">{e.place}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">{e.year}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-3xl border border-sand p-8" data-testid="about-experience-card">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-soft text-sage-dark">
                <Briefcase className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-serif text-2xl text-ink">Experience</h3>
              <ul className="mt-5 space-y-5">
                {EXPERIENCE.map((x) => (
                  <li key={x.place} className="relative border-l border-sand pl-4">
                    <p className="text-sm font-semibold text-ink">{x.role}</p>
                    <p className="text-sm text-smoke">{x.place}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">{x.period}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="h-full rounded-3xl border border-sand p-8" data-testid="about-achievements-card">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-soft text-sage-dark">
                <ScrollText className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-serif text-2xl text-ink">Achievements &amp; Publications</h3>
              <ul className="mt-5 space-y-4">
                {ACHIEVEMENTS.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-smoke">
                    <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        <div className="container-x mt-14 text-center">
          <Reveal>
            <p className="mx-auto max-w-xl font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
              "Every skin is different. My approach is simple — listen first, diagnose carefully, and treat
              with what actually works."
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-smoke">— {DOCTOR.name}</p>
            <button type="button" onClick={() => openModal()} data-testid="about-book-button" className="btn-primary btn-glow mt-9">
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
