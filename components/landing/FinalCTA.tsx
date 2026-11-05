"use client";

import { useState } from 'react';
import { ArrowRight, ShieldCheck, Clock, Users, Star, Phone } from 'lucide-react';
import LeadFormOverlay from '@/components/LeadFormOverlay';
import Marquee from '@/components/studio/Marquee';
import Magnetic from '@/components/studio/Magnetic';

const FinalCTA = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <section className="relative bg-neutral-950 text-white overflow-hidden" data-no-reveal>
      {/* Kinetic band: speeds up and leans with your scroll */}
      <div className="border-b border-white/10 py-5 sm:py-7">
        <Marquee speed={32}>
          {['More calls', 'More walk-ins', 'More WhatsApp enquiries', 'More bookings'].map((t) => (
            <span key={t} className="flex items-center font-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.045em] leading-[1.1] pb-[0.08em]">
              {t}
              <span className="mx-6 sm:mx-10 inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white/50" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-[1.3fr,1fr] gap-10 lg:gap-16 items-end">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> 2 slots left this month
            </p>
            <h2 className="font-display text-[2.4rem] leading-[1] sm:text-6xl lg:text-7xl font-semibold tracking-[-0.05em]">
              Ready to get more <span className="[-webkit-text-stroke:1.5px_white] text-transparent">customers?</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/65 max-w-xl">
              Join 50+ local businesses already growing with FormiqStudio. Starting at just{' '}
              <span className="text-white font-semibold underline decoration-1 underline-offset-4">Rs 6,999/month</span> · Cancel anytime.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
              <Magnetic>
                <button onClick={() => setShowLeadForm(true)} className="btn-ink h-14 px-8 bg-white text-neutral-950 rounded-full font-semibold flex items-center justify-center gap-2 text-[15px] whitespace-nowrap [--background:0_0%_100%] [--foreground:0_0%_4%] group">
                  Get free consultation
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </Magnetic>
              <Magnetic>
                <a href="https://wa.me/919832078313?text=Hi%2C%20I%20want%20to%20start%20the%20Growth%20Plan" target="_blank" rel="noopener noreferrer" data-track-source="final-cta" className="h-14 px-8 border border-white/25 text-white rounded-full font-semibold flex items-center justify-center gap-2 text-[15px] whitespace-nowrap hover:bg-white hover:text-neutral-950 transition-colors">
                  Start on WhatsApp
                </a>
              </Magnetic>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-white/60">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> No lock-in</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Live in 15 days</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> 50+ businesses</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4 fill-current" /> 4.9/5</span>
            </div>
            <p className="text-xs text-white/45">
              Or <a href="tel:+918918349445" data-track-source="final-cta" className="text-white/85 hover:text-white font-medium inline-flex items-center gap-1"><Phone className="w-3 h-3" /> +91 8918349445</a> · In-person in Kolkata, Durgapur & Asansol · Reply in 2 hours
            </p>
          </div>
        </div>
      </div>

      <LeadFormOverlay open={showLeadForm} onClose={() => setShowLeadForm(false)} />
    </section>
  );
};

export default FinalCTA;
