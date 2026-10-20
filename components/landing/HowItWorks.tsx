"use client";

import { MessageSquare, Paintbrush, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Tell Us About Your Business",
    description: "15-min WhatsApp chat. We understand your goals, customers & budget.",
    time: "15 min",
  },
  {
    icon: Paintbrush,
    step: "02",
    title: "We Build Everything",
    description: "Website, ads, creatives, copy — crafted by our team. You just approve.",
    time: "7-15 days",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Customers Start Coming",
    description: "Ads go live, we optimise daily and send you clear monthly reports.",
    time: "Ongoing",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/15 text-xs font-semibold tracking-widest text-primary uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> How it works
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-foreground tracking-tight">
            Three Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            No technical knowledge needed. No jargon. We handle everything.
          </p>
        </div>

        {/* Mobile: vertical */}
        <div className="flex sm:hidden flex-col gap-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold tracking-widest text-primary">{step.step}</span>
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {step.time}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: grid with connector */}
        <div className="hidden sm:block relative">
          {/* Connector line */}
          <div className="absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />
          <div className="absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 hidden lg:block blur-[0.5px]" />

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === steps.length - 1;
              return (
                <div key={i} className="relative group">
                  <div className="relative text-center p-7 lg:p-8 rounded-[20px] bg-card border border-border shadow-sm hover:shadow-lg hover:border-primary/15 hover:-translate-y-1 transition-all duration-300">
                    {/* Step number */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold tracking-widest shadow-lg shadow-primary/25">
                      {step.step}
                    </div>
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-5 mt-3 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-base font-bold mb-2 text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {step.time}
                    </span>
                  </div>
                  {/* Arrow between cards */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-card border border-border shadow-sm items-center justify-center text-muted-foreground z-10 -translate-y-1/2">
                      <span className="text-sm">→</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
