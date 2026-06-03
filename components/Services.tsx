"use client";

import Link from "next/link";
import {
  Code2,
  MessageSquare,
  Database,
  Globe,
  Shield,
  ShoppingCart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Full-stack web apps, APIs, SaaS platforms, and cloud-native solutions built for scale.",
    href: "/web",
  },
  {
    icon: Database,
    title: "Mobile Apps",
    description: "Native and cross-platform mobile apps with seamless UX for iOS and Android.",
    href: "/mobile",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce & Marketplace",
    description: "Amazon, Flipkart, Meesho — store setup, listing optimization, and ad campaigns.",
    href: "/ecommerce-marketplace",
  },
  {
    icon: Globe,
    title: "Digital Marketing",
    description: "SEO, email campaigns, social media, and data-driven strategies that convert.",
    href: "/marketing",
  },
  {
    icon: Shield,
    title: "Shopify",
    description: "Complete Shopify store design, development, optimization, and management.",
    href: "/shopify",
  },
  {
    icon: MessageSquare,
    title: "AI & ML",
    description: "Intelligent automation agents, workflow tools, and AI-powered business solutions.",
    href: "/agents",
  },
];

const Services = () => {
  return (
    <section className="py-12 md:py-16 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4" />
            What We Do
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Services We Offer
          </h2>
          <p className="text-lg text-muted-foreground">
            From software development to digital marketing — everything your business needs to grow.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link key={index} href={service.href}>
                <div className="group h-full p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link href="/contact">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200">
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
