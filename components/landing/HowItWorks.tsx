"use client";

import { MessageSquare, Paintbrush, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    step: "1",
    title: "Tell Us About Your Business",
    description: "15-min WhatsApp chat. We understand your goals.",
    time: "15 min",
  },
  {
    icon: Paintbrush,
    step: "2",
    title: "We Build Everything",
    description: "Website, ads, creatives, copy. You just approve.",
    time: "7-15 days",
  },
  {
    icon: TrendingUp,
    step: "3",
    title: "Customers Start Coming",
    description: "Ads live, daily optimization, monthly reports.",
    time: "Ongoing",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-10 sm:py-16 md:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1.5 sm:mb-3 text-foreground">
            How It Works
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            Three simple steps. No technical knowledge needed.
          </p>
        </div>

        {/* Mobile: horizontal compact row */}
        <div className="flex sm:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex-shrink-0 w-[75vw] snap-center text-center p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </div>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{step.description}</p>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {step.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative text-center p-6 sm:p-7 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30">
                  {step.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 mt-2">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  {step.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
