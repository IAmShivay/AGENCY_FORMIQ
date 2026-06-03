"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FinalCTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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

  const urgencyFeatures = [
    {
      icon: Clock,
      text: "⚡ 15-Day MVP Delivery"
    },
    {
      icon: CheckCircle,
      text: "🚀 Launch Ready Code"
    },
    {
      icon: Star,
      text: "💰 Get Funded Faster"
    }
  ];

  const trustIndicators = [
    {
      icon: Zap,
      number: "30",
      label: "Days Average Delivery"
    },
    {
      icon: Shield,
      number: "98%",
      label: "Client Satisfaction"
    },
    {
      icon: Users,
      number: "500+",
      label: "Happy Clients"
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Urgency Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">⚡ Limited Time Offer - Act Now!</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
          >
            Your MVP Could Be Live
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
              in Just 15 Days
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            While others spend months planning, you could be <strong className="text-orange-500">capturing customers</strong>,
            <strong className="text-pink-500"> getting investor attention</strong>, and
            <strong className="text-purple-600"> dominating your market</strong>.
          </motion.p>

          {/* Urgency Features */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            {urgencyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20">
                  <Icon className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              );
            })}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto"
          >
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary mr-2" />
                    <span className="text-2xl font-bold text-primary">{indicator.number}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{indicator.label}</p>
                </div>
              );
            })}
          </motion.div>

          {/* Main CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              size="lg"
              onClick={scrollToContact}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-lg h-auto px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cta-button-glow"
            >
              <span className="relative z-10 flex items-center justify-center font-medium">
                Start My 15-Day MVP Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg h-auto px-8 py-4 border-2 border-primary text-primary hover:bg-primary/5 transition-colors duration-300 rounded-lg"
            >
              View Success Stories
            </Button>
          </motion.div>

          {/* Risk Reversal */}
          <motion.div variants={itemVariants}>
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-500 mr-2" />
                <span className="font-semibold text-green-600 dark:text-green-400">
                  100% Risk-Free Guarantee
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Not satisfied with our work? Get a full refund within 30 days.
                No questions asked. Your success is our only priority.
              </p>
            </div>
          </motion.div>

          {/* Scarcity Element */}
          <motion.div variants={itemVariants} className="mt-8">
            <p className="text-sm text-muted-foreground">
              ⏰ Only <strong className="text-orange-500">3 MVP spots</strong> left this month - Don't miss out!
            </p>
          </motion.div>

          {/* Final Trust Element */}
          <motion.div variants={itemVariants} className="mt-6">
            <p className="text-xs text-muted-foreground">
              🔒 Your information is secure and will never be shared.
              Join 500+ businesses that trust us with their digital transformation.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 3}s`,
            }}
          >
            <div
              className="w-32 h-32 rounded-full bg-primary/5 blur-2xl"
              style={{
                transform: `scale(${0.5 + Math.random() * 0.5})`,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FinalCTA;
