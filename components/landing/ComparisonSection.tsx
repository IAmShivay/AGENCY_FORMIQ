"use client";

import { Check, X, ArrowRight } from 'lucide-react';

const ComparisonSection = () => {
  const rows = [
    { feature: "Professional Website", us: true, them: true, freelancer: false },
    { feature: "Facebook & Instagram Ads", us: true, them: true, freelancer: false },
    { feature: "Social Media Management", us: true, them: false, freelancer: true },
    { feature: "Google My Business Setup", us: true, them: false, freelancer: false },
    { feature: "Monthly Performance Reports", us: true, them: true, freelancer: false },
    { feature: "In-Person Meetings", us: true, them: false, freelancer: false },
    { feature: "No Lock-in Contract", us: true, them: false, freelancer: true },
    { feature: "Dedicated Account Manager", us: true, them: true, freelancer: false },
    { feature: "Cancel Anytime", us: true, them: false, freelancer: true },
  ];

  const usCount = rows.filter(r => r.us).length;
  const themCount = rows.filter(r => r.them).length;
  const freelancerCount = rows.filter(r => r.freelancer).length;

  return (
    <section className="py-10 sm:py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4 text-foreground leading-tight">
            Why Businesses <span className="text-primary">Choose Us</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Same expert work that big agencies deliver. A fraction of the cost.
            Plus we actually show up at your door.
          </p>
        </div>

        {/* Score cards - mobile & desktop */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-10">
          <div className="text-center p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-primary/10 border-2 border-primary/30">
            <div className="text-2xl sm:text-4xl font-extrabold text-primary">{usCount}/{rows.length}</div>
            <div className="text-[10px] sm:text-sm font-bold text-primary mt-0.5">FormiqStudio</div>
            <div className="text-[9px] sm:text-xs text-primary/70">Rs 6,999/mo</div>
          </div>
          <div className="text-center p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-muted/50 border border-border">
            <div className="text-2xl sm:text-4xl font-extrabold text-muted-foreground">{themCount}/{rows.length}</div>
            <div className="text-[10px] sm:text-sm font-medium text-muted-foreground mt-0.5">Agency</div>
            <div className="text-[9px] sm:text-xs text-muted-foreground/70">Rs 25K+/mo</div>
          </div>
          <div className="text-center p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-muted/50 border border-border">
            <div className="text-2xl sm:text-4xl font-extrabold text-muted-foreground">{freelancerCount}/{rows.length}</div>
            <div className="text-[10px] sm:text-sm font-medium text-muted-foreground mt-0.5">Freelancer</div>
            <div className="text-[9px] sm:text-xs text-muted-foreground/70">Unreliable</div>
          </div>
        </div>

        {/* Feature list */}
        <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-lg">
          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-4 sm:grid-cols-4 p-4 sm:p-5 items-center text-sm ${
              i < rows.length - 1 ? 'border-b border-border/40' : ''
            } hover:bg-muted/10 transition-colors`}>
              <div className="col-span-1 sm:col-span-1 text-foreground font-medium text-xs sm:text-sm pr-2">
                {row.feature}
              </div>
              <div className="flex justify-center">
                {row.us ? (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/15 flex items-center justify-center">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted/30 flex items-center justify-center">
                    <X className="w-4 h-4 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {row.them ? (
                  <Check className="w-4 h-4 text-muted-foreground/50" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground/20" />
                )}
              </div>
              <div className="flex justify-center">
                {row.freelancer ? (
                  <Check className="w-4 h-4 text-muted-foreground/50" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground/20" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Column labels below table for mobile */}
        <div className="grid grid-cols-4 px-4 pt-3 text-[10px] sm:text-xs text-muted-foreground">
          <div />
          <div className="text-center font-bold text-primary">Us</div>
          <div className="text-center">Agency</div>
          <div className="text-center">Freelancer</div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a href="https://wa.me/919832078313?text=Hi%2C%20I%20want%20the%20Growth%20Plan" target="_blank" rel="noopener noreferrer">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 inline-flex items-center gap-2 text-base shadow-lg shadow-primary/20">
              Get All 9 Features for Rs 6,999/mo
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
          <p className="text-xs text-muted-foreground mt-3">No contract. Cancel anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
