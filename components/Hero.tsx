"use client";

import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2, Phone } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';

const Hero = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: "Growth Plan Inquiry",
      message: formData.get("message") || "Interested in the Growth Plan",
    };

    try {
      const { error } = await supabase.from('contact_messages').insert([payload]);
      if (error) {
        setFormError('Failed to send. Please try again.');
        setIsSubmitting(false);
        return;
      }
      setPopupMessage("We've received your request. Our team will call you within 2 hours.");
      (e.target as HTMLFormElement).reset();
    } catch {
      setFormError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* Left - Content (3/5) */}
          <div className="lg:col-span-3 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-primary">Serving Kolkata, Durgapur & Asansol</span>
            </div>

            <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-foreground">
              Get More Customers{' '}
              <span className="text-primary relative">
                Without the Confusion
                <svg className="absolute -bottom-1 left-0 w-full hidden sm:block" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30" />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              We build your website, run your ads, and manage your social media.
              You focus on your business. Starting at just{' '}
              <span className="text-foreground font-bold bg-primary/10 px-2 py-0.5 rounded">Rs 6,999/month</span>
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              {[
                { stat: "50+", label: "Local Businesses" },
                { stat: "3x", label: "Avg. Lead Growth" },
                { stat: "15 Days", label: "Website Delivery" },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 sm:p-4 rounded-xl bg-card border border-border shadow-sm">
                  <div className="text-xl sm:text-2xl font-bold text-primary">{item.stat}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 max-w-md mx-auto lg:mx-0">
              {[
                "Professional website built in 15 days",
                "Facebook & Instagram ads managed daily",
                "Social media posts designed weekly",
                "Monthly report with real numbers",
                "Meet us in person - we're local",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle className="w-[18px] h-[18px] text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
              <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20to%20know%20about%20the%20Rs%206999%20plan" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button className="w-full px-7 py-3.5 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1da851] transition-all duration-200 flex items-center justify-center gap-2 text-[15px] shadow-lg shadow-[#25D366]/20">
                  WhatsApp Us Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <a href="tel:+918918349445" className="w-full sm:w-auto">
                <button className="w-full px-7 py-3.5 border-2 border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2 text-[15px]">
                  <Phone className="w-4 h-4" />
                  +91 8918349445
                </button>
              </a>
            </div>
          </div>

          {/* Right - Form (2/5) */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="bg-card rounded-2xl p-6 sm:p-7 border border-border shadow-xl w-full">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-foreground mb-1">Get a Free Consultation</h3>
                <p className="text-muted-foreground text-sm">We'll call you within 2 hours. No spam.</p>
              </div>

              <form className="space-y-3.5" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Your Name" required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all" />
                <input type="tel" name="phone" placeholder="Phone Number" required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all" />
                <input type="email" name="email" placeholder="Email (optional)"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all" />
                <select name="subject"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all">
                  <option value="Growth Plan">I want the Rs 6,999 Growth Plan</option>
                  <option value="Website Only">I need a website</option>
                  <option value="Ads Only">I need ads management</option>
                  <option value="Custom">I need something else</option>
                </select>

                {formError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{formError}</p>
                )}

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 text-sm shadow-lg shadow-primary/20">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </span>
                  ) : 'Get Free Consultation'}
                </button>
              </form>

              <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
                No commitment required. Cancel anytime.
                <br />We can meet in person in Kolkata, Durgapur or Asansol.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {popupMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Request Received</h3>
            <p className="text-muted-foreground mb-5 text-sm">{popupMessage}</p>
            <button onClick={() => setPopupMessage(null)}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
