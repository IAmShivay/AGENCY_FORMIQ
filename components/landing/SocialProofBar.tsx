"use client";

const stats = [
  { value: "50+", label: "Businesses Served" },
  { value: "Rs 20L+", label: "Ad Spend Managed" },
  { value: "3x", label: "Avg. Lead Increase" },
  { value: "4.9/5", label: "Client Rating" },
];

const SocialProofBar = () => {
  return (
    <section className="py-6 sm:py-8 bg-primary/5 border-y border-border/30">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary tracking-tight">{stat.value}</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
