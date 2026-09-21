'use client';

import { CheckCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';
import ContactForm from './landing/ContactForm';

interface ServiceFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

interface ProcessStep {
  title: string;
  description: string;
  icon: LucideIcon;
  tools: string[];
  benefits: string;
}

interface Highlight {
  name: string;
  description: string;
  features: string[];
  color: string;
}

interface ServicePageLayoutProps {
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  titleAccent: string;
  subtitle: string;
  highlights?: Highlight[];
  services: ServiceFeature[];
  servicesTitle: string;
  servicesSubtitle: string;
  process: ProcessStep[];
  processTitle: string;
  processSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaIcon: LucideIcon;
}

export default function ServicePageLayout({
  badge,
  badgeIcon: BadgeIcon,
  title,
  titleAccent,
  subtitle,
  highlights,
  services,
  servicesTitle,
  servicesSubtitle,
  process,
  processTitle,
  processSubtitle,
  ctaTitle,
  ctaSubtitle,
  ctaIcon: CtaIcon,
}: ServicePageLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BadgeIcon className="w-4 h-4" />
              {badge}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">{titleAccent}</span>
              <br />
              <span className="text-foreground">{title}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8 py-4 h-auto">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  View Portfolio
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-14">
                {highlights.map((item) => (
                  <div
                    key={item.name}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} text-white relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-white/90 mb-4 text-sm">{item.description}</p>
                      <div className="space-y-1">
                        {item.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-primary">{servicesTitle}</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {servicesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-shadow duration-200 group hover:shadow-lg"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 inline-flex mb-4 group-hover:bg-primary/15 transition-colors duration-200">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-2">
                      {service.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-primary">{processTitle}</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {processSubtitle}
              </p>
            </div>

            <div className="space-y-10">
              {process.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className={cn(
                      'flex flex-col lg:flex-row items-center gap-8 lg:gap-12',
                      index % 2 === 1 && 'lg:flex-row-reverse'
                    )}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <Icon className="w-6 h-6 text-white" />
                          <span className="text-xs font-bold text-white mt-1">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-5 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 text-sm">Tools & Methods</h4>
                          <div className="space-y-1.5">
                            {step.tools.map((tool, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {tool}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 text-sm">Key Benefits</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{step.benefits}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA + Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}
