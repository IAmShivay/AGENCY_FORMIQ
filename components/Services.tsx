"use client";

import Link from "next/link";
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
    href: "/contact",
  },
  {
    icon: Megaphone,
    title: "Facebook & Instagram Ads",
    description: "Targeted ad campaigns that reach the right people in your area. We handle everything from creative to optimization.",
    href: "/contact",
  },
  {
    icon: Palette,
    title: "Social Media Management",
    description: "Consistent, engaging posts designed for your brand. We plan, create, and schedule content every week.",
    href: "/contact",
  },
  {
    icon: BarChart3,
    title: "Google Ads & SEO",
    description: "Show up when customers search for your services. Rank higher on Google and get more calls.",
    href: "/contact",
  },
  {
    icon: MapPin,
    title: "Google My Business",
    description: "Optimize your Google listing so local customers find you first. Reviews, photos, and posts managed.",
    href: "/contact",
  },
  {
    icon: Smartphone,
    title: "E-commerce & Online Store",
    description: "Sell your products online with a fully functional store. Payment integration, inventory, and shipping set up.",
    href: "/contact",
  },
];

const Services = () => {
  return (
    <section className="py-12 md:py-16 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Everything Your Business Needs to Grow Online
          </h2>
          <p className="text-lg text-muted-foreground">
            Stop juggling multiple freelancers. One team, one plan, all your digital marketing handled.
          </p>
        </div>

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

        <div className="text-center mt-8">
          <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20to%20know%20about%20your%20services" target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200">
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
