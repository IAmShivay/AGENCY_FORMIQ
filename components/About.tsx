"use client";

import { Users, Trophy, Clock, Rocket, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { icon: Users, value: "25+", label: "Clients Served" },
  { icon: Trophy, value: "98%", label: "Client Satisfaction" },
  { icon: Clock, value: "15 Days", label: "Average MVP Delivery" },
  { icon: Rocket, value: "50+", label: "Projects Delivered" },
];

const strengths = [
  "Full-stack Web & Mobile Development",
  "AI Automation & Workflow Agents",
  "E-commerce & Marketplace Management",
  "Digital Marketing & SEO",
  "UI/UX Design & Branding",
  "Cloud Infrastructure & DevOps",
];

const About = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <span className="text-xs font-semibold text-primary">About FormiqStudio</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Trusted Technology Partner
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-6">
              We design, develop, and deliver custom digital solutions to help businesses grow faster and smarter. Our expert team combines innovation, performance, and strategy to achieve measurable results.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {strengths.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <Link href="/about">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200">
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Right - Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-card border border-border text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
