import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, formatApiError, useServices } from "@/lib/api";
import { toast } from "sonner";

const TIME_SLOTS = ["Morning: 11:00 AM to 2:00 PM", "Evening: 5:30 PM to 8:30 PM"];

export default function EnquiryForm({ type = "enquiry" }) {
  const isAppointment = type === "appointment";
  const [params] = useSearchParams();
  const { data: services = [] } = useServices();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    service: "",
    preferred_date: "",
    preferred_time: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    const s = params.get("service");
    if (s) setForm((f) => ({ ...f, service: s }));
  }, [params]);

  const serviceOptions = useMemo(
    () => [...services.map((s) => s.name), "Other / Not sure yet"],
    [services]
  );

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^[0-9+\-\s]{7,15}$/.test(form.mobile.trim())) {
      toast.error("Please enter a valid mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        type,
        name: form.name,
        mobile: form.mobile,
        email: form.email || null,
        service: form.service || serviceOptions[0],
        preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time || null,
        message: form.message || null,
      };
      const { data } = await api.post("/enquiries", payload);
      setDone({ ...payload, id: data.id });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-sand bg-white p-10 text-center" data-testid="enquiry-confirmation">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft">
          <CheckCircle2 className="h-7 w-7 text-sage-dark" />
        </span>
        <h3 className="mt-5 font-serif text-3xl text-ink">Thank you, {done.name.split(" ")[0]}!</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-smoke">
          {isAppointment
            ? "Your appointment request has been received. The clinic will call you shortly to confirm your slot."
            : "Your enquiry has been received. The clinic will get back to you as soon as possible."}
        </p>
        <button
          type="button"
          data-testid="enquiry-send-another-button"
          onClick={() => {
            setDone(null);
            setForm({ name: "", mobile: "", email: "", service: "", preferred_date: "", preferred_time: "", message: "" });
          }}
          className="mt-6 rounded-full border border-sand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-coral hover:text-coral"
        >
          Send another {isAppointment ? "request" : "enquiry"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      data-testid={isAppointment ? "appointment-form" : "enquiry-form"}
      className="rounded-3xl border border-sand bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ef-name">Patient Name *</Label>
          <Input id="ef-name" data-testid="enquiry-name-input" required minLength={2} value={form.name} onChange={set("name")} placeholder="Your full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ef-mobile">Mobile Number *</Label>
          <Input id="ef-mobile" data-testid="enquiry-mobile-input" required type="tel" value={form.mobile} onChange={set("mobile")} placeholder="e.g. 98765 43210" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ef-email">Email Address{isAppointment ? "" : ""}</Label>
          <Input id="ef-email" data-testid="enquiry-email-input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ef-service">Service Interested In *</Label>
          <select
            id="ef-service"
            data-testid="enquiry-service-select"
            required
            value={form.service || serviceOptions[0] || ""}
            onChange={set("service")}
            className="flex h-10 w-full rounded-xl border border-sand bg-white px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-coral"
          >
            {(serviceOptions.length ? serviceOptions : ["General Consultation"]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {isAppointment && (
          <>
            <div className="space-y-2">
              <Label htmlFor="ef-date">Preferred Date</Label>
              <Input id="ef-date" data-testid="appointment-date-input" type="date" value={form.preferred_date} onChange={set("preferred_date")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ef-time">Preferred Time</Label>
              <select
                id="ef-time"
                data-testid="appointment-time-select"
                value={form.preferred_time}
                onChange={set("preferred_time")}
                className="flex h-10 w-full rounded-xl border border-sand bg-white px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-coral"
              >
                <option value="">Any time</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className={`space-y-2 ${isAppointment ? "sm:col-span-2" : "sm:col-span-2"}`}>
          <Label htmlFor="ef-message">Message</Label>
          <Textarea id="ef-message" data-testid="enquiry-message-textarea" rows={4} value={form.message} onChange={set("message")} placeholder="Briefly describe your concern (optional)" />
        </div>
      </div>
      <button
        type="submit"
        data-testid={isAppointment ? "appointment-submit-button" : "enquiry-submit-button"}
        disabled={submitting}
        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-coral px-8 py-3.5 text-sm font-semibold text-white transition-[background-color,transform,box-shadow] duration-200 hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/25 disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Submitting..." : isAppointment ? "Request Appointment" : "Submit Enquiry"}
      </button>
      <p className="mt-4 text-xs leading-relaxed text-smoke">
        Your details are used only to respond to your {isAppointment ? "appointment request" : "enquiry"}.
      </p>
    </form>
  );
}
