"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import EnquiryForm from "./forms/EnquiryForm";
import { BOOKING_URL } from "@/lib/pricing";
import { ENQUIRY_EMAIL } from "@/lib/enquiry-options";
import { getLenis } from "@/lib/studio-motion";

const TITLE_ID = "lead-overlay-title";
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const EYEBROW = "font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground";
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const OPEN_LISTBOX = '[role="listbox"][data-state="open"]';
const EASE_OUT: [number, number, number, number] = [0.19, 1, 0.22, 1];

const NEXT_STEPS = [
  "We reply within one working day",
  "A 30-minute call to scope it",
  "A fixed quote with timeline",
];

/** Project enquiry sheet, opened from the header and hero. Portalled to <body> so tone wrappers never recolour it. */
export default function LeadFormOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [fontVars, setFontVars] = useState("");
  const [formKey, setFormKey] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
    // Carry the marketing font variables (set on the .studio wrapper) into the portal.
    const host = document.querySelector<HTMLElement>(".studio");
    if (host) setFontVars(host.className.split(" ").filter((c) => c && c !== "studio").join(" "));
  }, []);

  // Scroll lock, Lenis pause, Escape, focus trap, initial focus and focus return.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();

    const focusFirst = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("input, textarea, button")?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // A dropdown open inside the sheet closes first.
        if (!document.querySelector(OPEN_LISTBOX)) onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.cancelAnimationFrame(focusFirst);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      getLenis()?.start();
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  // Fresh form each time the sheet opens.
  useEffect(() => { if (open) setFormKey((k) => k + 1); }, [open]);

  if (!mounted) return null;

  const fade = reduceMotion ? { duration: 0 } : { duration: 0.3 };
  const slide = reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`${fontVars} fixed inset-0 z-[100]`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
        >
          <div className="absolute inset-0 bg-foreground/40" onClick={onClose} aria-hidden="true" />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={TITLE_ID}
            className="studio absolute inset-y-0 right-0 w-full max-w-6xl bg-background text-foreground shadow-2xl flex flex-col"
            initial={{ x: reduceMotion ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : "100%" }}
            transition={slide}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`absolute top-3 right-3 sm:top-5 sm:right-5 lg:top-4 lg:right-4 z-10 w-11 h-11 inline-flex items-center justify-center rounded-full border border-border bg-background text-foreground hover:border-foreground transition-colors ${FOCUS_RING}`}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Mobile: the whole sheet scrolls. Desktop: both columns fill the height; only the form column scrolls if it must. */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain lg:overflow-hidden" data-lenis-prevent>
              <div className="grid min-h-full lg:h-full lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
                {/* Form (first on mobile) */}
                <div
                  className="order-1 lg:order-2 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable]"
                  data-lenis-prevent
                >
                  <div className="flex min-h-full flex-col px-4 sm:px-8 lg:px-12 xl:px-16 pt-16 sm:pt-20 lg:pt-8 pb-10 lg:pb-8">
                    <header className="mb-8 lg:mb-5 pr-12">
                      <p className={`${EYEBROW} mb-2`}>(Start a project)</p>
                      <h2 id={TITLE_ID} className="font-display text-[2.2rem] sm:text-4xl lg:text-3xl font-bold leading-[0.98] tracking-[-0.045em]">
                        Tell us about your project.
                      </h2>
                    </header>
                    <EnquiryForm key={formKey} idPrefix="lead" source="Lead overlay" successHeadingId={`${TITLE_ID}-done`} variant="sheet" />
                  </div>
                </div>

                {/* Context column */}
                <aside className="order-2 lg:order-1 tone-ink px-4 sm:px-8 lg:px-10 py-12 lg:py-8 flex flex-col lg:h-full lg:overflow-hidden">
                  <p className={`${EYEBROW} mb-3`}>(Process)</p>
                  <p className="font-display text-3xl xl:text-4xl font-bold leading-[0.98] tracking-[-0.045em]">
                    What happens next.
                  </p>
                  <ol className="mt-8 lg:mt-10 border-t border-border">
                    {NEXT_STEPS.map((s, i) => (
                      <li key={s} className="flex items-baseline gap-4 py-5 border-b border-border text-base">
                        <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">0{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-10 lg:mt-auto lg:pt-10 space-y-1 text-base">
                    <a href={`mailto:${ENQUIRY_EMAIL}`} className={`inline-flex min-h-11 items-center rounded-sm ${FOCUS_RING}`}>
                      <span className="link-draw">{ENQUIRY_EMAIL}</span>
                    </a>
                    <p className="text-muted-foreground">
                      Prefer to talk?{" "}
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex min-h-11 items-center gap-1 text-foreground font-semibold rounded-sm ${FOCUS_RING}`}
                      >
                        <span className="link-draw">Book a call</span>
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
