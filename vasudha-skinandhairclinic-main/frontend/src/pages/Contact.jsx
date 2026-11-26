import { MapPin, Phone, Mail, Clock, Navigation, Globe } from "lucide-react";
import Seo from "@/components/Seo";
import { Reveal, FadeIn } from "@/components/Reveal";
import EnquiryForm from "@/components/EnquiryForm";
import { WhatsAppIcon } from "@/components/WhatsAppFloat";
import { SITE } from "@/lib/siteConfig";

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact Us — Vasudha Skin & Hair Clinic, Visakhapatnam"
        description="Visit Vasudha Skin and Hair Clinic at Muralinagar, Visakhapatnam. Call +91 78427 37710, WhatsApp us or send an enquiry — Dr. Vasudha Varada will be glad to help."
      />
      <section className="container-x pb-10 pt-28 lg:pt-36">
        <FadeIn>
          <p className="eyebrow">Contact Us</p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] tracking-tighter text-ink sm:text-6xl">
            We are here to <span className="italic text-coral">help.</span>
          </h1>
        </FadeIn>
      </section>

      <section className="container-x pb-20 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <Reveal>
              <div className="rounded-3xl border border-sand bg-white p-8" data-testid="contact-details-card">
                <h2 className="font-serif text-3xl text-ink">{SITE.fullName}</h2>
                <ul className="mt-6 space-y-5 text-sm">
                  <li className="flex gap-3.5">
                    <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage" />
                    <span className="leading-relaxed text-ink">{SITE.addressOneLine}</span>
                  </li>
                  <li className="flex gap-3.5">
                    <Clock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage" />
                    <span className="leading-relaxed text-ink">{SITE.hoursLine}</span>
                  </li>
                  <li>
                    <a href={SITE.phoneHref} data-testid="contact-phone-link" className="flex gap-3.5 text-ink transition-colors hover:text-coral">
                      <Phone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage" />
                      {SITE.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${SITE.email}`} data-testid="contact-email-link" className="flex gap-3.5 break-all text-ink transition-colors hover:text-coral">
                      <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sage" />
                      {SITE.email}
                    </a>
                  </li>
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer external"
                    data-testid="contact-whatsapp-button"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
                  </a>
                  <a
                    href={SITE.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer external"
                    data-testid="contact-directions-button"
                    className="inline-flex items-center gap-2 rounded-full border border-sand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-coral hover:text-coral"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Get Directions
                  </a>
                  <a
                    href={SITE.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer external"
                    data-testid="contact-profile-button"
                    className="inline-flex items-center gap-2 rounded-full border border-sand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-coral hover:text-coral"
                  >
                    <Globe className="h-3.5 w-3.5" /> View Google Business Profile
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <p className="mb-5 text-sm font-semibold text-ink">Send us an enquiry</p>
              <EnquiryForm type="enquiry" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-x pb-24 lg:pb-32">
        <Reveal>
          <div className="overflow-hidden rounded-[2.5rem] border border-sand" data-testid="contact-map">
            <iframe
              title="Vasudha Skin and Hair Clinic on Google Maps"
              src={SITE.mapsEmbed}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}
