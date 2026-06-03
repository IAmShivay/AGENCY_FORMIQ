"use client";

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Star, ArrowRight, Zap, Crown, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'project'>('project');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
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
      description: "Perfect for small businesses and startups",
      price: {
        project: "$5,000",
        monthly: "$500"
      },
      originalPrice: {
        project: "$7,500",
        monthly: "$750"
      },
      popular: false,
      features: [
        "Custom web application",
        "Responsive design",
        "Basic integrations",
        "3 months support",
        "Source code included",
        "Basic documentation",
        "Email support"
      ],
      deliveryTime: "15-20 days",
      cta: "Get Started"
    },
    {
      name: "Professional",
      icon: Crown,
      description: "Ideal for growing businesses",
      price: {
        project: "$12,000",
        monthly: "$1,200"
      },
      originalPrice: {
        project: "$18,000",
        monthly: "$1,800"
      },
      popular: true,
      features: [
        "Everything in Starter",
        "Advanced integrations",
        "Database optimization",
        "6 months support",
        "Admin dashboard",
        "API development",
        "Priority support",
        "Performance monitoring",
        "Security audit"
      ],
      deliveryTime: "20-30 days",
      cta: "Most Popular"
    },
    {
      name: "Enterprise",
      icon: Rocket,
      description: "For large organizations with complex needs",
      price: {
        project: "Custom",
        monthly: "$2,500+"
      },
      originalPrice: {
        project: null,
        monthly: null
      },
      popular: false,
      features: [
        "Everything in Professional",
        "Custom architecture",
        "Unlimited integrations",
        "12 months support",
        "Dedicated team",
        "24/7 support",
        "Advanced analytics",
        "Custom training",
        "SLA guarantee",
        "White-label options"
      ],
      deliveryTime: "30-45 days",
      cta: "Contact Sales"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transparent Pricing, Exceptional Value
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your business. All plans include our 
              30-day money-back guarantee.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-background rounded-lg p-1 border border-border/50">
              <button
                onClick={() => setBillingCycle('project')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  billingCycle === 'project'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Project-Based
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly Retainer
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                    plan.popular
                      ? 'border-primary bg-primary/5 shadow-lg scale-105'
                      : 'border-border/50 bg-card hover:border-primary/30'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex p-3 rounded-lg mb-4 ${
                      plan.popular ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        plan.popular ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    
                    {/* Pricing */}
                    <div className="mb-4">
                      {plan.originalPrice[billingCycle] && (
                        <div className="text-sm text-muted-foreground line-through mb-1">
                          {plan.originalPrice[billingCycle]}
                        </div>
                      )}
                      <div className="text-4xl font-bold">
                        {plan.price[billingCycle]}
                        {billingCycle === 'monthly' && plan.price[billingCycle] !== 'Custom' && (
                          <span className="text-lg text-muted-foreground">/month</span>
                        )}
                      </div>
                      {billingCycle === 'project' && (
                        <div className="text-sm text-muted-foreground mt-1">
                          One-time payment
                        </div>
                      )}
                    </div>

                    {/* Delivery Time */}
                    <div className="text-sm text-primary font-medium">
                      ⚡ Delivery: {plan.deliveryTime}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-background hover:bg-muted border border-border'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => {
                      const contactSection = document.getElementById('contact-form');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Money Back Guarantee */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-background rounded-2xl p-8 border border-border/50 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">30-Day Money-Back Guarantee</h3>
              <p className="text-muted-foreground">
                Not satisfied with our work? Get a full refund within 30 days. 
                No questions asked. Your success is our priority.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
