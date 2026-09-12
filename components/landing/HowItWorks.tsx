"use client";

import { MessageSquare, Paintbrush, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    step: "1",
    title: "Tell Us About Your Business",
    description: "Quick 15-minute call or WhatsApp chat. We understand your business, your customers, and your goals. No jargon, no confusion.",
    time: "15 min",
  },
  {
    icon: Paintbrush,
    step: "2",
    title: "We Build Everything",
    description: "Our team creates your website, designs ad creatives, writes copy, and sets up your campaigns. You just approve.",
    time: "7-15 days",
  },
  {
    icon: TrendingUp,
    step: "3",
    title: "Customers Start Coming In",
    description: "Your ads go live, your website is up, your social media is active. We optimize daily and send you monthly reports with real numbers.",
    time: "Ongoing",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps. No technical knowledge needed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative text-center p-6 rounded-xl bg-card border border-border">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-2">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
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
