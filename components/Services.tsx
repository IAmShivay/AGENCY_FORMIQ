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
  {
    icon: Globe,
    title: "Website Design & Development",
    description: "Professional, fast-loading websites that look great on every device. Built to convert visitors into customers.",
  },
  {
    icon: Megaphone,
    title: "Facebook & Instagram Ads",
    description: "Targeted ad campaigns that reach the right people in your area. We handle creative, targeting, and daily optimization.",
  },
  {
    icon: Palette,
    title: "Social Media Management",
    description: "Consistent, engaging posts designed for your brand. We plan, create, and schedule content every week.",
  },
  {
    icon: BarChart3,
    title: "Google Ads & SEO",
    description: "Show up when customers search for your services. Rank higher on Google and get more calls.",
  },
  {
    icon: MapPin,
    title: "Google My Business",
    description: "Optimize your Google listing so local customers find you first. Reviews, photos, and posts managed.",
  },
  {
    icon: Smartphone,
    title: "E-commerce & Online Store",
    description: "Sell your products online with a fully functional store. Payment integration, inventory, and shipping set up.",
  },
];

const Services = () => {
  return (
    <section className="py-16 md:py-20 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Everything Your Business Needs to Grow Online
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Stop juggling multiple freelancers. One team, one plan, all your digital marketing handled.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="group h-full p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20to%20know%20about%20your%20services" target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20">
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
