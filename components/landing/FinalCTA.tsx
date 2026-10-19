"use client";

import { useState } from 'react';
import { ArrowRight, Phone, Sparkles, ShieldCheck, Clock, Users, Star } from 'lucide-react';
import LeadFormOverlay from '@/components/LeadFormOverlay';

const FinalCTA = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <section className="py-10 sm:py-14 md:py-16 bg-[#0B0F1F] relative overflow-hidden">
      {/* Premium gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>
      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold tracking-widest text-white/90 uppercase mb-4 backdrop-blur">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 2 slots left this month
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold mb-3 sm:mb-4 text-white leading-tight tracking-tight">
          Ready to Get More <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">Customers?</span>
        </h2>
        <p className="text-sm sm:text-lg text-white/70 mb-2 max-w-xl mx-auto">
          Join 50+ local businesses already growing with FormiqStudio.
        </p>
        <p className="text-sm sm:text-lg text-white/70 mb-8">
          Starting at just <span className="text-white font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">Rs 6,999/month</span> · Cancel anytime
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md sm:max-w-none mx-auto">
          <button onClick={() => setShowLeadForm(true)} className="w-full sm:w-auto px-8 py-4 bg-white text-[#0B0F1F] rounded-xl font-bold hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap group">
            <Sparkles className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            Get Free Consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a href="https://wa.me/919832078313?text=Hi%2C%20I%20want%20to%20start%20the%20Growth%20Plan" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#1da851] transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap">
              Start on WhatsApp
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-white/60">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> No lock-in</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-white/60" /> Live in 15 days</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-white/60" /> 50+ businesses</span>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9/5</span>
        </div>

        <p className="text-xs text-white/40 mt-4">
          Or <a href="tel:+918918349445" className="text-white/80 hover:text-white font-medium inline-flex items-center gap-1 underline-offset-4 hover:underline"><Phone className="w-3 h-3" /> +91 8918349445</a> · In-person in Kolkata, Durgapur & Asansol · Reply in 2 hours
        </p>
      </div>

      <LeadFormOverlay open={showLeadForm} onClose={() => setShowLeadForm(false)} />
    </section>
  );
};

export default FinalCTA;
