"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion, useDragControls, type PanInfo } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import EnquiryForm from "./forms/EnquiryForm";
import { BOOKING_URL } from "@/lib/pricing";
import { ENQUIRY_EMAIL } from "@/lib/enquiry-options";
import { LEAD_SHEET_OPEN_CLASS } from "@/lib/lead-sheet";

const TITLE_ID = "lead-overlay-title";
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const EYEBROW = "font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground";
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const OPEN_LISTBOX = '[role="listbox"][data-state="open"]';
const EASE_OUT: [number, number, number, number] = [0.19, 1, 0.22, 1];
const PHONE_QUERY = "(max-width: 639px)";
const DISMISS_DRAG_PX = 120;
const DISMISS_VELOCITY = 600;

const NEXT_STEPS = [
  "Reply in one working day",
  "30-minute scoping call",
  "Fixed quote and timeline",
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
  const [phone, setPhone] = useState(false);
  const drag = useDragControls();

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia(PHONE_QUERY);
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    // Carry the marketing font variables (set on the .studio wrapper) into the portal.
    const host = document.querySelector<HTMLElement>(".studio");
    if (host) setFontVars(host.className.split(" ").filter((c) => c && c !== "studio").join(" "));
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Scroll lock, Escape, focus trap, initial focus and focus return.
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add(LEAD_SHEET_OPEN_CLASS);

    const focusFirst = window.requestAnimationFrame(() => {
      if (window.matchMedia(PHONE_QUERY).matches) panelRef.current?.focus({ preventScroll: true });
      else panelRef.current?.querySelector<HTMLElement>("input, textarea, button")?.focus();
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
      document.documentElement.classList.remove(LEAD_SHEET_OPEN_CLASS);
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  // Fresh form each time the sheet opens.
  useEffect(() => { if (open) setFormKey((k) => k + 1); }, [open]);

  if (!mounted) return null;

  const fade = reduceMotion ? { duration: 0 } : { duration: 0.3 };
  const slide = reduceMotion ? { duration: 0 } : { duration: phone ? 0.45 : 0.6, ease: EASE_OUT };
  const hidden = reduceMotion ? {} : phone ? { y: "100%" } : { x: "100%" };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_DRAG_PX || info.velocity.y > DISMISS_VELOCITY) onClose();
  };

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
            tabIndex={-1}
            className="studio absolute inset-x-0 bottom-0 h-[92dvh] rounded-t-[24px] overflow-hidden sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:h-auto sm:rounded-none sm:overflow-visible w-full sm:max-w-[640px] xl:max-w-[680px] bg-background text-foreground shadow-2xl flex flex-col outline-none will-change-transform [contain:layout_paint]"
            initial={hidden}
            animate={{ x: 0, y: 0 }}
            exit={hidden}
            transition={slide}
            drag={phone ? "y" : false}
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
          >
            <div
              onPointerDown={(e) => drag.start(e)}
              className="flex h-6 flex-shrink-0 cursor-grab touch-none items-center justify-center sm:hidden"
              aria-hidden="true"
            >
              <span className="h-1 w-10 rounded-full bg-foreground/20" />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`absolute top-5 right-4 sm:top-5 sm:right-5 lg:top-4 lg:right-4 z-10 w-11 h-11 inline-flex items-center justify-center rounded-full border border-border bg-background text-foreground hover:border-foreground transition-colors ${FOCUS_RING}`}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]" data-lenis-prevent>
              <div className="flex min-h-full flex-col px-5 sm:px-10 pt-4 sm:pt-8 pb-0 sm:pb-7">
                <header className="mb-6 pr-12">
                  <p className={`${EYEBROW} mb-2`}>(Start a project)</p>
                  <h2 id={TITLE_ID} className="font-display text-[2.2rem] sm:text-4xl font-bold leading-[0.98] tracking-[-0.045em]">
                    Tell us about your project.
                  </h2>
                  <ol className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5">
                    {NEXT_STEPS.map((step, i) => (
                      <li key={step} className="flex items-baseline gap-2 text-sm text-muted-foreground">
                        <span className="font-mono text-[11px] tracking-[0.16em]">0{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Prefer email?{' '}
                    <a href={`mailto:${ENQUIRY_EMAIL}`} className={`font-medium text-foreground rounded-sm ${FOCUS_RING}`}>
                      <span className="link-draw">{ENQUIRY_EMAIL}</span>
                    </a>
                    {' '}or{' '}
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 font-medium text-foreground rounded-sm ${FOCUS_RING}`}>
                      <span className="link-draw">book a call</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </p>
                </header>
                <EnquiryForm key={formKey} idPrefix="lead" source="Lead overlay" successHeadingId={`${TITLE_ID}-done`} variant="sheet" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
