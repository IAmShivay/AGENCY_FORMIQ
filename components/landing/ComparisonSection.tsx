"use client";

import { Check, X } from 'lucide-react';

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
    <section className="py-16 md:py-20 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Why Businesses Choose Us
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Same expert work. Fraction of the cost. Plus we show up in person.
          </p>
        </div>

        {/* Mobile: stacked cards */}
        <div className="block sm:hidden space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border">
              <p className="text-sm font-medium text-foreground mb-3">{row.feature}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="mb-1">{row.us ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}</div>
                  <span className="text-primary font-semibold">Us</span>
                </div>
                <div className="text-center">
                  <div className="mb-1">{row.them ? <Check className="w-4 h-4 text-muted-foreground mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}</div>
                  <span className="text-muted-foreground">Agency</span>
                </div>
                <div className="text-center">
                  <div className="mb-1">{row.freelancer ? <Check className="w-4 h-4 text-muted-foreground mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}</div>
                  <span className="text-muted-foreground">Freelancer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
          <div className="grid grid-cols-4 bg-muted/50 p-4 sm:p-5 text-sm font-semibold text-foreground">
            <div>Feature</div>
            <div className="text-center">
              <div className="text-primary font-bold">FormiqStudio</div>
              <div className="text-xs text-muted-foreground font-normal mt-0.5">Rs 6,999/mo</div>
            </div>
            <div className="text-center">
              <div>Typical Agency</div>
              <div className="text-xs text-muted-foreground font-normal mt-0.5">Rs 25,000+/mo</div>
            </div>
            <div className="text-center">
              <div>Freelancer</div>
              <div className="text-xs text-muted-foreground font-normal mt-0.5">Rs 5-15K</div>
            </div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-4 p-4 sm:p-5 text-sm items-center ${
              i % 2 === 0 ? '' : 'bg-muted/10'
            } ${i < rows.length - 1 ? 'border-b border-border/50' : ''}`}>
              <div className="text-foreground font-medium">{row.feature}</div>
              <div className="flex justify-center">
                {row.us ? (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                ) : (
                  <X className="w-4 h-4 text-muted-foreground/30" />
                )}
              </div>
              <div className="flex justify-center">
                {row.them ? (
                  <Check className="w-4 h-4 text-muted-foreground/60" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground/30" />
                )}
              </div>
              <div className="flex justify-center">
                {row.freelancer ? (
                  <Check className="w-4 h-4 text-muted-foreground/60" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground/30" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
