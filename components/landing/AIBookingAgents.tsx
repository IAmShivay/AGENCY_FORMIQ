"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Conversation } from "@elevenlabs/client";
import type { VoiceConversation } from "@elevenlabs/client";
import { Bot, Phone, ArrowRight, Utensils, Stethoscope, Scissors, X, Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";

const demos = [
  {
    id: "agent_1001m5awkqdee6j9ph0v008337my",
    title: "Restaurant",
    desc: "Table booking in 60s — party size, date, time, upsell Chef special",
    icon: Utensils,
    color: "from-orange-500/10 to-amber-500/10 border-orange-200/50",
    iconColor: "text-orange-600",
  },
  {
    id: "agent_7501m5awkxrxedkatv8eb12wd7vf",
    title: "Dental Clinic",
    desc: "Appointment booking — name, phone, treatment, SMS reminder",
    icon: Stethoscope,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-200/50",
    iconColor: "text-emerald-600",
  },
  {
    id: "agent_5001m5ayj1kkevb8nv9ds3fysras",
    title: "Salon & Spa",
    desc: "Beauty booking — haircut, facial, spa, nail art, stylist pref",
    icon: Scissors,
    color: "from-pink-500/10 to-rose-500/10 border-pink-200/50",
    iconColor: "text-pink-600",
  },
];

type Msg = { role: "user" | "agent"; text: string };

export default function AIBookingAgents() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [mode, setMode] = useState<"speaking" | "listening">("listening");
  const [muted, setMuted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [micError, setMicError] = useState<{ id: string; msg: string } | null>(null);
  const convRef = useRef<VoiceConversation | null>(null);
  const levelRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const endCall = useCallback(async () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    try { await convRef.current?.endSession(); } catch {}
    convRef.current = null;
    setActiveId(null);
    setStatus("idle");
    setMode("listening");
    setMuted(false);
    setMessages([]);
    setError(null);
    setMicError(null);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;

    (async () => {
      try {
        setStatus("connecting");

        const res = await fetch(`/api/elevenlabs/signed-url?agent_id=${encodeURIComponent(activeId)}`);
        const data = await res.json();
        if (!data.signed_url) throw new Error(data.error || "Could not start call");

        const conversation = (await Conversation.startSession({
          signedUrl: data.signed_url,
          textOnly: false,
          onConnect: () => { if (!cancelled) setStatus("connected"); },
          onStatusChange: ({ status: s }) => {
            if (cancelled) return;
            if (s === "connected") setStatus("connected");
            if (s === "disconnected") setStatus("idle");
          },
          onModeChange: ({ mode: m }) => { if (!cancelled) setMode(m); },
          onMessage: (m) => {
            if (cancelled || !m.message?.trim()) return;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === m.role) {
                const copy = [...prev];
                copy[copy.length - 1] = { role: m.role, text: last.text + m.message };
                return copy;
              }
              return [...prev, { role: m.role, text: m.message }];
            });
          },
          onError: (msg) => { if (!cancelled) { setError(String(msg)); setStatus("error"); } },
        })) as VoiceConversation;

        if (cancelled) { await conversation.endSession(); return; }
        convRef.current = conversation;

        const tick = () => {
          const el = levelRef.current;
          if (el) {
            const v = conversation.getInputVolume() / 255;
            el.style.transform = `scaleX(${Math.max(0.04, Math.min(1, v))})`;
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch (e: any) {
        if (!cancelled) { setError(e?.message || "Call failed"); setStatus("error"); }
      }
    })();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      convRef.current?.endSession().catch(() => {});
      convRef.current = null;
    };
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") endCall(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeId, endCall]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    convRef.current?.setMicMuted(next);
  };

  const setMicErrorFor = (id: string, msg: string) => setMicError({ id, msg });

  const active = demos.find((d) => d.id === activeId);
  const transcript = messages.slice(-6);

  return (
    <section className="py-8 sm:py-10 bg-muted/20 border-y border-border/40 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {demos.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.id} className="group relative rounded-xl bg-card border border-border p-4 flex flex-col hover:shadow-md hover:border-primary/15 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${d.color} border flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${d.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    Demo
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{d.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2 flex-1">{d.desc}</p>
                {micError?.id === d.id && (
                  <p className="text-[11px] text-red-500 mt-1.5 leading-snug">{micError.msg}</p>
                )}
                <button
                  onClick={async () => {
                    if (!window.isSecureContext) {
                      setMicErrorFor(d.id, "Mic needs a secure page. Open via http://localhost:3001 (not the LAN IP) or use HTTPS.");
                      return;
                    }
                    if (!navigator.mediaDevices?.getUserMedia) {
                      setMicErrorFor(d.id, "This browser blocks mic access on this page. Open on localhost or enable HTTPS.");
                      return;
                    }
                    try {
                      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                      stream.getTracks().forEach((t) => t.stop());
                      setMicError(null);
                      setActiveId(d.id);
                    } catch (e: any) {
                      const name = e?.name || "";
                      if (name === "NotAllowedError" || name === "SecurityError") {
                        setMicErrorFor(d.id, "Mic blocked by the browser. Click the icon in the address bar → allow Microphone → retry.");
                      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
                        setMicErrorFor(d.id, "No microphone found on this device.");
                      } else {
                        setMicErrorFor(d.id, `Mic error: ${name || "unknown"}`);
                      }
                    }
                  }}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/15 transition-colors"
                >
                  <Phone className="w-3 h-3" /> Try Live Call
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Add-on to Growth Plan <span className="font-semibold text-foreground">Rs 3-5k/mo</span> per agent • Built & hosted by FormiqStudio • <a href="/agents" className="text-primary hover:underline">See all →</a>
        </p>
      </div>

      {mounted && active && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={endCall}>
          <div
            className="relative w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10">
              <button onClick={endCall} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${active.color} border flex items-center justify-center`}>
                  <active.icon className={`w-5 h-5 ${active.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{active.title} Assistant</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {status === "connecting" && "Connecting…"}
                    {status === "connected" && (mode === "speaking" ? "Speaking…" : "Listening…")}
                    {status === "error" && (error || "Connection failed")}
                  </p>
                </div>
              </div>
              {/* Mic level */}
              <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                <div ref={levelRef} className="h-full w-full origin-left scale-x-[0.04] bg-primary transition-transform duration-75" />
              </div>
            </div>

            {/* Transcript */}
            <div className="h-[240px] overflow-y-auto px-5 py-4 space-y-3 bg-background/50">
              {transcript.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Volume2 className="w-7 h-7 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-medium text-foreground">Say hello to start</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                    This is a live demo of the {active.title.toLowerCase()} booking agent we build for local businesses.
                  </p>
                </div>
              )}
              {transcript.map((m, i) => (
                <div key={i} className={`flex ${m.role === "agent" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    m.role === "agent"
                      ? "bg-muted text-foreground rounded-bl-md"
                      : "bg-primary text-primary-foreground rounded-br-md"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {error && (
                <p className="text-xs text-red-500 text-center pt-2">{error}</p>
              )}
            </div>

            {/* Controls */}
            <div className="px-5 py-4 border-t border-border flex items-center justify-center gap-3">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${muted ? "bg-red-500 text-white" : "bg-muted text-foreground hover:bg-muted/80"}`}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={endCall}
                className="px-5 py-3 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors inline-flex items-center gap-2"
              >
                <PhoneOff className="w-4 h-4" /> End Call
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
