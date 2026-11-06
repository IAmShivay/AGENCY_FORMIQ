"use client";

const steps = [
  {
    step: "01",
    title: "Tell us about your business",
    description: "15-min WhatsApp chat. We understand your goals, customers & budget.",
    time: "15 min",
  },
  {
    step: "02",
    title: "We build everything",
    description: "Website, ads, creatives, copy — crafted by our team. You just approve.",
    time: "4–6 weeks",
  },
  {
    step: "03",
    title: "Customers start coming",
    description: "Ads go live, we optimise daily and send you clear monthly reports.",
    time: "Ongoing",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-5">(03) Process</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.98] tracking-[-0.04em]">
              Three <span className="text-primary">simple</span> steps
            </h2>
          </div>
          <p className="lg:col-span-4 lg:col-start-9 text-base sm:text-lg text-muted-foreground leading-relaxed">
            No technical knowledge needed. No jargon. We handle everything.
          </p>
        </div>

        {/* Steps: stacked on mobile, three columns split by hairlines on desktop */}
        <ol className="grid border-t border-border lg:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.step}
              className="py-8 sm:py-10 border-b border-border lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:pr-0 lg:[&:not(:first-child)]:border-l"
            >
              <div className="flex items-start justify-between gap-4">
                <span aria-hidden="true" className="font-display text-7xl sm:text-8xl font-medium leading-none tracking-[-0.05em] text-foreground/15">
                  {step.step}
                </span>
                <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground whitespace-nowrap">
                  {step.time}
                </span>
              </div>
              <h3 className="mt-8 sm:mt-10 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.035em] leading-tight">
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
