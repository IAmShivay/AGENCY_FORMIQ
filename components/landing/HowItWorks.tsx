"use client";

import { RAIL_ITEM, RAIL_TO_MD } from "@/components/studio/ui";

const RAIL_SM_GUTTER = "sm:-mx-6 sm:px-6 sm:scroll-px-6";

const steps = [
  {
    step: "01",
    title: "Brief",
    description: "A 30-minute call and a short questionnaire. You get a fixed quote and timeline.",
    time: "Week 0",
  },
  {
    step: "02",
    title: "Design",
    description: "Two directions, one chosen, refined together in live review sessions.",
    time: "Weeks 1–3",
  },
  {
    step: "03",
    title: "Build & launch",
    description: "Built, tested and launched, then 30 days of care to fix anything that shows up.",
    time: "Weeks 3–6",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-14 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-12 lg:items-end mb-8 md:mb-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-3 md:mb-5">(03) Process</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.98] tracking-[-0.04em]">
              How a project <span className="text-primary">runs</span>
            </h2>
          </div>
          <p className="lg:col-span-4 lg:col-start-9 text-base md:text-lg text-muted-foreground leading-relaxed">
            No jargon, no surprise invoices.
          </p>
        </div>

        {/* Steps: stacked on mobile, three columns split by hairlines on desktop */}
        <ol className={`grid ${RAIL_TO_MD} ${RAIL_SM_GUTTER} max-md:flex md:gap-0 md:border-t border-border lg:grid-cols-3`}>
          {steps.map((step) => (
            <li
              key={step.step}
              className={`${RAIL_ITEM} md:w-auto max-md:flex max-md:flex-col rounded-[22px] md:rounded-none border md:border-0 md:border-b border-border bg-foreground/[0.03] md:bg-transparent p-5 md:p-0 md:py-10 lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:pr-0 lg:[&:not(:first-child)]:border-l`}
            >
              <div className="flex items-start justify-between gap-4">
                <span aria-hidden="true" className="font-display text-6xl md:text-8xl font-medium leading-none tracking-[-0.05em] text-foreground/15">
                  {step.step}
                </span>
                <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap">
                  {step.time}
                </span>
              </div>
              <h3 className="mt-10 max-md:mt-auto max-md:pt-10 font-display text-2xl md:text-3xl font-semibold tracking-[-0.035em] leading-tight">
                <span className="sr-only">Step {step.step}: </span>
                {step.title}
              </h3>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-sm">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
