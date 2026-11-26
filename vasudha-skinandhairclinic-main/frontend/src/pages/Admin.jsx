import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, RefreshCw, Plus, Pencil, Trash2, CalendarDays, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, formatApiError } from "@/lib/api";
import { DOCTOR, SITE } from "@/lib/siteConfig";

const emptyService = { name: "", description: "", image: "", order: 99, active: true };

function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      onAuth(data);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(formatApiError(err, "Login failed"));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <form onSubmit={submit} data-testid="admin-login-form" className="w-full max-w-sm rounded-3xl border border-sand bg-white p-8">
        <img src="/assets/logo.webp" alt="Clinic logo" className="mx-auto h-14 w-14 rounded-full" />
        <h1 className="mt-4 text-center font-serif text-3xl text-ink">Clinic Dashboard</h1>
        <p className="mt-1 text-center text-sm text-smoke">{SITE.fullName}</p>
        <div className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" data-testid="admin-email-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input id="admin-password" data-testid="admin-password-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          </div>
        </div>
        <Button type="submit" data-testid="admin-login-button" disabled={busy} className="mt-6 w-full rounded-full bg-coral py-3 text-sm font-semibold text-white hover:bg-coral-dark">
          {busy ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}

function Enquiries() {
  const queryClient = useQueryClient();
  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: () => api.get("/admin/enquiries").then((r) => r.data),
  });

  const markReviewed = async (id) => {
    try {
      await api.patch(`/admin/enquiries/${id}`, { status: "reviewed" });
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
      toast.success("Marked as reviewed");
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <div data-testid="admin-enquiries-panel">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-smoke">{enquiries.length} total enquiries</p>
        <Button variant="outline" size="sm" data-testid="admin-refresh-enquiries-button" onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] })} className="rounded-full">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>
      {isLoading && <p className="text-sm text-smoke">Loading enquiries...</p>}
      {!isLoading && enquiries.length === 0 && (
        <p className="rounded-3xl border border-dashed border-sand p-10 text-center text-sm text-smoke">
          No enquiries yet. New enquiries from the website will appear here.
        </p>
      )}
      <div className="space-y-4">
        {enquiries.map((q) => (
          <div key={q.id} className="rounded-3xl border border-sand bg-white p-6" data-testid="admin-enquiry-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="font-serif text-xl text-ink">{q.name}</p>
                  <Badge className={q.type === "appointment" ? "bg-coral-soft text-coral-dark hover:bg-coral-soft" : "bg-sage-soft text-sage-dark hover:bg-sage-soft"}>
                    {q.type === "appointment" ? "Appointment" : "Enquiry"}
                  </Badge>
                  {q.status !== "new" && <Badge variant="outline">{q.status === "reviewed" ? "Reviewed" : q.status}</Badge>}
                </div>
                <p className="mt-1.5 text-sm text-smoke">
                  <a href={`tel:${q.mobile}`} className="font-medium text-ink hover:text-coral">{q.mobile}</a>
                  {q.email && <> · {q.email}</>}
                  {" · "}
                  {new Date(q.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              {q.status !== "reviewed" && (
                <Button size="sm" data-testid={`admin-review-button-${q.id}`} onClick={() => markReviewed(q.id)} className="rounded-full bg-ink text-white hover:bg-ink/80">
                  Mark reviewed
                </Button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-smoke">
              <span><MessageSquare className="mr-1.5 inline h-4 w-4 text-sage" />{q.service}</span>
              {q.preferred_date && <span><CalendarDays className="mr-1.5 inline h-4 w-4 text-sage" />{q.preferred_date} {q.preferred_time || ""}</span>}
              {q.preferred_session && <span><CalendarDays className="mr-1.5 inline h-4 w-4 text-sage" />{q.preferred_session}</span>}
              {q.source && <span className="text-xs text-ivory/60 bg-ink/70 rounded-full px-2.5 py-1">{q.source}</span>}
              {q.emailed && <span className="text-xs font-semibold uppercase tracking-wide text-sage-dark">Emailed to clinic</span>}
            </div>
            {q.message && <p className="mt-3 rounded-2xl bg-ivory p-4 text-sm leading-relaxed text-ink">{q.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceEditor() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => api.get("/admin/services").then((r) => r.data),
  });

  const openNew = () => {
    setEditing({ ...emptyService });
    setOpen(true);
  };
  const openEdit = (s) => {
    setEditing({ ...s });
    setOpen(true);
  };

  const save = async () => {
    if (!editing.name.trim() || editing.description.trim().length < 10) {
      toast.error("Name and a description of at least 10 characters are required.");
      return;
    }
    try {
      if (editing.id) await api.put(`/admin/services/${editing.id}`, editing);
      else await api.post("/admin/services", editing);
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setOpen(false);
      toast.success("Service saved");
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/services/${s.id}`);
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted");
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <div data-testid="admin-services-panel">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-smoke">{services.length} services shown on the website</p>
        <Button size="sm" data-testid="admin-add-service-button" onClick={openNew} className="rounded-full bg-coral text-white hover:bg-coral-dark">
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>
      {isLoading && <p className="text-sm text-smoke">Loading services...</p>}
      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-3xl border border-sand bg-white p-4" data-testid="admin-service-row">
            {s.image ? (
              <img src={s.image} alt="" className="h-14 w-20 rounded-xl object-cover" />
            ) : (
              <div className="h-14 w-20 rounded-xl bg-sand/60" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{s.name}</p>
              <p className="truncate text-sm text-smoke">{s.description}</p>
            </div>
            <Badge variant="outline">#{s.order}</Badge>
            <Badge className={s.active ? "bg-sage-soft text-sage-dark hover:bg-sage-soft" : ""}>{s.active ? "Visible" : "Hidden"}</Badge>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" data-testid={`admin-edit-service-${s.id}`} onClick={() => openEdit(s)} className="rounded-full">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" data-testid={`admin-delete-service-${s.id}`} onClick={() => remove(s)} className="rounded-full text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-3xl" data-testid="admin-service-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-ink">{editing?.id ? "Edit service" : "Add service"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="svc-name">Service name</Label>
                <Input id="svc-name" data-testid="admin-service-name-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. Acne & Pimple Treatment" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-desc">Description</Label>
                <Textarea id="svc-desc" data-testid="admin-service-description-textarea" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Short, patient-friendly description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-image">Image URL</Label>
                <Input id="svc-image" data-testid="admin-service-image-input" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label htmlFor="svc-order">Display order</Label>
                  <Input id="svc-order" data-testid="admin-service-order-input" type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value || "99", 10) })} className="w-28" />
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <Switch id="svc-active" data-testid="admin-service-active-switch" checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                  <Label htmlFor="svc-active">Visible on website</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" data-testid="admin-service-cancel-button" onClick={() => setOpen(false)} className="rounded-full">Cancel</Button>
            <Button data-testid="admin-service-save-button" onClick={save} className="rounded-full bg-coral text-white hover:bg-coral-dark">Save Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => setUser(null));
  }, []);

  if (user === undefined) {
    return <div className="flex min-h-screen items-center justify-center bg-ivory text-sm text-smoke" data-testid="admin-loading-state">Loading...</div>;
  }
  if (user === null) {
    return <Login onAuth={setUser} />;
  }

  return (
    <div className="min-h-screen bg-ivory" data-testid="admin-dashboard">
      <header className="border-b border-sand bg-white/80 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.webp" alt="Clinic logo" className="h-9 w-9 rounded-full" />
            <div>
              <p className="font-serif text-lg leading-tight text-ink">Clinic Dashboard</p>
              <p className="text-[11px] text-smoke">Signed in as {user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-testid="admin-logout-button"
            onClick={async () => {
              await api.post("/auth/logout");
              setUser(null);
            }}
            className="rounded-full"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>
      <main className="container-x py-10">
        <h1 className="font-serif text-4xl tracking-tight text-ink">Good day, {DOCTOR.name.split(" ")[1]}.</h1>
        <p className="mt-2 text-sm text-smoke">Manage patient enquiries and the services shown on your website.</p>
        <Tabs defaultValue="enquiries" className="mt-8">
          <TabsList className="rounded-full bg-sand/60" data-testid="admin-tabs">
            <TabsTrigger value="enquiries" className="rounded-full px-6" data-testid="admin-tab-enquiries">Enquiries</TabsTrigger>
            <TabsTrigger value="services" className="rounded-full px-6" data-testid="admin-tab-services">Services</TabsTrigger>
          </TabsList>
          <TabsContent value="enquiries" className="mt-7"><Enquiries /></TabsContent>
          <TabsContent value="services" className="mt-7"><ServiceEditor /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
