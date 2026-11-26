import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, useServices } from "@/lib/api";
import { SESSIONS } from "@/lib/siteConfig";

const PHONE_RE = /^(\+91|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const clean = (v) => v.replace(/\s+/g, " ").trim();

const EMPTY = { name: "", phone: "", email: "", concern: "", preferred_date: "", preferred_session: "", message: "" };

export default function AppointmentForm({ defaultConcern = "", onDone }) {
  const { data: services = [] } = useServices();
  const [form, setForm] = useState({ ...EMPTY, concern: defaultConcern || "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const concerns = useMemo(() => {
    const names = services.map((s) => s.name);
    if (defaultConcern && !names.includes(defaultConcern)) names.unshift(defaultConcern);
    return names.includes("General Consultation") ? names : [...names, "General Consultation"];
  }, [services, defaultConcern]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = "Please enter the patient's full name.";
    const phone = form.phone.replace(/[\s-]/g, "");
    if (!phone) e.phone = "Please enter your phone number.";
    else if (!PHONE_RE.test(phone)) e.phone = "Enter a valid Indian mobile number, e.g. 98765 43210.";
    if (!form.email.trim()) e.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (!form.concern) e.concern = "Please choose your primary concern.";
    if (!form.preferred_date) e.preferred_date = "Please choose a preferred date.";
    else if (form.preferred_date < todayStr()) e.preferred_date = "Please choose today or a future date.";
    if (!form.preferred_session) e.preferred_session = "Please select a consultation session.";
    if (!consent) e.consent = "Please agree to be contacted so we can confirm your request.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    const e = validate();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    setSubmitting(true);
    setServerError("");
    try {
      await api.post("/enquiries", {
        type: "appointment",
        name: clean(form.name),
        mobile: form.phone.replace(/[\s-]/g, ""),
        email: form.email.trim(),
        service: form.concern,
        preferred_date: form.preferred_date,
        preferred_session: form.preferred_session,
        message: clean(form.message) || null,
        consent: true,
        source: "Website appointment popup",
      });
      setDone(true);
      setForm({ ...EMPTY });
      setConsent(false);
    } catch {
      setServerError("We could not submit your request right now. Please try again or contact the clinic directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="py-6 text-center" data-testid="appointment-success-state">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft">
          <CheckCircle2 className="h-7 w-7 text-sage-dark" />
        </span>
        <p className="mt-4 text-sm leading-relaxed text-ink" data-testid="appointment-success-message">
          Appointment request received. Our clinic team will contact you shortly to confirm the date and time.
        </p>
        <button
          type="button"
          data-testid="appointment-success-done-button"
          onClick={() => {
            setDone(false);
            if (onDone) onDone();
          }}
          className="btn-primary mt-6"
        >
          Done
        </button>
      </div>
    );
  }

  const err = (k) =>
    errors[k] ? (
      <p className="mt-1.5 text-xs leading-relaxed text-red-600" data-testid={`appointment-error-${k}`}>
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} noValidate data-testid="appointment-modal-form" className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="ap-name">Full name *</Label>
        <Input id="ap-name" data-testid="appointment-name-input" value={form.name} onChange={set("name")} placeholder="Your full name" autoComplete="name" />
        {err("name")}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ap-phone">Phone number *</Label>
        <Input id="ap-phone" data-testid="appointment-phone-input" type="tel" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="e.g. 98765 43210" autoComplete="tel" />
        {err("phone")}
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="ap-email">Email address *</Label>
        <Input id="ap-email" data-testid="appointment-email-input" type="email" inputMode="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
        {err("email")}
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="ap-concern">Primary skin or hair concern *</Label>
        <select
          id="ap-concern"
          data-testid="appointment-concern-select"
          value={form.concern || ""}
          onChange={set("concern")}
          className="flex h-10 w-full rounded-xl border border-sand bg-white px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-coral"
        >
          <option value="">Select your concern</option>
          {concerns.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {err("concern")}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ap-date">Preferred appointment date *</Label>
        <Input id="ap-date" data-testid="appointment-date-input" type="date" min={todayStr()} value={form.preferred_date} onChange={set("preferred_date")} />
        {err("preferred_date")}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ap-session">Preferred consultation session *</Label>
        <select
          id="ap-session"
          data-testid="appointment-session-select"
          value={form.preferred_session}
          onChange={set("preferred_session")}
          className="flex h-10 w-full rounded-xl border border-sand bg-white px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-coral"
        >
          <option value="">Select a session</option>
          {SESSIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {err("preferred_session")}
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="ap-message">Additional message (optional)</Label>
        <Textarea id="ap-message" data-testid="appointment-message-textarea" rows={3} value={form.message} onChange={set("message")} placeholder="Anything you would like us to know (optional)" />
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink">
          <input
            type="checkbox"
            data-testid="appointment-consent-checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setErrors((er) => ({ ...er, consent: undefined }));
            }}
            className="mt-0.5 h-4 w-4 rounded border-sand accent-[#E8785A]"
          />
          <span>I agree to be contacted by Vasudha Skin and Hair Clinic regarding my appointment request.</span>
        </label>
        {err("consent")}
      </div>
      {serverError && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700 sm:col-span-2" data-testid="appointment-error-server">
          {serverError}
        </p>
      )}
      <button type="submit" data-testid="appointment-submit-button" disabled={submitting} className="btn-primary sm:col-span-2 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? "Submitting..." : "Request Appointment"}
      </button>
    </form>
  );
}
