import { Users, Trophy, Clock, Rocket, Target, Zap, Shield, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { icon: Users, value: "25+", label: "Clients Served" },
  { icon: Trophy, value: "98%", label: "Client Satisfaction" },
  { icon: Clock, value: "15 Days", label: "Average MVP Delivery" },
  { icon: Rocket, value: "50+", label: "Projects Delivered" },
];

const values = [
  { icon: Target, title: "Results-Driven", description: "Every decision we make is focused on delivering measurable outcomes for your business." },
  { icon: Zap, title: "Fast Delivery", description: "We move fast without cutting corners. Your MVP in 15 days, production-ready." },
  { icon: Shield, title: "Security First", description: "Enterprise-grade security practices baked into every solution from day one." },
  { icon: Globe, title: "Global Reach", description: "Teams across India and USA serving clients worldwide with round-the-clock support." },
];

const expertise = [
  "Full-stack Web Development (React, Next.js, Node.js)",
  "Native & Cross-platform Mobile Apps (React Native, Flutter)",
  "AI & ML Automation (Custom agents, workflow tools)",
  "E-commerce & Marketplace Management (Amazon, Flipkart, Shopify)",
  "Digital Marketing (SEO, Social Media, Email Campaigns)",
  "Cloud Infrastructure & DevOps (AWS, GCP, CI/CD)",
  "UI/UX Design & Branding",
  "ERP & Management Software",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <span className="text-sm font-semibold text-primary">About FormiqStudio</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Your Trusted Technology Partner
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            FormiqStudio is a full-service digital agency that designs, develops, and delivers custom solutions to help businesses grow faster and smarter. We combine innovation, performance, and strategy to achieve measurable results.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="p-5 rounded-xl bg-card border border-border text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                FormiqStudio was founded with a simple mission: make world-class technology accessible to businesses of every size. We started as a small team of passionate developers and have grown into a full-service digital agency serving clients across India, USA, and beyond.
              </p>
              <p>
                What sets us apart is our speed and commitment to quality. We believe in shipping fast — our average MVP delivery is just 15 days — without ever compromising on code quality, security, or user experience.
              </p>
              <p>
                Today, we help 25+ companies across industries build, scale, and succeed with custom software, mobile apps, e-commerce platforms, AI automation, and digital marketing strategies.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-4 rounded-xl bg-card border border-border">
                  <Icon className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground text-sm mb-1">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Our Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {expertise.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Ready to Work Together?</h2>
          <p className="text-muted-foreground mb-6">
            Let us help you turn your ideas into reality. Get a free consultation today.
          </p>
          <Link href="/contact">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
