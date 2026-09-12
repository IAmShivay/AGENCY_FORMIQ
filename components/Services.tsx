"use client";

import {
  Globe,
  Megaphone,
  Palette,
  BarChart3,
  MapPin,
  Smartphone,
  ArrowRight,
} from "lucide-react";

const services = [
  { icon: Globe, title: "Website", description: "Fast, professional websites that convert visitors into customers." },
  { icon: Megaphone, title: "Facebook & Insta Ads", description: "Targeted campaigns. We handle creative, targeting & optimization." },
  { icon: Palette, title: "Social Media", description: "Posts designed and scheduled weekly. Consistent brand presence." },
  { icon: BarChart3, title: "Google Ads & SEO", description: "Rank higher. Show up when customers search for you." },
  { icon: MapPin, title: "Google Business", description: "Local listing optimized so customers find you first." },
  { icon: Smartphone, title: "E-commerce", description: "Online store with payments, inventory & shipping." },
];

const Services = () => {
  return (
    <section className="py-10 sm:py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-10 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1.5 sm:mb-3 text-foreground">
            Everything You Need to Grow Online
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            One team. One plan. All your digital marketing handled.
          </p>
        </div>

        {/* Mobile: compact 2-col grid */}
        <div className="grid grid-cols-2 sm:hidden gap-2.5">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="p-3.5 rounded-xl bg-card border border-border">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2.5">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{service.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        {/* Desktop: 3-col */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6 sm:mt-10">
          <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20to%20know%20about%20your%20services" target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all text-sm sm:text-base shadow-lg shadow-primary/20">
              Get a Free Quote
              <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
