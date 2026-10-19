"use client";

import { useState, useEffect } from "react";
import { Bot, Phone, Sparkles, ArrowRight, Utensils, Stethoscope, Scissors, X, Mic, ExternalLink } from "lucide-react";

const demos = [
  {
    id: "agent_1001m5awkqdee6j9ph0v008337my",
    title: "Restaurant",
    desc: "Table booking in 60s — party size, date, time, upsell Chef special",
    icon: Utensils,
    badge: "Demo",
    color: "from-orange-500/10 to-amber-500/10 border-orange-200/50",
    iconColor: "text-orange-600",
  },
  {
    id: "agent_7501m5awkxrxedkatv8eb12wd7vf",
    title: "Dental Clinic",
    desc: "Appointment booking — name, phone, treatment, SMS reminder",
    icon: Stethoscope,
    badge: "Demo",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-200/50",
    iconColor: "text-emerald-600",
  },
  {
    id: "agent_5001m5ayj1kkevb8nv9ds3fysras",
    title: "Salon & Spa",
    desc: "Beauty booking — haircut, facial, spa, nail art, stylist pref",
    icon: Scissors,
    badge: "Demo",
    color: "from-pink-500/10 to-rose-500/10 border-pink-200/50",
    iconColor: "text-pink-600",
  },
];

export default function AIBookingAgents() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.type = "text/javascript";
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (!activeId) { setSignedUrl(null); return; }
    fetch(`/api/elevenlabs/signed-url?agent_id=${encodeURIComponent(activeId)}`)
      .then(r => r.json())
      .then(d => setSignedUrl(d.signed_url || null))
      .catch(() => setSignedUrl(null));
  }, [activeId]);

  return (
    <section className="py-8 sm:py-10 bg-muted/20 border-y border-border/40 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header - add-on style, not Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/15 text-[11px] font-semibold tracking-widest text-violet-600 uppercase">
              <Bot className="w-3 h-3" /> Add-on
            </span>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              AI Booking Agents <span className="font-normal text-muted-foreground">— never miss a booking</span>
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live demos
            </span>
          </div>
          <a href="/agents" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            View all agents <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* Demo cards - compact, minimal height */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {demos.map((d) => {
            const Icon = d.icon;
            const isActive = activeId === d.id;
            return (
              <div
                key={d.id}
                className={`group relative rounded-xl bg-card border p-4 flex flex-col hover:shadow-md hover:border-primary/15 transition-all ${isActive ? "border-primary shadow-md ring-1 ring-primary/10" : "border-border shadow-sm"}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${d.color} border flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${d.iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${d.badge === "Live" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground border border-border"}`}>
                    {d.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{d.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2 flex-1">{d.desc}</p>
                <button
                  onClick={async () => {
                    if (isActive) { setActiveId(null); return; }
                    try { await navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop())); } catch {}
                    setActiveId(d.id);
                  }}
                  className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/15"}`}
                >
                  <Phone className="w-3 h-3" /> {isActive ? "Close Demo" : "Try Live Call"}
                </button>

                {/* Inline widget when active */}
                {isActive && (
                  <div className="mt-3 rounded-xl border border-border bg-card p-2.5 shadow-inner">
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-foreground">Live — {d.title} Agent</span>
                      <span className="text-[10px] text-muted-foreground ml-1">Click Start Call below → Allow mic</span>
                      <button onClick={() => setActiveId(null)} className="ml-auto p-1 hover:bg-muted rounded">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    {signedUrl ? (
                      <div key={signedUrl} className="h-[220px] rounded-lg border border-border/50 bg-card overflow-hidden">
                        <elevenlabs-convai signed-url={signedUrl} variant="expanded"></elevenlabs-convai>
                      </div>
                    ) : (
                      <div className="h-[100px] flex items-center justify-center text-xs text-muted-foreground">
                        Preparing call… allow mic when prompted
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground text-center mt-2">
                      Having trouble? <a href={`https://elevenlabs.io/app/talk-to?agent_id=${d.id}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Open in ElevenLabs <ExternalLink className="w-3 h-3" /></a>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Add-on to Growth Plan <span className="font-semibold text-foreground">Rs 3-5k/mo</span> per agent • Powered by ElevenLabs • <a href="/agents" className="text-primary hover:underline">See all →</a>
        </p>
      </div>

    </section>
  );
}

// Extend JSX for custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { "agent-id"?: string; "signed-url"?: string; variant?: string }, HTMLElement>;
    }
  }
}
