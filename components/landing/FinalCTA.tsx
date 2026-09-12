"use client";

import { ArrowRight, Phone } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Ready to Get More Customers?
        </h2>
        <p className="text-lg text-muted-foreground mb-2">
          Join 50+ local businesses already growing with FormiqStudio.
        </p>
        <p className="text-lg text-muted-foreground mb-8">
          Starting at just <span className="text-primary font-bold">Rs 6,999/month</span>. Cancel anytime.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20to%20start%20the%20Growth%20Plan" target="_blank" rel="noopener noreferrer">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#1da851] transition-colors duration-200 flex items-center justify-center gap-2 text-base">
              Start on WhatsApp
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
          <a href="tel:+918918349445">
            <button className="w-full sm:w-auto px-8 py-4 border-2 border-primary/30 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors duration-200 flex items-center justify-center gap-2 text-base">
              <Phone className="w-5 h-5" />
              Call Us Now
            </button>
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Available for in-person meetings in Kolkata, Durgapur & Asansol
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
