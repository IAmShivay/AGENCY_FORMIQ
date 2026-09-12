"use client";

const stats = [
  { value: "50+", label: "Businesses Served" },
  { value: "Rs 20L+", label: "Ad Spend Managed" },
  { value: "3x", label: "Avg. Lead Increase" },
  { value: "4.9/5", label: "Client Rating" },
];

const SocialProofBar = () => {
  return (
    <section className="py-8 bg-primary/5 border-y border-border/50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
