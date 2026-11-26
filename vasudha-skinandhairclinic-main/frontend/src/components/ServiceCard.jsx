import { ArrowRight } from "lucide-react";
import { useAppointmentModal } from "@/components/AppointmentModal";

export default function ServiceCard({ service, index = 0 }) {
  const { openModal } = useAppointmentModal();
  return (
    <button
      type="button"
      onClick={() => openModal(service.name)}
      data-testid={`service-card-${index}`}
      className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-sand bg-white text-left transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl hover:shadow-ink/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand/40">
        <img
          src={service.image}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sage-dark backdrop-blur-sm">
          Treatment
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-2xl leading-snug text-ink">{service.name}</h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-smoke">{service.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-coral">
          Book this treatment
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}
