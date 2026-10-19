"use client";

import { useState } from "react";
import { Bot, Phone, Sparkles, ArrowRight, Utensils, Stethoscope, Headset, X, Mic } from "lucide-react";
import Script from "next/script";

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
    id: "agent_8501m5awm7n1f9b8arx2wzdf8d9w",
    title: "Cold Outreach",
    desc: "Your business — website + ads pitch, books meeting, multilingual",
    icon: Headset,
    badge: "Live",
    color: "from-primary/10 to-violet-500/10 border-primary/20",
    iconColor: "text-primary",
  },
];

export default function AIBookingAgents() {
  const [activeId, setActiveId] = useState<string | null>(null);

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
            View all 10 agents <ArrowRight className="w-3 h-3" />
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
                  onClick={() => setActiveId(isActive ? null : d.id)}
                  className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/15"}`}
                >
                  <Phone className="w-3 h-3" /> {isActive ? "Close Demo" : "Try Live Call"}
                </button>

                {/* Inline widget when active */}
                {isActive && (
                  <div className="mt-3 rounded-xl border border-border bg-muted/30 p-2">
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <Mic className="w-3 h-3 text-primary" />
                      <span className="text-xs font-semibold text-foreground">Speaking with {d.title} Agent</span>
                      <button onClick={() => setActiveId(null)} className="ml-auto p-1 hover:bg-muted rounded">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <elevenlabs-convai agent-id={d.id}></elevenlabs-convai>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Add-on to Growth Plan <span className="font-semibold text-foreground">Rs 3-5k/mo</span> per agent • Powered by ElevenLabs • <a href="/agents" className="text-primary hover:underline">See all 10 →</a>
        </p>
      </div>

      <Script src="https://elevenlabs.io/convai/widget/index.js" strategy="lazyOnload" />
    </section>
  );
}

// Extend JSX for custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { "agent-id": string }, HTMLElement>;
    }
  }
}
