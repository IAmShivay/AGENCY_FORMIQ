"use client";

import { useState } from 'react';
import { ArrowRight, Phone, Sparkles } from 'lucide-react';
import LeadFormOverlay from '@/components/LeadFormOverlay';

const FinalCTA = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);

  return (
    <section className="py-12 sm:py-20 md:py-24 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-foreground leading-tight">
          Ready to Get More Customers?
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-3">
          Join 50+ local businesses already growing with FormiqStudio.
        </p>
        <p className="text-base sm:text-lg text-muted-foreground mb-8">
          Starting at just <span className="text-foreground font-bold bg-primary/15 px-2 py-0.5 rounded">Rs 6,999/month</span>. Cancel anytime.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => setShowLeadForm(true)} className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5" />
            Get Free Consultation
          </button>
          <a href="https://wa.me/919832078313?text=Hi%2C%20I%20want%20to%20start%20the%20Growth%20Plan" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1da851] transition-all duration-200 flex items-center justify-center gap-2 text-base shadow-lg shadow-[#25D366]/20">
              Start on WhatsApp
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
          <a href="tel:+918918349445" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 border-2 border-border bg-card text-foreground rounded-xl font-semibold hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2 text-base">
              <Phone className="w-5 h-5" />
              Call Us Now
            </button>
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Available for in-person meetings in Kolkata, Durgapur & Asansol
        </p>
      </div>

      <LeadFormOverlay open={showLeadForm} onClose={() => setShowLeadForm(false)} />
    </section>
  );
};

export default FinalCTA;
