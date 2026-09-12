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
    <section className="py-16 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Why Businesses Choose Us
          </h2>
          <p className="text-lg text-muted-foreground">
            Same expert work. Fraction of the cost. Plus we show up in person.
          </p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <div className="grid grid-cols-4 bg-muted/50 p-4 text-sm font-semibold text-foreground">
            <div>Feature</div>
            <div className="text-center">
              <div className="text-primary">FormiqStudio</div>
              <div className="text-xs text-muted-foreground font-normal">Rs 6,999/mo</div>
            </div>
            <div className="text-center">
              <div>Typical Agency</div>
              <div className="text-xs text-muted-foreground font-normal">Rs 25,000+/mo</div>
            </div>
            <div className="text-center">
              <div>Freelancer</div>
              <div className="text-xs text-muted-foreground font-normal">Rs 5,000-15,000</div>
            </div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-4 p-4 text-sm items-center ${
              i % 2 === 0 ? '' : 'bg-muted/20'
            }`}>
              <div className="text-foreground">{row.feature}</div>
              <div className="flex justify-center">
                {row.us ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex justify-center">
                {row.them ? (
                  <Check className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex justify-center">
                {row.freelancer ? (
                  <Check className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground/40" />
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
