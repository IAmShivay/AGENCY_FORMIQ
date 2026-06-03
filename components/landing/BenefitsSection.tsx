"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Users,
  Award,
  Smartphone,
  Globe,
  BarChart
} from 'lucide-react';

const BenefitsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

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

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast Development",
      description: "Get your solution delivered in 30 days or less with our proven development process",
      metric: "30 Days",
      color: "text-yellow-500"
    },
    {
      icon: TrendingUp,
      title: "Guaranteed ROI",
      description: "See measurable results within 90 days or get your money back",
      metric: "90 Days",
      color: "text-green-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with 99.9% uptime guarantee for peace of mind",
      metric: "99.9%",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "24/7 Expert Support",
      description: "Round-the-clock support from our certified technical experts",
      metric: "24/7",
      color: "text-purple-500"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Responsive solutions that work perfectly on all devices",
      metric: "100%",
      color: "text-pink-500"
    },
    {
      icon: Globe,
      title: "Scalable Architecture",
      description: "Built to grow with your business from startup to enterprise",
      metric: "∞",
      color: "text-primary"
    }
  ];

  const stats = [
    {
      icon: BarChart,
      number: "500+",
      label: "Projects Completed",
      description: "Successfully delivered across industries"
    },
    {
      icon: Award,
      number: "98%",
      label: "Client Satisfaction",
      description: "Consistently exceeding expectations"
    },
    {
      icon: Clock,
      number: "30",
      label: "Average Days",
      description: "From concept to deployment"
    },
    {
      icon: TrendingUp,
      number: "40%",
      label: "Efficiency Gain",
      description: "Average improvement for clients"
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 4}s`,
              animationDuration: `${20 + i * 3}s`,
            }}
          >
            <div className="w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-2 animated-gradient-text">
              Why Choose Our 15-Day MVP Process?
            </h2>
            <p className="text-sm text-muted-foreground">
              Fast, reliable, and results-driven development that gets you to market quickly
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="group p-4 rounded-xl bg-gradient-to-br from-card via-card/95 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                >
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>

                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary block">
                        {benefit.metric}
                      </span>
                      <div className="w-8 h-1 bg-primary/30 rounded-full ml-auto"></div>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors relative z-10">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground relative z-10">
                    {benefit.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="text-center"
                    >
                      <div className="flex justify-center mb-2">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div className="text-xl font-bold text-primary mb-1">
                        {stat.number}
                      </div>
                      <div className="text-xs font-medium mb-1">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
