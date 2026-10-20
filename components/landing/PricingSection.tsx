"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X, Star, ArrowRight, Zap, Crown, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
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
      "Cancel anytime — no lock-in",
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
    `https://wa.me/919832078313?text=Hi%2C%20I'm%20interested%20in%20the%20${encodeURIComponent(planName)}%20plan`,
    '_blank'
  );
};

const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const popular = pricingPlans.find(p => p.popular)!;
  const others = pricingPlans.filter(p => !p.popular);

  const compareRows = [
    { feature: "Facebook & Instagram Ads", us: true, them: true, freelancer: false },
    { feature: "Social Media Management", us: true, them: false, freelancer: true },
    { feature: "Google My Business Setup", us: true, them: false, freelancer: false },
    { feature: "In-Person Meetings", us: true, them: false, freelancer: false },
    { feature: "No Lock-in · Cancel Anytime", us: true, them: false, freelancer: true },
  ];

  return (
    <section ref={sectionRef} id="pricing" className="py-8 sm:py-12 md:py-16 bg-muted/20 relative overflow-visible">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/15 text-xs font-semibold tracking-widest text-primary uppercase mb-3">
              <Sparkles className="w-3 h-3" /> Pricing
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 tracking-tight">
              Simple Pricing. Real Results.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. No contracts. Same expert team that agencies charge{' '}
              <span className="font-semibold text-foreground">Rs 50,000+</span> for.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> 30-day money-back guarantee · No questions asked
            </div>
          </div>

          {/* Mobile: horizontal swipeable - snap scroll */}
          <div className="sm:hidden mb-6 -mx-4">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pt-5 pb-4 scrollbar-none scroll-smooth overflow-y-visible" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'visible' }}>
              {pricingPlans.map((plan, idx) => {
                const Icon = plan.icon;
                const isPopular = plan.popular;
                return (
                  <div
                    key={idx}
                    className={`relative flex-shrink-0 w-[85vw] max-w-[320px] snap-center rounded-[20px] p-5 border flex flex-col overflow-visible ${
                      isPopular
                        ? 'border-2 border-primary bg-card shadow-xl shadow-primary/10'
                        : 'border border-border bg-card shadow-sm'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg whitespace-nowrap">
                          <Star className="w-3 h-3 fill-white" /> Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center mt-3 mb-4">
                      <div className={`inline-flex p-2.5 rounded-xl mb-3 border ${isPopular ? 'bg-primary/10 border-primary/20' : 'bg-muted border-border'}`}>
                        <Icon className={`w-5 h-5 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 min-h-[32px]">{plan.description}</p>
                      <div className="mt-3">
                        <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      </div>
                      {isPopular ? (
                        <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-2">Rs 233/day · Best value</p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground mt-2 h-[18px]" />
                      )}
                    </div>
                    <div className="space-y-2 mb-4 flex-1">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isPopular ? 'bg-primary/10' : 'bg-muted'}`}>
                            <Check className={`w-3 h-3 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={3} />
                          </div>
                          <span className="text-xs font-medium text-foreground leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className={`w-full h-11 text-sm font-semibold ${isPopular ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20' : 'bg-card hover:bg-muted border border-border text-foreground hover:border-primary/20'}`}
                      variant={isPopular ? 'default' : 'outline'}
                      onClick={() => openWhatsApp(plan.name)}
                    >
                      {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    {isPopular && <p className="text-center text-[10px] text-muted-foreground mt-2">No lock-in · Cancel anytime</p>}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Swipe to compare plans <span className="text-primary">→</span>
            </p>
          </div>

          {/* Desktop: 3-col grid - 3 cols from sm to avoid orphan line on tablet */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-4 lg:gap-6 mb-10 pt-5">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`relative rounded-[20px] p-5 md:p-7 lg:p-8 border flex flex-col transition-all duration-300 overflow-visible ${
                    plan.popular
                      ? 'border-primary bg-card shadow-2xl shadow-primary/15 lg:scale-105 z-10'
                      : 'border-border bg-card shadow-sm hover:shadow-lg hover:border-primary/15 hover:-translate-y-1'
                  }`}
                >
                  {plan.popular && (
                    <>
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-primary/25 whitespace-nowrap">
                          <Star className="w-3.5 h-3.5 fill-white" /> Most Popular
                        </div>
                      </div>
                    </>
                  )}
                  <div className="text-center mb-6 mt-2">
                    <div className={`inline-flex p-3 rounded-xl mb-4 border ${plan.popular ? 'bg-primary/10 border-primary/20' : 'bg-muted border-border'}`}>
                      <Icon className={`w-6 h-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{plan.description}</p>
                    <div className="mb-1">
                      <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    {plan.popular ? (
                      <p className="inline-flex text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Rs 233/day · Cancel anytime</p>
                    ) : (
                      <p className="text-xs text-muted-foreground h-5" />
                    )}
                  </div>
                  <div className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-primary/10' : 'bg-muted'}`}>
                          <Check className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={3} />
                        </div>
                        <span className="text-sm leading-snug text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`w-full h-11 font-semibold ${plan.popular ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20' : 'bg-card hover:bg-muted border border-border text-foreground hover:border-primary/20'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => openWhatsApp(plan.name)}
                  >
                    {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Mini comparison - premium table */}
          <div className="max-w-3xl mx-auto mb-10 sm:mb-12">
            <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">
              Why businesses choose us over alternatives
            </p>
            <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
              <div className="grid grid-cols-4 px-4 py-3 bg-muted/40 border-b border-border text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <div>Feature</div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-primary"><Crown className="w-3 h-3" /> Formiq</span>
                </div>
                <div className="text-center">Agency</div>
                <div className="text-center">Freelancer</div>
              </div>
              {compareRows.map((row, i) => (
                <div key={i} className={`grid grid-cols-4 px-4 py-3.5 items-center text-xs sm:text-sm ${i % 2 === 1 ? 'bg-muted/20' : 'bg-card'} ${i < compareRows.length - 1 ? 'border-b border-border/40' : ''}`}>
                  <div className="font-medium text-foreground pr-2 text-[12px] sm:text-sm">{row.feature}</div>
                  <div className="flex justify-center">
                    {row.us ? (
                      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <X className="w-3.5 h-3.5 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">{row.them ? <Check className="w-4 h-4 text-muted-foreground" /> : <X className="w-4 h-4 text-muted-foreground/25" />}</div>
                  <div className="flex justify-center">{row.freelancer ? <Check className="w-4 h-4 text-muted-foreground" /> : <X className="w-4 h-4 text-muted-foreground/25" />}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2.5">
              <span className="font-semibold text-foreground">Rs 6,999/mo</span> vs Rs 25K+/mo agency · Freelancers miss key pieces
            </p>
          </div>

          <div className="text-center">
            <div className="bg-card rounded-[20px] p-6 sm:p-8 border border-border shadow-sm max-w-2xl mx-auto">
              <h3 className="text-base sm:text-lg font-bold mb-1.5">Not sure which plan fits you?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Free 15-minute call. We’ll recommend the right plan — no pressure, no sales pitch.
              </p>
              <a href="https://wa.me/919832078313?text=Hi%2C%20I%20want%20a%20free%20consultation" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="shadow-lg shadow-primary/15">
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
