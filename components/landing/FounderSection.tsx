"use client";

import { CheckCircle, ArrowRight, Play } from 'lucide-react';
import { useState } from 'react';

const credentials = [
  "6+ years building engineering solutions",
  "US clients - LuckShack Casino App, Texas",
  "FMCG brand Aatava - e-commerce & ads",
  "CRM, ERP, Shopify, Ad Campaigns",
  "Based locally - meets clients in person",
];

const proofImages = [
  {
    // Replace with real image of you working/meeting client
    src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Client Meeting",
    caption: "Meeting local businesses in person",
  },
  {
    // Replace with screenshot of ad dashboard or client results
    src: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Ad Campaigns",
    caption: "Managing Rs 20L+ in ad spend",
  },
  {
    // Replace with real image of you at work/office
    src: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Global Clients",
    caption: "Built solutions for US & India markets",
  },
];

const FounderSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/10 to-background">
      <div className="max-w-6xl mx-auto px-4">

        {/* Section header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-semibold text-primary">The Person Behind Your Growth</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
            Built by Someone Who's{' '}
            <span className="text-primary">Done the Work</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* Left - Video + Image Grid */}
          <div className="space-y-4">
            {/* Main Video */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-border aspect-video bg-black cursor-pointer group"
              onClick={() => setIsVideoPlaying(true)}
            >
              {!isVideoPlaying ? (
                <>
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Shivay - Founder of FormiqStudio"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-sm sm:text-base">Meet Shivay - Founder, FormiqStudio</p>
                    <p className="text-white/70 text-xs sm:text-sm mt-0.5">Why I built this for local businesses</p>
                  </div>
                </>
              ) : (
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  playsInline
                >
                  {/* Replace with your real video URL */}
                  <source src="https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4" type="video/mp4" />
                </video>
              )}
            </div>

            {/* Proof Image Grid */}
            <div className="grid grid-cols-3 gap-3">
              {proofImages.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-square group cursor-pointer">
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      {img.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[10px] sm:text-xs leading-tight">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-5">
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

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a href="https://wa.me/918918349445?text=Hi%20Shivay%2C%20I%20saw%20your%20video%20and%20want%20to%20discuss%20my%20business" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button className="w-full px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 inline-flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20">
                  Talk to Shivay Directly
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <a href="tel:+918918349445" className="w-full sm:w-auto">
                <button className="w-full px-7 py-3.5 border-2 border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all duration-200 text-sm">
                  +91 8918349445
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
