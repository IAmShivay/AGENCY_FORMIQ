"use client";

import { CheckCircle, ArrowRight } from 'lucide-react';

const credentials = [
  "6+ years building engineering solutions",
  "US clients - LuckShack Casino App, Texas",
  "FMCG brand Aatava - e-commerce & ads",
  "CRM, ERP, Shopify, Ad Campaigns",
  "Based locally - meets clients in person",
];

const proofImages = [
  {
    src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Client Meeting",
    caption: "Meeting local businesses in person",
  },
  {
    src: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Ad Campaigns",
    caption: "Managing Rs 20L+ in ad spend",
  },
  {
    src: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Global Clients",
    caption: "Built solutions for US & India markets",
  },
];

const FounderSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/10 to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* Left - Image Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {proofImages.map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer">
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[9px] sm:text-[11px] font-bold text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {img.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-[10px] sm:text-xs leading-tight">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-semibold text-primary">The Person Behind Your Growth</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Built by Someone Who's{' '}
              <span className="text-primary">Done the Work</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              I'm Shivay. I've spent 6+ years building software and marketing systems
              for businesses across the world - from a casino app in Texas to one of
              India's biggest FMCG brands.
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              I started FormiqStudio because I saw local businesses getting ripped off.
              Agencies charging Rs 25,000+ for work that a skilled team can deliver at a
              fraction of the cost. So I built that team.
            </p>

            <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Experience</p>
              {credentials.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle className="w-[18px] h-[18px] text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <blockquote className="border-l-4 border-primary pl-4 py-2">
              <p className="text-sm text-foreground italic leading-relaxed">
                "I can come to your shop in Durgapur, sit with you over chai, and figure out
                exactly what your business needs. No other agency does that."
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">- Shivay, Founder</p>
            </blockquote>

            <a href="https://wa.me/919832078313?text=Hi%20Shivay%2C%20I%20want%20to%20discuss%20my%20business" target="_blank" rel="noopener noreferrer">
              <button className="px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 inline-flex items-center gap-2 text-sm shadow-lg shadow-primary/20 mt-1">
                Talk to Shivay Directly
                <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
