import Seo from "@/components/Seo";
import { FadeIn, Reveal } from "@/components/Reveal";
import { SITE, DOCTOR } from "@/lib/siteConfig";

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: [
      `By using this website, you agree to these Terms and Conditions. If you do not agree, please do not use the site. This website is operated by ${SITE.fullName} ("the clinic").`,
    ],
  },
  {
    title: "2. About the clinic",
    body: [
      `The clinic is a dermatology practice located at ${SITE.addressOneLine}, led by ${DOCTOR.name}, ${DOCTOR.degrees}, ${DOCTOR.designation}, Registered Medical Practitioner (Regd. No. ${DOCTOR.regdNo}).`,
    ],
  },
  {
    title: "3. Informational purpose only",
    body: [
      "The content on this website is provided for general information about the clinic and the dermatology, skin and hair treatments it offers. It is not medical advice and is not a substitute for a personal consultation with a qualified doctor.",
      "Using this website, submitting a form or messaging the clinic on WhatsApp does not create a doctor-patient relationship. A doctor-patient relationship arises only after a consultation at the clinic.",
    ],
  },
  {
    title: "4. Medical emergencies",
    body: [
      "Do not use the forms, phone numbers or WhatsApp on this site for medical emergencies. In an emergency, call your local emergency number or go to the nearest hospital immediately.",
    ],
  },
  {
    title: "5. Appointments",
    body: [
      "An appointment request submitted through this website is a request only. A consultation slot is confirmed only after the clinic contacts you and confirms the date and time. Please arrive on time for confirmed appointments and inform the clinic in advance if you need to reschedule.",
    ],
  },
  {
    title: "6. No guarantees of results",
    body: [
      "Dermatology and aesthetic treatments respond differently from person to person. Nothing on this website is a promise, warranty or guarantee of any particular outcome. During your consultation, the doctor will explain the treatment options, likely results and any risks.",
    ],
  },
  {
    title: "7. Accuracy and availability",
    body: [
      "The clinic takes reasonable care to keep the information on this website accurate and up to date, but content may change without notice. The website is provided on an as-is basis, and access may be interrupted for maintenance.",
    ],
  },
  {
    title: "8. Intellectual property",
    body: [
      "The clinic's name, logo, photographs and the written content of this website belong to the clinic or are used with permission. You may not reproduce or reuse them without the clinic's written consent.",
    ],
  },
  {
    title: "9. Third-party links",
    body: [
      "This website links to third-party services such as Google Maps, Instagram and WhatsApp. The clinic is not responsible for the content or policies of those services.",
    ],
  },
  {
    title: "10. Limitation of liability",
    body: [
      "To the extent permitted by law, the clinic is not liable for any loss or damage arising from the use of, or inability to use, this website or the information on it.",
    ],
  },
  {
    title: "11. Governing law",
    body: [
      "These terms are governed by the laws of India, and the courts at Visakhapatnam have exclusive jurisdiction over any disputes.",
    ],
  },
];

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms & Conditions — Vasudha Skin & Hair Clinic"
        description="Terms for using the Vasudha Skin and Hair Clinic website, including appointment requests, informational content and disclaimers."
      />
      <section className="container-x pb-10 pt-28 lg:pt-36">
        <FadeIn>
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tighter text-ink sm:text-6xl">
            Terms &amp; <span className="italic text-coral">Conditions</span>
          </h1>
          <p className="mt-4 text-sm text-smoke">Last updated: 10 November 2026</p>
        </FadeIn>
      </section>
      <section className="container-x pb-24 lg:pb-32">
        <div className="max-w-3xl space-y-8">
          {SECTIONS.map((s) => (
            <Reveal key={s.title}>
              <div>
                <h2 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 text-sm leading-relaxed text-smoke">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
          <Reveal>
            <div className="rounded-3xl bg-sage-soft p-8">
              <h2 className="font-serif text-2xl tracking-tight text-ink">12. Contact</h2>
              <p className="mt-3 text-sm leading-relaxed text-smoke">
                Questions about these terms? Contact {SITE.fullName}, {SITE.addressOneLine}. Phone: {SITE.phoneDisplay} ·
                Email: {SITE.email}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
