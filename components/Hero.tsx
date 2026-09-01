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
                <div className="flex gap-3 justify-center text-xs items-center">
                  <a href="tel:+918918349445" className="text-primary font-medium">+91 8918349445</a>
                  <span className="text-muted-foreground">|</span>
                  <a href="https://wa.me/15553419743" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    +1 555-341-9743
                  </a>
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
