import { ArrowRight } from "lucide-react";
import { useAppointmentModal } from "@/components/AppointmentModal";
import Seo from "@/components/Seo";
import { Reveal, FadeIn } from "@/components/Reveal";

const HIGHLIGHTED_SERVICES = [
  { name: "Chemical Peels", desc: "Professional peels that brighten dull skin, fade marks and smooth rough texture.", img: "https://images.pexels.com/photos/10600175/pexels-photo-10600175.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Anti-Ageing Care", desc: "Safe treatments that soften fine lines and keep your skin looking naturally youthful.", img: "https://images.pexels.com/photos/7581575/pexels-photo-7581575.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "PRP & GFC Hair Therapy", desc: "Growth-factor therapy using your own blood to strengthen and regrow thinning hair.", img: "https://images.pexels.com/photos/38595833/pexels-photo-38595833.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Acne & Pimple Care", desc: "Medical treatment for active acne and breakouts to calm and clear your skin.", img: "https://images.pexels.com/photos/5701545/pexels-photo-5701545.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Pigmentation Correction", desc: "Targeted care for dark spots, uneven tone and tanning for clearer, brighter skin.", img: "https://images.pexels.com/photos/7446669/pexels-photo-7446669.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Hair Fall Treatments", desc: "A proper diagnosis of your hair fall, followed by a treatment plan that actually works.", img: "https://images.pexels.com/photos/28994388/pexels-photo-28994388.jpeg?auto=compress&cs=tinysrgb&w=800" },
];

export default function Services() {
  const { openModal } = useAppointmentModal();
  const items = HIGHLIGHTED_SERVICES;

  return (
    <>
      <Seo
        title="Skin & Hair Treatments — Vasudha Skin & Hair Clinic"
        description="Explore dermatology treatments at Vasudha Skin and Hair Clinic, Visakhapatnam — acne care, hair-loss therapy, pigmentation treatment, chemical peels, PRP & GFC and more."
      />
      <section className="container-x pb-10 pt-28 lg:pt-36">
        <FadeIn>
          <p className="eyebrow">Our Services</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] tracking-tighter text-ink sm:text-6xl">
            Care for every <span className="italic text-sage-dark">skin &amp; hair</span> concern.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-smoke">
            Every treatment at Vasudha Skin and Hair Clinic begins with a proper consultation and a plan
            tailored to your skin. Explore our most requested treatments below and enquire to get started.
          </p>
        </FadeIn>
      </section>

      <section className="container-x pb-24 lg:pb-32">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t, i) => (
              <div
                key={t.name}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5"
                data-testid={`treatment-card-${i}`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 font-serif text-sm italic text-ink/80 backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl leading-snug text-ink">{t.name}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-smoke">{t.desc}</p>
                  <button
                    type="button"
                    onClick={() => openModal(t.name)}
                    data-testid={`treatment-enquire-${i}`}
                    className="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-coral transition-colors duration-200 hover:text-coral-dark"
                  >
                    Enquire <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <Reveal>
          <div className="mt-16 rounded-[2.5rem] bg-sage-soft px-8 py-12 text-center sm:px-12">
            <h2 className="mx-auto max-w-xl font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
              Not sure which treatment you need?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-smoke">
              Book a consultation with Dr. Vasudha Varada — she will examine your skin or hair concern and
              recommend the right course of treatment.
            </p>
            <button type="button" onClick={() => openModal()} data-testid="services-book-consultation-button" className="btn-primary btn-glow mt-8">
              Book a Consultation
            </button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
