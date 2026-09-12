"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Star, ArrowRight, Zap, Crown, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pricingPlans = [
  {
    name: "Starter",
    icon: Zap,
    description: "Just need a website? We've got you.",
    price: "Rs 14,999",
    period: "one-time",
    popular: false,
    features: [
      "Professional 5-page website",
      "Mobile responsive design",
      "Contact form & WhatsApp integration",
      "Google Maps & directions",
      "Basic SEO setup",
      "Free hosting for 1 year",
      "Delivered in 15 days",
    ],
    cta: "Get Started",
  },
  {
    name: "Growth Plan",
    icon: Crown,
    description: "Website + Ads + Social Media. Everything you need.",
    price: "Rs 6,999",
    period: "/month",
    popular: true,
    features: [
      "Professional website (built & maintained)",
      "Facebook & Instagram ad campaigns",
      "Ad creative design by our team",
      "Social media management (12 posts/month)",
      "Google My Business optimization",
      "Monthly performance report",
      "Dedicated account manager",
      "In-person meetings available",
      "Cancel anytime - no lock-in",
    ],
    cta: "Start Growing",
  },
  {
    name: "Scale",
    icon: Rocket,
    description: "For businesses ready to dominate.",
    price: "Rs 14,999",
    period: "/month",
    popular: false,
    features: [
      "Everything in Growth Plan",
      "Google Ads management",
      "Advanced landing pages",
      "Lead tracking dashboard",
      "Email marketing automation",
      "24 social media posts/month",
      "Video content creation",
      "Competitor analysis",
      "Priority support",
    ],
    cta: "Let's Talk",
  },
];

const openWhatsApp = (planName: string) => {
  window.open(
    `https://wa.me/918918349445?text=Hi%2C%20I'm%20interested%20in%20the%20${encodeURIComponent(planName)}%20plan`,
    '_blank'
  );
};

const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const popular = pricingPlans.find(p => p.popular)!;
  const others = pricingPlans.filter(p => !p.popular);

  return (
    <section ref={sectionRef} id="pricing" className="py-10 sm:py-16 md:py-20 bg-gradient-to-br from-muted/20 to-muted/40">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1.5 sm:mb-4">
              Simple Pricing. Real Results.
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. No contracts. Same expert team that agencies charge Rs 50,000+ for.
            </p>
          </div>

          {/* Mobile: popular card + compact others */}
          <div className="sm:hidden space-y-3 mb-6">
            {/* Popular plan - full card */}
            <div className="relative rounded-2xl p-4 border-2 border-primary bg-primary/5 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" /> Most Popular
                </span>
              </div>
              <div className="text-center mt-2 mb-3">
                <h3 className="text-lg font-bold">{popular.name}</h3>
                <div className="mt-1">
                  <span className="text-2xl font-extrabold">{popular.price}</span>
                  <span className="text-sm text-muted-foreground">{popular.period}</span>
                </div>
                <p className="text-[10px] text-primary font-medium mt-0.5">Rs 233/day</p>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mb-3">
                {popular.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-foreground leading-tight">{f}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => openWhatsApp(popular.name)}>
                {popular.cta} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Other plans - compact rows */}
            {others.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <div key={i} className="rounded-xl p-3.5 border border-border bg-card flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{plan.price} <span className="text-[10px]">{plan.period}</span></p>
                    </div>
                  </div>
                  <button
                    onClick={() => openWhatsApp(plan.name)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Desktop: 3-col grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] ${
                    plan.popular
                      ? 'border-primary bg-primary/5 shadow-lg scale-105'
                      : 'border-border/50 bg-card hover:border-primary/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1" /> Most Popular
                      </div>
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <div className={`inline-flex p-3 rounded-lg mb-4 ${plan.popular ? 'bg-primary/20' : 'bg-muted'}`}>
                      <Icon className={`w-8 h-8 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-lg text-muted-foreground">{plan.period}</span>
                    </div>
                    {plan.popular && <p className="text-xs text-primary font-medium">That's just Rs 233/day</p>}
                  </div>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className="flex items-center">
                        <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-background hover:bg-muted border border-border'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => openWhatsApp(plan.name)}
                  >
                    {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <div className="bg-background rounded-2xl p-5 sm:p-8 border border-border/50 max-w-2xl mx-auto">
              <h3 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-2">Not sure which plan?</h3>
              <p className="text-xs sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Free 15-minute call. No pressure, no sales pitch.
              </p>
              <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20a%20free%20consultation" target="_blank" rel="noopener noreferrer">
                <Button variant="default">
                  Book Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
