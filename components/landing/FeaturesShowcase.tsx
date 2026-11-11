"use client";

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Code2,
  Smartphone,
  Database,
  Shield,
  Zap,
  Globe,
  BarChart,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturesShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [activeFeature, setActiveFeature] = useState(0);

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

  const features = [
    {
      icon: Code2,
      title: "Custom SaaS Development",
      description: "Scalable software-as-a-service platforms built for growth",
      details: [
        "Full-stack web applications",
        "API development & integration",
        "Legacy system modernization",
        "Microservices architecture"
      ],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Native iOS & Android apps that users love",
      details: [
        "iOS & Android native apps",
        "React Native development",
        "Progressive Web Apps (PWA)",
        "App Store optimization"
      ],
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop"
    },
    {
      icon: Globe,
      title: "E-commerce Platforms",
      description: "Custom online stores that drive sales and conversions",
      details: [
        "Custom e-commerce development",
        "Payment gateway integration",
        "Inventory management systems",
        "Multi-vendor marketplaces"
      ],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
    },
    {
      icon: BarChart,
      title: "Business Intelligence",
      description: "Data-driven insights and analytics dashboards",
      details: [
        "Real-time analytics dashboards",
        "Data visualization tools",
        "Business intelligence reports",
        "Performance monitoring"
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    },
    {
      icon: Zap,
      title: "API Development",
      description: "Robust APIs for seamless system integration",
      details: [
        "RESTful API development",
        "GraphQL implementations",
        "Third-party integrations",
        "API documentation & testing"
      ],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop"
    },
    {
      icon: Users,
      title: "CRM & ERP Systems",
      description: "Custom business management solutions",
      details: [
        "Customer relationship management",
        "Enterprise resource planning",
        "Workflow automation",
        "Team collaboration tools"
      ],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
    },
    {
      icon: Shield,
      title: "DevOps & Cloud",
      description: "Scalable cloud infrastructure and deployment",
      details: [
        "Cloud migration services",
        "CI/CD pipeline setup",
        "Infrastructure as code",
        "Security & monitoring"
      ],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop"
    },
    {
      icon: CheckCircle,
      title: "MVP Development",
      description: "Rapid prototyping to validate your business idea",
      details: [
        "15-day MVP delivery",
        "User feedback integration",
        "Iterative development",
        "Market validation support"
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
    }
  ];

  const quickFeatures = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and performance"
    },
    {
      icon: Globe,
      title: "Scalable",
      description: "Built to grow with your business"
    },
    {
      icon: BarChart,
      title: "Analytics Ready",
      description: "Built-in tracking and reporting"
    },
    {
      icon: Users,
      title: "User-Friendly",
      description: "Intuitive interfaces your team will love"
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 bg-gradient-to-br from-primary/5 via-muted/20 to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
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
              What We Build for You
            </h2>
            <p className="text-sm text-muted-foreground">
              End-to-end solutions that get you to market fast
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isHighlighted = index === 0 || index === 7; // Highlight first and last (MVP Development)
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className={`group p-6 rounded-2xl transition-all duration-300 text-center relative overflow-hidden ${
                    isHighlighted
                      ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-primary/15 border-2 border-primary/40 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-br from-card via-card/95 to-primary/5 border border-primary/20 hover:border-primary/40 hover:shadow-lg'
                  }`}
                >
                  {/* Highlighted Badge */}
                  {isHighlighted && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      {index === 0 ? 'POPULAR' : 'FEATURED'}
                    </div>
                  )}

                  {/* Background Decoration */}
                  <div className={`absolute inset-0 transition-opacity duration-300 ${
                    isHighlighted
                      ? 'bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15 opacity-50 group-hover:opacity-70'
                      : 'bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100'
                  }`}></div>

                  <div className="relative z-10">
                    <div className={`inline-flex p-4 rounded-2xl mb-4 transition-all duration-300 shadow-md ${
                      isHighlighted
                        ? 'bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20'
                        : 'bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10'
                    }`}>
                      <Icon className={`w-7 h-7 transition-transform duration-300 group-hover:scale-110 ${
                        isHighlighted ? 'text-primary' : 'text-primary'
                      }`} />
                    </div>

                    <h3 className={`font-bold mb-3 transition-colors duration-300 ${
                      isHighlighted
                        ? 'text-base text-primary group-hover:text-primary/80'
                        : 'text-sm group-hover:text-primary'
                    }`}>
                      {feature.title}
                    </h3>

                    <p className={`leading-relaxed transition-colors duration-300 ${
                      isHighlighted
                        ? 'text-sm text-muted-foreground'
                        : 'text-xs text-muted-foreground'
                    }`}>
                      {feature.description}
                    </p>

                    {/* Enhanced bottom accent */}
                    <div className={`rounded-full mx-auto mt-4 transition-all duration-300 ${
                      isHighlighted
                        ? 'w-16 h-1.5 bg-primary/40 group-hover:bg-primary/60'
                        : 'w-12 h-1 bg-primary/20 group-hover:bg-primary/40'
                    }`}></div>

                    {/* Pulse effect for highlighted items */}
                    {isHighlighted && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 animate-pulse"></div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
