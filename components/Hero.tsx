"use client";

import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2, Sparkles } from "lucide-react";
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
      subject: formData.get("subject") || "Project Inquiry",
      message: formData.get("message") || "New project inquiry from hero section",
    };

    try {
      const { error } = await supabase.from('contact_messages').insert([payload]);
      if (error) {
        setFormError('Failed to send. Please try again.');
        setIsSubmitting(false);
        return;
      }
      setPopupMessage("Message sent successfully! Our team will contact you shortly.");
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
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs sm:text-sm font-semibold text-primary">Your Trusted Technology Partner</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] tracking-tight text-foreground">
              We Build Digital Products{' '}
              <span className="text-primary">That Drive Growth</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              From websites and mobile apps to AI automation and e-commerce — we help businesses launch faster, scale smarter, and grow revenue.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto lg:mx-0">
              {[
                { icon: "⚡", text: "Fast Delivery" },
                { icon: "🎨", text: "Great Design" },
                { icon: "🚀", text: "Scalable" },
                { icon: "</>", text: "Clean Code" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-center lg:justify-start gap-1.5 p-2 sm:p-2.5 rounded-lg bg-card border border-border text-xs sm:text-sm text-foreground">
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/contact">
                <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base">
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/portfolio">
                <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 border-2 border-primary/30 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors duration-200 text-sm sm:text-base">
                  View Portfolio
                </button>
              </Link>
            </div>

            {/* Trust bar */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> 25+ Clients</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> 15-Day MVP</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> 98% Satisfaction</span>
            </div>
          </div>

          {/* Right - Form (2/5) */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-lg w-full">
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">Get a Free Quote</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">MVP in 15 days. Tell us what you need.</p>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Your Name" required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground text-sm" />
                <input type="email" name="email" placeholder="Email Address" required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="tel" name="phone" placeholder="Phone"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground text-sm" />
                  <select name="subject"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground text-sm">
                    <option value="">Project Type</option>
                    <option value="Web Application">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Custom Solution">Other</option>
                  </select>
                </div>
                <textarea name="message" placeholder="Tell us about your project..." rows={3}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground text-sm resize-none" />

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

              <div className="mt-3 pt-3 border-t border-border text-center">
                <div className="flex gap-3 justify-center text-xs">
                  <a href="tel:+918918349445" className="text-primary font-medium">+91 8918349445</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="tel:+12245238210" className="text-primary font-medium">+1 224-523-8210</a>
                </div>
              </div>
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
            <h3 className="text-base font-semibold mb-1.5 text-foreground">Message Sent!</h3>
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
