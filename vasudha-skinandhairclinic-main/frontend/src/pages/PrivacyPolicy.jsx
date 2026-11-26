import Seo from "@/components/Seo";
import { FadeIn, Reveal } from "@/components/Reveal";
import { SITE, DOCTOR } from "@/lib/siteConfig";

const SECTIONS = [
  {
    title: "1. Who we are",
    body: [
      `This website is operated by ${SITE.fullName} ("we", "the clinic"), a dermatology clinic located at ${SITE.addressOneLine}. The clinic is led by ${DOCTOR.name}, ${DOCTOR.degrees}, ${DOCTOR.designation}, Registered Medical Practitioner (Regd. No. ${DOCTOR.regdNo}).`,
    ],
  },
  {
    title: "2. Information we collect",
    body: [
      "When you use the enquiry or appointment forms on this website, we collect the details you provide: your name, mobile number, email address (if given), the service you are interested in, any preferred date and time, and your message.",
      "Like most websites, our servers may also record basic technical information (such as browser type and pages visited) to keep the site running smoothly.",
    ],
  },
  {
    title: "3. How we use your information",
    body: [
      "We use the information you submit only to respond to your enquiry, contact you to confirm appointment requests, and maintain basic records of communications with the clinic. We do not use your details for marketing messages unless you have asked us to.",
    ],
  },
  {
    title: "4. Medical information",
    body: [
      "Please do not share detailed medical history, prescriptions, photographs of medical conditions, or identity documents through this website or WhatsApp. These are best discussed during your in-person consultation, where your information remains confidential.",
    ],
  },
  {
    title: "5. Confidentiality",
    body: [
      "Information you share during a consultation is treated as confidential and handled in line with the professional and ethical standards expected of registered medical practitioners in India.",
    ],
  },
  {
    title: "6. Data sharing",
    body: [
      "We do not sell or rent your personal information. It is shared only with the service providers that help operate this website (such as email delivery and hosting) strictly for that purpose, or where disclosure is required by law.",
    ],
  },
  {
    title: "7. Data security and retention",
    body: [
      "We apply reasonable technical and organisational safeguards to protect the information you submit. We keep it only as long as needed for the purposes described above, or as required by law.",
    ],
  },
  {
    title: "8. Cookies",
    body: [
      "This website uses only basic browser storage needed for the site to function. We do not run advertising trackers.",
    ],
  },
  {
    title: "9. Your rights",
    body: [
      `You may ask us to access, correct or delete the personal information you have submitted through this website by writing to ${SITE.email}.`,
    ],
  },
  {
    title: "10. Children",
    body: [
      "This website is not intended to collect information directly from children. Parents or guardians may submit an enquiry on a child's behalf.",
    ],
  },
  {
    title: "11. Changes to this policy",
    body: [
      "We may update this policy from time to time. The latest version will always be available on this page.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy — Vasudha Skin & Hair Clinic"
        description="How Vasudha Skin and Hair Clinic collects, uses and protects the personal information patients submit through this website."
      />
      <section className="container-x pb-10 pt-28 lg:pt-36">
        <FadeIn>
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tighter text-ink sm:text-6xl">
            Privacy <span className="italic text-coral">Policy</span>
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
                For any privacy questions, contact {SITE.fullName}, {SITE.addressOneLine}. Phone: {SITE.phoneDisplay} ·
                Email: {SITE.email}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
