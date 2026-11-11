"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check, IndianRupee, Zap, DollarSign, Euro, Globe } from 'lucide-react';
import { useRouter } from "next/navigation";

// Define country currencies and conversion rates
const currencies = {
  "India": {
    code: "INR",
    symbol: <IndianRupee className="w-4 h-4" />,
    rate: 1, // Base rate (1 INR = 1 INR)
    format: (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`
  },

  "Europe": {
    code: "EUR",
    symbol: <Euro className="w-4 h-4" />,
    rate: 0.011, // 1 INR = 0.011 EUR (as of Mar 2025)
    format: (value: number) => `€${(value * 0.011).toFixed(2)}`
  },
};

// Base plans in Indian Rupees
const plans = [
  {
    name: 'Starter',
    price: 49999,
    description: 'Perfect for small businesses',
    features: [
      'Custom Software Development',
      'Basic Support (9-5)',
      'Monthly Updates',
      'Security Patches',
      '1 Team Member'
    ]
  },
  {
    name: 'Professional',
    price: 99999,
    description: 'Ideal for growing companies',
    features: [
      'Everything in Starter',
      'Priority Support',
      'Weekly Updates',
      'Performance Monitoring',
      '5 Team Members'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 199999,
    description: 'For large organizations',
    features: [
      'Everything in Professional',
      '24/7 Support',
      'Custom Features',
      'Dedicated Account Manager',
      'Unlimited Team Members'
    ]
  }
];

type CountryKey = keyof typeof currencies;

const Pricing = () => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>("India");

  // Uncomment if you want to use the animation
  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     gsap.from(".pricing-card", {
  //       y: 100,
  //       opacity: 0,
  //       scale: 0.95,
  //       duration: 0.8,
  //       stagger: 0.2,
  //       ease: "power2.out",
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top center+=100",
  //         toggleActions: "play none none reverse"
  //       }
  //     });
  //   }, sectionRef);
  //
  //   return () => ctx.revert();
  // }, []);

  // Handler for country selection
  const handleCountryChange = (country: CountryKey) => {
    setSelectedCountry(country);
  };

  // Get the current currency symbol based on selected country
  const currencySymbol = currencies[selectedCountry].symbol;

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative">
          {/* Left side empty for desktop to balance the currency selector on right */}
          <div className="hidden md:block md:w-64"></div>

          {/* Center content */}
          <div className="text-center space-y-4 flex-1">
            <h2 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
              <IndianRupee className="w-8 h-8 text-primary" />
              Flexible Pricing Plans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scale your business with our tailored solutions. Find the perfect plan that fits your needs.
            </p>
          </div>

          {/* Currency selector - right aligned on desktop, centered on mobile */}
          <div className="mt-8 md:mt-0 md:w-64">
            <div className="bg-card/70 backdrop-blur-sm border border-muted/30 rounded-lg p-2 shadow-sm">
              <div className="flex items-center justify-between mb-2 px-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Select Currency</span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                {(Object.keys(currencies) as Array<CountryKey>).map((country) => (
                  <button
                    key={country}
                    onClick={() => handleCountryChange(country)}
                    className={`
                      flex items-center justify-between p-2 rounded 
                      transition-all duration-200 text-sm
                      ${selectedCountry === country
                        ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                        : 'hover:bg-muted/50 text-muted-foreground'}
                    `}
                  >
                    <span className="flex items-center gap-1.5">
                      {currencies[country].symbol}
                      {country}
                    </span>
                    <span className="text-xs opacity-70">{currencies[country].code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`
                pricing-card 
                group 
                p-8 
                relative 
                overflow-hidden 
                border-2 
                transition-all 
                duration-300 
                ${plan.popular
                  ? 'border-primary/50 shadow-xl hover:shadow-2xl bg-card/60 backdrop-blur-sm'
                  : 'border-muted/30 hover:border-primary/30'}
              `}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground 
                  px-4 py-1 text-sm rounded-bl-lg rounded-tr-lg flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-current" />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8 space-y-4">
                <h3 className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground">{plan.description}</p>
                <div className="text-4xl font-bold text-primary/90 flex items-center justify-center gap-1">
                  {currencies[selectedCountry].format(plan.price)}
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full group"
                onClick={() => router.push("/contact")}
                variant={plan.popular ? "default" : "outline"}
              >
                <span className="group-hover:scale-105 transition-transform">
                  Get Started
                </span>
              </Button>

              {/* Subtle background gradient effect */}
              <div
                className={`
                  absolute 
                  -z-10 
                  -inset-[1px] 
                  opacity-20 
                  group-hover:opacity-30 
                  transition-opacity 
                  ${plan.popular
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10'
                    : 'bg-gradient-to-br from-muted/10 to-muted/5'}
                `}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;