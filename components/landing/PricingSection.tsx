"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Star, ArrowRight, Zap, Crown, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };

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
      description: "For businesses ready to dominate their market.",
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

  return (
    <section ref={sectionRef} id="pricing" className="py-10 sm:py-16 md:py-20 bg-gradient-to-br from-muted/20 to-muted/40">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1.5 sm:mb-4">
              Simple Pricing. Real Results.
            </h2>
            <p className="text-xs sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. No contracts. Same expert team that agencies charge Rs 50,000+ for.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none"
          >
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`relative rounded-2xl p-4 sm:p-8 border transition-all duration-300 flex-shrink-0 w-[78vw] sm:w-auto snap-center ${
                    plan.popular
                      ? 'border-primary bg-primary/5 shadow-lg sm:scale-105'
                      : 'border-border/50 bg-card hover:border-primary/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-5 sm:mb-8">
                    <div className={`inline-flex p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 ${
                      plan.popular ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${
                        plan.popular ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{plan.name}</h3>
                    <p className="text-xs sm:text-base text-muted-foreground mb-3 sm:mb-4">{plan.description}</p>

                    <div className="mb-1 sm:mb-2">
                      <span className="text-2xl sm:text-4xl font-bold">{plan.price}</span>
                      <span className="text-sm sm:text-lg text-muted-foreground">{plan.period}</span>
                    </div>
                    {plan.popular && (
                      <p className="text-xs text-primary font-medium">That's just Rs 233/day</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-background hover:bg-muted border border-border'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => {
                      window.open(
                        `https://wa.me/918918349445?text=Hi%2C%20I'm%20interested%20in%20the%20${encodeURIComponent(plan.name)}%20plan`,
                        '_blank'
                      );
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-background rounded-2xl p-8 border border-border/50 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-2">Not sure which plan is right?</h3>
              <p className="text-muted-foreground mb-4">
                Book a free 15-minute call. We'll understand your business and recommend
                the right plan. No pressure, no sales pitch.
              </p>
              <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20a%20free%20consultation" target="_blank" rel="noopener noreferrer">
                <Button variant="default">
                  Book Free Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
