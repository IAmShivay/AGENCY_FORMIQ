"use client";

import { Check, X, ArrowRight } from 'lucide-react';

const ComparisonSection = () => {
  const rows = [
    { feature: "Professional Website", us: true, them: true, freelancer: false },
    { feature: "Facebook & Instagram Ads", us: true, them: true, freelancer: false },
    { feature: "Social Media Management", us: true, them: false, freelancer: true },
    { feature: "Google My Business Setup", us: true, them: false, freelancer: false },
    { feature: "Monthly Reports", us: true, them: true, freelancer: false },
    { feature: "In-Person Meetings", us: true, them: false, freelancer: false },
    { feature: "No Lock-in Contract", us: true, them: false, freelancer: true },
    { feature: "Dedicated Account Manager", us: true, them: true, freelancer: false },
    { feature: "Cancel Anytime", us: true, them: false, freelancer: true },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 text-foreground">
            Why Businesses Choose Us
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Same expert work. Fraction of the cost. Plus we show up in person.
          </p>
        </div>

        {/* Mobile: highlight cards */}
        <div className="block sm:hidden space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border">
              <p className="text-sm font-semibold text-foreground mb-3">{row.feature}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className={`text-center p-2 rounded-lg ${row.us ? 'bg-primary/10' : 'bg-muted/50'}`}>
                  <div className="mb-1">{row.us ? <Check className="w-5 h-5 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}</div>
                  <span className="text-primary font-bold text-[11px]">Us (Rs 6,999)</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <div className="mb-1">{row.them ? <Check className="w-4 h-4 text-muted-foreground mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}</div>
                  <span className="text-muted-foreground text-[11px]">Agency (Rs 25K+)</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <div className="mb-1">{row.freelancer ? <Check className="w-4 h-4 text-muted-foreground mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}</div>
                  <span className="text-muted-foreground text-[11px]">Freelancer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table with highlighted column */}
        <div className="hidden sm:block rounded-2xl border border-border overflow-hidden bg-card shadow-lg">
          <div className="grid grid-cols-4 p-5 text-sm font-semibold text-foreground border-b border-border bg-muted/30">
            <div className="text-muted-foreground">What you get</div>
            <div className="text-center">
              <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">FormiqStudio</div>
              <div className="text-xs text-primary font-bold mt-1.5">Rs 6,999/mo</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Typical Agency</div>
              <div className="text-xs text-muted-foreground font-normal mt-1.5">Rs 25,000+/mo</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Freelancer</div>
              <div className="text-xs text-muted-foreground font-normal mt-1.5">Unreliable</div>
            </div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-4 p-5 text-sm items-center border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors`}>
              <div className="text-foreground font-medium">{row.feature}</div>
              <div className="flex justify-center">
                {row.us ? (
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                  </div>
                ) : (
                  <X className="w-4 h-4 text-muted-foreground/20" />
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

          {/* Bottom CTA row */}
          <div className="grid grid-cols-4 p-5 bg-primary/5 border-t border-primary/20">
            <div />
            <div className="text-center">
              <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20the%20Growth%20Plan" target="_blank" rel="noopener noreferrer">
                <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-all inline-flex items-center gap-1.5 shadow-md shadow-primary/20">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </a>
            </div>
            <div />
            <div />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
