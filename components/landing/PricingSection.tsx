"use client";

import { useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Magnetic from '@/components/studio/Magnetic';
import {
  CURRENCIES,
  CURRENCY_CODES,
  PAYMENT_TERMS,
  PRICING_PLANS,
  RETAINER_PLAN,
  formatPrice,
  type CurrencyCode,
} from '@/lib/pricing';
import { useCurrency } from '@/lib/use-currency';
import { openLeadSheet } from '@/lib/lead-sheet';
import { RAIL_ITEM, RAIL_TO_MD } from '@/components/studio/ui';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const CTA_LABEL = 'Book a call';
const RECOMMENDED_LABEL = 'Most chosen';

/** Segmented EUR / GBP / AED / USD switch (radiogroup with roving focus). */
const CurrencyToggle = ({ value, onChange }: { value: CurrencyCode; onChange: (c: CurrencyCode) => void }) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % CURRENCY_CODES.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + CURRENCY_CODES.length) % CURRENCY_CODES.length;
    if (next < 0) return;
    e.preventDefault();
    onChange(CURRENCY_CODES[next]);
    refs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Currency" className="flex w-full md:inline-flex md:w-auto p-1 rounded-full border border-border">
      {CURRENCY_CODES.map((code, i) => {
        const checked = code === value;
        return (
          <button
            key={code}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={CURRENCIES[code].label}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(code)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`h-11 min-w-[3.25rem] max-md:min-w-0 max-md:flex-1 px-3 rounded-full font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${FOCUS_RING} ${
              checked ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
};

const BookingButton = ({ filled = false }: { filled?: boolean }) => (
  <Magnetic>
    <button
      type="button"
      onClick={openLeadSheet}
      data-track-source="pricing"
      className={`group h-12 md:h-14 px-7 w-full sm:w-auto rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap ${FOCUS_RING} ${
        filled ? 'btn-ink btn-ink-invert bg-primary text-primary-foreground' : 'btn-ink border border-foreground/20 text-foreground'
      }`}
    >
      {CTA_LABEL}
      <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
    </button>
  </Magnetic>
);

const PricingSection = () => {
  const [currency, chooseCurrency] = useCurrency();

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative pt-14 pb-6 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-[1.4fr,1fr] gap-5 md:gap-8 lg:gap-16 items-end mb-8 sm:mb-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3 md:mb-5">(05) Pricing</p>
            <h2 id="pricing-title" className="font-display text-[2.3rem] leading-[1] sm:text-6xl lg:text-7xl font-semibold tracking-[-0.04em] text-foreground">
              Clear starting prices. A fixed quote before we begin.
            </h2>
          </div>
          <div className="lg:justify-self-end lg:pb-2 space-y-2 md:space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Show prices in</p>
            <CurrencyToggle value={currency} onChange={chooseCurrency} />
          </div>
        </div>

        {/* Plans: columns divided by rules, not floating cards */}
        <div className={`${RAIL_TO_MD} max-md:items-start md:grid md:grid-cols-3 md:gap-0 md:border-t md:border-border`} aria-live="polite">
          {PRICING_PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className={`${RAIL_ITEM} md:w-auto relative flex flex-col rounded-2xl border border-border px-5 py-6 md:rounded-none md:border-0 md:border-b md:py-12 md:px-6 lg:px-10 ${
                i > 0 ? 'md:border-l' : 'md:pl-0 lg:pl-0'
              } ${i === PRICING_PLANS.length - 1 ? 'md:pr-0 lg:pr-0' : ''}`}
            >
              {plan.recommended && <span aria-hidden="true" className="absolute -top-px inset-x-0 h-[2px] bg-primary" />}

              <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
                <h3 className="text-foreground font-medium">{plan.name}</h3>
                {plan.recommended && <span className="text-primary">{RECOMMENDED_LABEL}</span>}
              </div>

              <div className="mt-5 md:mt-8">
                <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2">From</span>
                <span className="block font-display text-5xl sm:text-6xl lg:text-[4.25rem] font-semibold tracking-[-0.05em] leading-none text-foreground tabular-nums">
                  {formatPrice(plan.price[currency], currency)}
                </span>
              </div>
              <p className="mt-3 md:mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{plan.timeline}</p>
              <p className="mt-2 md:mt-4 text-sm md:text-[15px] text-muted-foreground leading-relaxed">{plan.description}</p>

              <ul className="mt-5 mb-6 md:mb-0 md:mt-8 space-y-2 md:space-y-3 md:flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm md:text-[15px] leading-snug text-foreground/90">
                    <span aria-hidden="true" className="text-muted-foreground flex-shrink-0">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 md:mt-10 [&_a]:w-full">
                <BookingButton filled={plan.recommended} />
              </div>
            </div>
          ))}
        </div>

        {/* Retainer */}
        <div className="grid md:grid-cols-[1fr,auto,auto] gap-4 md:gap-12 items-center py-7 md:py-12 border-b border-border">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground font-medium">{RETAINER_PLAN.name}</h3>
            <p className="mt-2 md:mt-3 text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-xl">{RETAINER_PLAN.description}</p>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">From</span>
            <span className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.05em] leading-none text-foreground tabular-nums">
              {formatPrice(RETAINER_PLAN.price[currency], currency)}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{RETAINER_PLAN.period}</span>
          </div>
          <BookingButton />
        </div>

        {/* Terms + scoping line */}
        <div className="pt-5 md:pt-8 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
          <p className="text-[13px] md:text-sm text-muted-foreground max-w-2xl">{PAYMENT_TERMS}</p>
          <button
            type="button"
            onClick={openLeadSheet}
            data-track-source="pricing"
            className={`group inline-flex items-center gap-2 min-h-[44px] text-left text-sm md:text-[15px] font-semibold text-foreground rounded-sm ${FOCUS_RING}`}
          >
            <span className="link-draw">Not sure what you need? Book a call and we&rsquo;ll scope it with you.</span>
            <ArrowUpRight className="w-4 h-4 flex-shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
