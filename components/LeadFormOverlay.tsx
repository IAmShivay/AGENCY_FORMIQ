"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Phone,
  Building2,
  Target,
  IndianRupee,
  Clock,
  User,
  Sparkles,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Shield,
  Video,
  MapPin,
  Rocket,
  Globe,
  Megaphone,
  Smartphone,
  ShoppingCart,
  TabletSmartphone,
  Lightbulb,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { trackLead } from "@/lib/meta-pixel";

/* ── constants ─────────────────────────────────────────────── */

const SERVICE_OPTIONS = [
  { value: "Growth Plan", label: "Complete Growth Plan (₹6,999/mo)", Icon: Rocket, boost: "3x leads" },
  { value: "Website", label: "Website Development", Icon: Globe, boost: "+40% traffic" },
  { value: "Ads", label: "Ads Management (Google/Meta)", Icon: Megaphone, boost: "5x ROAS" },
  { value: "Social Media", label: "Social Media Management", Icon: Smartphone, boost: "+200% reach" },
  { value: "Ecommerce", label: "E-commerce / Shopify Store", Icon: ShoppingCart, boost: "+60% sales" },
  { value: "Mobile App", label: "Mobile App Development", Icon: TabletSmartphone, boost: "Custom" },
  { value: "Other", label: "Something Else", Icon: Lightbulb, boost: "" },
] as const;

const BUDGET_OPTIONS = [
  { value: "Under 10k", label: "Under ₹10K" },
  { value: "10k-25k", label: "₹10K – ₹25K" },
  { value: "25k-50k", label: "₹25K – ₹50K" },
  { value: "50k-1L", label: "₹50K – ₹1L" },
  { value: "1L+", label: "₹1L+" },
  { value: "Not sure", label: "Not sure yet" },
] as const;

const TIMELINE_OPTIONS = [
  { value: "ASAP", label: "ASAP" },
  { value: "1-2 weeks", label: "1–2 weeks" },
  { value: "1 month", label: "Within a month" },
  { value: "Just exploring", label: "Just exploring" },
] as const;

const INDUSTRY_OPTIONS = [
  "Retail / Shop",
  "Restaurant / Cafe",
  "Healthcare / Clinic",
  "Real Estate",
  "Education / Coaching",
  "Manufacturing",
  "Professional Services",
  "E-commerce",
  "Startup",
  "Other",
] as const;

const TOTAL_STEPS = 4;

const STEP_METRICS = [
  { icon: Users, stat: "50+", label: "Businesses Served" },
  { icon: TrendingUp, stat: "3x", label: "Avg. Lead Growth" },
  { icon: Zap, stat: "15 Days", label: "Avg. Delivery" },
  { icon: BarChart3, stat: "92%", label: "Client Retention" },
] as const;

/* ── types ─────────────────────────────────────────────────── */

interface FormData {
  name: string;
  phone: string;
  email: string;
  services: string[];
  businessName: string;
  industry: string;
  meetingType: string;
  budget: string;
  timeline: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  phone: "",
  email: "",
  services: [],
  businessName: "",
  industry: "",
  meetingType: "",
  budget: "",
  timeline: "",
  message: "",
};

/* ── component ─────────────────────────────────────────────── */

export default function LeadFormOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setForm(INITIAL_FORM);
        setSubmitted(false);
        setError(null);
      }, 300);
    }
  }, [open]);

  const set = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const toggleService = (val: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(val)
        ? prev.services.filter((s) => s !== val)
        : [...prev.services, val],
    }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return form.name.trim().length >= 2 && form.phone.trim().length >= 10;
      case 2:
        return form.services.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const subject = form.services.join(", ") || "Website Inquiry";
    const messageParts = [
      form.businessName && `Business: ${form.businessName}`,
      form.industry && `Industry: ${form.industry}`,
      form.meetingType && `Meeting: ${form.meetingType}`,
      form.budget && `Budget: ${form.budget}`,
      form.timeline && `Timeline: ${form.timeline}`,
      form.message && `Note: ${form.message}`,
    ].filter(Boolean);

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || "",
      subject,
      message: messageParts.join(" | "),
    };

    try {
      const { error: dbError } = await supabase
        .from("contact_messages")
        .insert([payload]);

      if (dbError) {
        setError("Failed to send. Please try WhatsApp instead.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      trackLead({ content_name: subject });

      fetch("/api/meta-capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "Lead",
          phone: payload.phone,
          email: payload.email,
          sourceUrl: window.location.href,
          customData: { content_name: subject, budget: form.budget, timeline: form.timeline },
        }),
      }).catch(() => {});

      fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: payload.phone, name: payload.name, service: subject }),
      }).catch(() => {});
    } catch {
      setError("Something went wrong. Please try WhatsApp instead.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── styles ──────────────────────────────────────────────── */
  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none placeholder:text-muted-foreground/60";

  const chipClass = (active: boolean) =>
    `px-3.5 py-2.5 rounded-xl border text-[13px] font-medium cursor-pointer transition-all select-none ${
      active
        ? "bg-primary/10 border-primary text-primary shadow-sm shadow-primary/10"
        : "bg-background border-border text-foreground hover:border-primary/40 hover:bg-muted/50"
    }`;

  /* ── render ──────────────────────────────────────────────── */
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-[560px] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* decorative gradient accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            {/* top bar: progress + close */}
            {!submitted && (
              <div className="px-5 sm:px-7 pt-5 pb-1 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* step indicators */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                      const s = i + 1;
                      const done = s < step;
                      const active = s === step;
                      return (
                        <div key={s} className="flex items-center gap-2 flex-1 last:flex-initial">
                          <motion.div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition-colors duration-300 ${
                              done
                                ? "bg-primary border-primary text-primary-foreground"
                                : active
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-muted/50 border-border text-muted-foreground"
                            }`}
                            animate={active ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.4 }}
                          >
                            {done ? <CheckCircle className="w-3.5 h-3.5" /> : s}
                          </motion.div>
                          {s < TOTAL_STEPS && (
                            <div className="flex-1 h-0.5 rounded-full bg-border overflow-hidden">
                              <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={false}
                                animate={{ width: done ? "100%" : "0%" }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* close button — always right of progress */}
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}

            {/* close for success state */}
            {submitted && (
              <button
                onClick={onClose}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-lg hover:bg-muted transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {/* scrollable content */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-7">
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ── SUCCESS ────────────────────────────── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-2"
                  >
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                      <div className="relative w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1.5">You&apos;re All Set!</h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      Our team will call you within <span className="font-semibold text-foreground">2 hours</span> with a custom growth plan.
                    </p>

                    {/* growth preview */}
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {[
                        { stat: "3x", label: "Lead Growth", color: "text-emerald-600" },
                        { stat: "15d", label: "Delivery", color: "text-blue-600" },
                        { stat: "₹0", label: "Consultation", color: "text-amber-600" },
                      ].map((m) => (
                        <div key={m.label} className="p-2.5 rounded-xl bg-muted/50 border border-border/50">
                          <div className={`text-lg font-bold ${m.color}`}>{m.stat}</div>
                          <div className="text-[10px] text-muted-foreground">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <a
                        href="https://wa.me/919832078313?text=Hi%2C%20I%20just%20submitted%20a%20consultation%20request"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2.5 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1da851] transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                      <a
                        href="tel:+918918349445"
                        className="flex-1 px-4 py-2.5 border-2 border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  /* ── STEPS ─────────────────────────────── */
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* STEP 1 — Contact info */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                              <User className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                              Step 1 of {TOTAL_STEPS}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground">
                            Get your free growth plan
                          </h3>
                          <p className="text-[13px] text-muted-foreground mt-0.5">
                            Takes 60 seconds. We&apos;ll call within 2 hours.
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          <input type="text" placeholder="Your Name *" value={form.name}
                            onChange={(e) => set("name", e.target.value)} className={inputClass} autoFocus />
                          <input type="tel" placeholder="Phone Number *" value={form.phone}
                            onChange={(e) => set("phone", e.target.value)} className={inputClass} />
                          <input type="email" placeholder="Email (optional)" value={form.email}
                            onChange={(e) => set("email", e.target.value)} className={inputClass} />
                        </div>

                        {/* mini growth metrics */}
                        <div className="grid grid-cols-4 gap-2 pt-1">
                          {STEP_METRICS.map((m) => (
                            <div key={m.label} className="text-center p-2 rounded-lg bg-muted/40 border border-border/40">
                              <m.icon className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
                              <div className="text-xs font-bold text-foreground">{m.stat}</div>
                              <div className="text-[9px] text-muted-foreground leading-tight">{m.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STEP 2 — Services */}
                    {step === 2 && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                              <Target className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                              Step 2 of {TOTAL_STEPS}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground">What do you need?</h3>
                          <p className="text-[13px] text-muted-foreground mt-0.5">Select all that apply.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-1.5">
                          {SERVICE_OPTIONS.map((opt) => {
                            const active = form.services.includes(opt.value);
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => toggleService(opt.value)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                                  active
                                    ? "bg-primary/10 border-primary shadow-sm shadow-primary/10"
                                    : "bg-background border-border hover:border-primary/40 hover:bg-muted/50"
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  active ? "bg-primary/15" : "bg-muted/60"
                                }`}>
                                  <opt.Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                                </div>
                                <span className="flex-1 text-[13px] font-medium text-foreground">{opt.label}</span>
                                {opt.boost && (
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                    active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                  }`}>
                                    {opt.boost}
                                  </span>
                                )}
                                {active && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 3 — Business + Meeting type */}
                    {step === 3 && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                              <Building2 className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                              Step 3 of {TOTAL_STEPS}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground">About your business</h3>
                          <p className="text-[13px] text-muted-foreground mt-0.5">Helps us prepare a better proposal. All optional.</p>
                        </div>

                        <div className="space-y-2.5">
                          <input type="text" placeholder="Business / Brand Name" value={form.businessName}
                            onChange={(e) => set("businessName", e.target.value)} className={inputClass} />
                          <select value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inputClass}>
                            <option value="">Industry (optional)</option>
                            {INDUSTRY_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        {/* meeting type */}
                        <div>
                          <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                            How would you like to meet?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {/* Virtual — free */}
                            <button
                              type="button"
                              onClick={() => set("meetingType", "Virtual Meeting")}
                              className={`relative p-3.5 rounded-xl border text-left transition-all ${
                                form.meetingType === "Virtual Meeting"
                                  ? "bg-primary/10 border-primary shadow-sm shadow-primary/10"
                                  : "bg-background border-border hover:border-primary/40 hover:bg-muted/50"
                              }`}
                            >
                              <div className="absolute top-2 right-2">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">FREE</span>
                              </div>
                              <Video className={`w-5 h-5 mb-1.5 ${form.meetingType === "Virtual Meeting" ? "text-primary" : "text-muted-foreground"}`} />
                              <div className="text-[13px] font-semibold text-foreground">Virtual</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">Google Meet / Zoom</div>
                            </button>

                            {/* Physical — ₹499 */}
                            <button
                              type="button"
                              onClick={() => set("meetingType", "Physical Meeting (₹499)")}
                              className={`relative p-3.5 rounded-xl border text-left transition-all ${
                                form.meetingType === "Physical Meeting (₹499)"
                                  ? "bg-primary/10 border-primary shadow-sm shadow-primary/10"
                                  : "bg-background border-border hover:border-primary/40 hover:bg-muted/50"
                              }`}
                            >
                              <div className="absolute top-2 right-2">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">₹499</span>
                              </div>
                              <MapPin className={`w-5 h-5 mb-1.5 ${form.meetingType === "Physical Meeting (₹499)" ? "text-primary" : "text-muted-foreground"}`} />
                              <div className="text-[13px] font-semibold text-foreground">In-Person</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">Kolkata, Durgapur, Asansol</div>
                            </button>
                          </div>
                          {form.meetingType === "Physical Meeting (₹499)" && (
                            <div className="mt-2 space-y-1.5">
                              <p className="text-[10px] text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                ₹499 consultation fee — adjusted against your first project.
                              </p>
                              <a
                                href="https://payments.cashfree.com/forms/formiqstudio"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-all shadow-sm shadow-amber-500/20"
                              >
                                <IndianRupee className="w-3.5 h-3.5" />
                                Pay ₹499 & Book In-Person Meeting
                                <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* trust strip */}
                        <div className="flex items-center gap-4 pt-0.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> Data is private</span>
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary" /> No spam ever</span>
                          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-primary" /> Free consult</span>
                        </div>
                      </div>
                    )}

                    {/* STEP 4 — Budget & Timeline */}
                    {step === 4 && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                              Final Step — Almost done!
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground">Budget & Timeline</h3>
                          <p className="text-[13px] text-muted-foreground mt-0.5">So we can give you the right plan. All optional.</p>
                        </div>

                        <div className="space-y-3.5">
                          <div>
                            <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                              <IndianRupee className="w-3 h-3" /> Budget Range
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {BUDGET_OPTIONS.map((opt) => (
                                <button key={opt.value} type="button" onClick={() => set("budget", opt.value)}
                                  className={chipClass(form.budget === opt.value)}>
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                              <Clock className="w-3 h-3" /> When do you want to start?
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {TIMELINE_OPTIONS.map((opt) => (
                                <button key={opt.value} type="button" onClick={() => set("timeline", opt.value)}
                                  className={chipClass(form.timeline === opt.value)}>
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea placeholder="Anything else? (optional)" rows={2} value={form.message}
                            onChange={(e) => set("message", e.target.value)} className={`${inputClass} resize-none`} />
                        </div>
                      </div>
                    )}

                    {/* error */}
                    {error && (
                      <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg mt-3">{error}</p>
                    )}

                    {/* nav buttons */}
                    <div className="flex items-center gap-2.5 mt-5">
                      {step > 1 && (
                        <button type="button" onClick={() => setStep((s) => s - 1)}
                          className="px-3.5 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-all flex items-center gap-1.5">
                          <ArrowLeft className="w-3.5 h-3.5" /> Back
                        </button>
                      )}

                      {step < TOTAL_STEPS ? (
                        <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}
                          className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/15">
                          Continue <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button type="button" onClick={handleSubmit} disabled={submitting}
                          className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/15">
                          {submitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                          ) : (
                            <>Get My Free Plan <ArrowRight className="w-3.5 h-3.5" /></>
                          )}
                        </button>
                      )}
                    </div>

                    {step >= 3 && step < TOTAL_STEPS && (
                      <button type="button" onClick={() => setStep((s) => s + 1)}
                        className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground mt-1.5 transition-colors">
                        Skip this step →
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* footer */}
            {!submitted && (
              <div className="px-5 sm:px-7 pb-4 pt-0 flex-shrink-0">
                <p className="text-[10px] text-muted-foreground text-center">
                  No spam. No commitment. Available in-person in Kolkata, Durgapur & Asansol.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
