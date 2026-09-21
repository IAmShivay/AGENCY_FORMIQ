"use client";

import { ArrowRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaGoogle, FaShopify, FaHashtag } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { HiGlobeAlt } from "react-icons/hi";
import { ReactNode } from "react";

interface Service {
  icon: ReactNode;
  title: string;
  description: string;
}

const services: Service[] = [
  { icon: <HiGlobeAlt className="w-6 h-6 text-blue-600" />, title: "Website", description: "Fast, professional websites that convert visitors into customers." },
  { icon: <FaFacebookF className="w-6 h-6 text-[#1877F2]" />, title: "Facebook & Insta Ads", description: "Targeted campaigns. We handle creative, targeting & optimization." },
  { icon: <FaInstagram className="w-6 h-6 text-[#E1306C]" />, title: "Social Media", description: "Posts designed and scheduled weekly. Consistent brand presence." },
  { icon: <FaGoogle className="w-6 h-6 text-[#4285F4]" />, title: "Google Ads & SEO", description: "Rank higher. Show up when customers search for you." },
  { icon: <SiGooglemaps className="w-6 h-6 text-[#4285F4]" />, title: "Google Business", description: "Local listing optimized so customers find you first." },
  { icon: <FaShopify className="w-5 h-5 sm:w-6 sm:h-6 text-[#96BF48]" />, title: "E-commerce", description: "Online store with payments, inventory & shipping." },
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
          {services.map((service, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-card border border-border">
              <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center mb-2.5">
                {service.icon}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{service.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Desktop: 3-col */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 sm:mt-10">
          <a href="https://wa.me/919832078313?text=Hi%2C%20I%20want%20to%20know%20about%20your%20services" target="_blank" rel="noopener noreferrer">
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
