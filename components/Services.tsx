"use client";

import { ArrowRight, Sparkles, Check } from "lucide-react";
import { FaFacebookF, FaInstagram, FaGoogle, FaShopify } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { HiGlobeAlt } from "react-icons/hi";
import { ReactNode } from "react";

interface Service {
  icon: ReactNode;
  title: string;
  desc: string;
}

const services: Service[] = [
  { icon: <HiGlobeAlt className="w-4 h-4 text-blue-600" />, title: "Website", desc: "Premium site that converts" },
  { icon: <FaFacebookF className="w-3.5 h-3.5 text-[#1877F2]" />, title: "Meta Ads", desc: "Creatives + targeting + optimisation" },
  { icon: <FaInstagram className="w-4 h-4 text-[#E1306C]" />, title: "Social Media", desc: "12 posts/mo · Reels & stories" },
  { icon: <FaGoogle className="w-3.5 h-3.5 text-[#4285F4]" />, title: "Google Ads & SEO", desc: "Top 3 on Google" },
  { icon: <SiGooglemaps className="w-4 h-4 text-emerald-600" />, title: "Google Business", desc: "#1 in Maps" },
  { icon: <FaShopify className="w-3.5 h-3.5 text-[#96BF48]" />, title: "E-commerce", desc: "Store ready to sell" },
];

const Services = () => {
  return (
    <section className="py-6 sm:py-8 bg-background relative overflow-hidden border-y border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal header - single line */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/15 text-[11px] font-semibold tracking-widest text-primary uppercase">
              <Sparkles className="w-3 h-3" /> Services
            </span>
            <h2 className="text-base sm:text-xl font-bold text-foreground tracking-tight">
              Everything you need to grow <span className="text-primary">— all included</span>
            </h2>
          </div>
          <a href="/services" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Explore all <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* Minimal compact grid - low height */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {services.map((s, i) => (
            <div
              key={i}
              className="group flex items-center gap-3 p-3 sm:p-3.5 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-sm transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/15 transition-colors">
                {s.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-[13px] font-bold text-foreground leading-none truncate">{s.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-tight truncate mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal bottom line - single row */}
        <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-xs font-medium text-foreground text-center sm:text-left">
            All 6 included in <span className="font-bold">Rs 6,999/mo</span> <span className="text-muted-foreground">· No extra hires</span>
          </p>
          <a href="https://wa.me/919832078313?text=Hi%2C%20I%20want%20to%20know%20about%20your%20services" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
              Get Free Quote <ArrowRight className="w-3 h-3" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
