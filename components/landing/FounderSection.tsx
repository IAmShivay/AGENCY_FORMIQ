"use client";

import { CheckCircle, ArrowRight } from 'lucide-react';

const credentials = [
  "6+ years building engineering solutions",
  "Worked with US clients - LuckShack Casino App (Texas)",
  "Built systems for FMCG brand Aatava",
  "CRM, ERP, E-commerce, Ad Campaigns",
  "Based locally - Kolkata, Durgapur, Asansol",
];

const FounderSection = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* Video */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border aspect-video bg-black">
              {/* Replace this video src with your recorded founder video */}
              <video
                className="w-full h-full object-cover"
                poster="https://images.pexels.com/videos/3129671/free-video-3129671.jpg?auto=compress&cs=tinysrgb&w=800"
                controls
                playsInline
                preload="metadata"
              >
                <source src="https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4" type="video/mp4" />
              </video>
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                Meet the Founder
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs font-semibold text-primary">Who's Behind FormiqStudio</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Built by Someone Who's{' '}
              <span className="text-primary">Done the Work</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              I'm Shivay. I've spent 6+ years building software and marketing systems
              for businesses across the world - from a casino app in Texas to
              India's biggest FMCG brands. I've built CRMs, ERPs, e-commerce platforms,
              and run ad campaigns that actually bring results.
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              I started FormiqStudio because I saw local businesses in Kolkata, Durgapur, and
              Asansol getting ripped off by agencies charging Rs 25,000+ for work a good team
              can do for a fraction. So I built that team.
            </p>

            <div className="space-y-2.5 pt-1">
              {credentials.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle className="w-[18px] h-[18px] text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a href="https://wa.me/918918349445?text=Hi%20Shivay%2C%20I%20saw%20your%20video%20and%20want%20to%20discuss%20my%20business" target="_blank" rel="noopener noreferrer">
                <button className="px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 inline-flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
                  Talk to Shivay Directly
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
