import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "FormiqStudio delivered our MVP in exactly 15 days. The quality exceeded our expectations and the communication was outstanding throughout.",
    name: "Sarah Chen",
    role: "CTO, TechFlow Solutions",
  },
  {
    quote: "Professional team, clean code, and delivered on time. They understood our requirements perfectly and built exactly what we needed.",
    name: "Marcus Rodriguez",
    role: "Founder, StartupX",
  },
  {
    quote: "Our marketplace sales exploded after partnering with FormiqStudio. They truly understand e-commerce and digital strategy.",
    name: "Priya Sharma",
    role: "Founder, StyleCraft Fashion",
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">What Our Clients Say</h2>
          <p className="text-muted-foreground text-sm">Trusted by startups and enterprises alike</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
