"use client";

import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2, Phone } from "lucide-react";
import Link from 'next/link';
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
    <div className="relative w-full bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-20 pb-12 sm:pt-24 sm:pb-14 md:pt-28 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 items-center">

          {/* Left - Content (3/5) */}
          <div className="lg:col-span-3 text-center lg:text-left space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs sm:text-sm font-semibold text-primary">Serving Kolkata, Durgapur & Asansol</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] tracking-tight text-foreground">
              Get More Customers{' '}
              <span className="text-primary">Without the Confusion</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              We build your website, run your ads, and manage your social media.
              You focus on your business. Starting at just <span className="text-primary font-bold">Rs 6,999/month</span>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0">
              {[
                { stat: "50+", label: "Local Businesses Served" },
                { stat: "3x", label: "Avg. Lead Increase" },
                { stat: "15 Days", label: "Website Delivered" },
              ].map((item, i) => (
                <div key={i} className="text-center lg:text-left p-3 rounded-lg bg-card border border-border">
                  <div className="text-2xl font-bold text-primary">{item.stat}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 max-w-md mx-auto lg:mx-0">
              {[
                "Professional website built and launched in 15 days",
                "Facebook & Instagram ads managed by our team",
                "Social media posts designed and scheduled weekly",
                "Monthly performance report with real numbers",
                "Meet us in person - we're local",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <a href="https://wa.me/918918349445?text=Hi%2C%20I%20want%20to%20know%20about%20the%20Rs%206999%20plan" target="_blank" rel="noopener noreferrer">
                <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#1da851] transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base">
                  WhatsApp Us Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <a href="tel:+918918349445">
                <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 border-2 border-primary/30 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Phone className="w-4 h-4" />
                  Call +91 8918349445
                </button>
              </a>
            </div>
          </div>

          {/* Right - Form (2/5) */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-lg w-full">
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">Get a Free Consultation</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">We'll call you within 2 hours. No spam.</p>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Your Name" required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground text-sm" />
                <input type="tel" name="phone" placeholder="Phone Number" required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground text-sm" />
                <input type="email" name="email" placeholder="Email (optional)"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground text-sm" />
                <select name="subject"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground text-sm">
                  <option value="Growth Plan">I want the Rs 6,999 Growth Plan</option>
                  <option value="Website Only">I need a website</option>
                  <option value="Ads Only">I need ads management</option>
                  <option value="Custom">I need something else</option>
                </select>

                {formError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{formError}</p>
                )}

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 text-sm">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </span>
                  ) : 'Get Free Consultation'}
                </button>
              </form>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                No commitment. Cancel anytime. We can meet in person in Kolkata, Durgapur or Asansol.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {popupMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-5 sm:p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-base font-semibold mb-1.5 text-foreground">Request Received</h3>
            <p className="text-muted-foreground mb-4 text-xs sm:text-sm">{popupMessage}</p>
            <button onClick={() => setPopupMessage(null)}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
