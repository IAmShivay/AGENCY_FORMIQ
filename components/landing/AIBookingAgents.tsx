"use client";

import { useState, useEffect, useRef, useCallback, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Conversation } from "@elevenlabs/client";
import type { VoiceConversation } from "@elevenlabs/client";
import { Phone, ArrowRight, ArrowUpRight, X, Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";
import Magnetic from "@/components/studio/Magnetic";

const IS_DEV = process.env.NODE_ENV === 'development';
const MIC_BLOCKED_MESSAGE = "Microphone access is blocked. Allow it in your browser settings and try again.";
const AGENTS_PAGE_HREF = "/agents";

const demos = [
  {
    id: "agent_1001m5awkqdee6j9ph0v008337my",
    title: "Restaurant",
    desc: "Table booking in 60s — party size, date, time, upsell Chef special",
  },
  {
    id: "agent_7501m5awkxrxedkatv8eb12wd7vf",
    title: "Dental clinic",
    desc: "Appointment booking — name, phone, treatment, SMS reminder",
  },
  {
    id: "agent_5001m5ayj1kkevb8nv9ds3fysras",
    title: "Salon & spa",
    desc: "Beauty booking — haircut, facial, spa, nail art, stylist pref",
  },
];

type Demo = (typeof demos)[number];
type Msg = { role: "user" | "agent"; text: string };

const pad = (n: number) => String(n + 1).padStart(2, "0");

export default function AIBookingAgents() {
  const [selected, setSelected] = useState(0);
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const startCall = async (d: Demo) => {
    if (!window.isSecureContext) {
      setMicErrorFor(
        d.id,
        IS_DEV
          ? "Dev: mic needs a secure context. Open via localhost (not the LAN IP) or use HTTPS."
          : MIC_BLOCKED_MESSAGE
      );
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicErrorFor(
        d.id,
        IS_DEV
          ? "Dev: navigator.mediaDevices is unavailable. Open on localhost or enable HTTPS."
          : MIC_BLOCKED_MESSAGE
      );
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
        setMicErrorFor(d.id, MIC_BLOCKED_MESSAGE);
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setMicErrorFor(d.id, "No microphone found on this device.");
      } else {
        setMicErrorFor(d.id, IS_DEV ? `Dev: mic error ${name || "unknown"}` : "Something went wrong starting the call. Please try again.");
      }
    }
  };

  // Roving focus for the industry tabs (arrow keys, Home/End).
  const onTabKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % demos.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + demos.length) % demos.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = demos.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  const current = demos[selected];
  const active = demos.find((d) => d.id === activeId);
  const transcript = messages.slice(-6);

  return (
    <section aria-labelledby="ai-agents-title" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 lg:gap-16 items-end mb-12 sm:mb-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-5">(05) Add-on</p>
            <h2 id="ai-agents-title" className="font-display text-[2.3rem] leading-[1] sm:text-6xl lg:text-7xl font-semibold tracking-[-0.04em] text-foreground">
              AI booking agents. <span className="text-primary">Never miss a booking.</span>
            </h2>
          </div>
          <div className="space-y-4 lg:pb-2">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              Pick an industry and talk to a live demo agent, right here in your browser.
            </p>
            <a href={AGENTS_PAGE_HREF} className="group inline-flex items-center gap-2 min-h-[44px] text-[15px] font-semibold text-foreground rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <span className="link-draw">View all agents</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Industries + demo panel */}
        <div className="grid lg:grid-cols-[1fr,1.05fr] gap-8 lg:gap-16 items-start">
          <div role="tablist" aria-label="Demo industries" aria-orientation="vertical" className="border-t border-border">
            {demos.map((d, i) => {
              const isSelected = i === selected;
              return (
                <button
                  key={d.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={`agent-tab-${i}`}
                  aria-selected={isSelected}
                  aria-controls="agent-panel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelected(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`group w-full flex items-center gap-4 sm:gap-6 py-5 sm:py-7 border-b border-border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                    isSelected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] w-6 flex-shrink-0">{pad(i)}</span>
                  <span className="flex-1 min-w-0 font-display text-[1.75rem] leading-[1.05] sm:text-5xl font-semibold tracking-[-0.04em]">
                    {d.title}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 transition-[transform,opacity] duration-500 ${
                      isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div
            id="agent-panel"
            role="tabpanel"
            aria-labelledby={`agent-tab-${selected}`}
            className="rounded-[22px] bg-card border border-border p-6 sm:p-10 flex flex-col min-h-[300px] sm:min-h-[360px]"
          >
            <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <span>Live demo</span>
              <span>{pad(selected)} / {pad(demos.length - 1)}</span>
            </div>

            <div className="mt-8 sm:mt-10 flex-1">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] text-foreground">
                {current.title} assistant
              </h3>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">{current.desc}</p>
              {micError?.id === current.id && (
                <p role="alert" className="mt-4 text-sm text-foreground leading-snug border-l-2 border-primary pl-3">{micError.msg}</p>
              )}
            </div>

            <div className="mt-8">
              <Magnetic>
                <button
                  type="button"
                  onClick={() => startCall(current)}
                  className="btn-ink btn-ink-invert h-14 px-7 w-full sm:w-auto bg-primary text-primary-foreground rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  <Phone className="w-4 h-4" /> Try live call
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.12em] leading-relaxed text-muted-foreground">
          Priced per agent after a short scoping call · Built &amp; hosted by FormiqStudio ·{' '}
          <a href={AGENTS_PAGE_HREF} className="link-draw text-foreground">See all</a>
        </p>
      </div>

      {mounted && active && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70" onClick={endCall}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} assistant call`}
            className="relative w-full max-w-md rounded-[22px] bg-card text-card-foreground border border-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-5 pt-5 pb-4 border-b border-border">
              <button onClick={endCall} className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Live demo</p>
              <p className="mt-1 font-display text-xl font-semibold tracking-[-0.03em] text-foreground pr-10">{active.title} assistant</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground truncate" aria-live="polite">
                {status === "connecting" && "Connecting…"}
                {status === "connected" && (mode === "speaking" ? "Speaking…" : "Listening…")}
                {status === "error" && (error || "Connection failed")}
              </p>
              {/* Mic level */}
              <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                <div ref={levelRef} className="h-full w-full origin-left scale-x-[0.04] bg-primary transition-transform duration-75" />
              </div>
            </div>

            {/* Transcript */}
            <div className="h-[240px] overflow-y-auto px-5 py-4 space-y-3 bg-background" data-lenis-prevent>
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
                <p className="text-xs text-foreground text-center pt-2">{error}</p>
              )}
            </div>

            {/* Controls */}
            <div className="px-5 py-4 border-t border-border flex items-center justify-center gap-3">
              <button
                onClick={toggleMute}
                className={`w-12 h-12 flex items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${muted ? "bg-foreground text-background border-foreground" : "border-border text-foreground hover:bg-muted"}`}
                aria-label={muted ? "Unmute" : "Mute"}
                aria-pressed={muted}
              >
                {muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={endCall}
                className="h-12 px-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <PhoneOff className="w-4 h-4" /> End call
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
