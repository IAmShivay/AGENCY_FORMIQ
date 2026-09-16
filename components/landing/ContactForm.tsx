"use client";

import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { trackLead } from '@/lib/meta-pixel';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email") || "",
      subject: form.get("subject") || "Website Inquiry",
      message: form.get("message") || "",
    };

    try {
      const { error: dbError } = await supabase.from('contact_messages').insert([payload]);
      if (dbError) {
        setError('Failed to send. Please try WhatsApp instead.');
        setIsSubmitting(false);
        return;
      }
      setIsSubmitted(true);
      trackLead({ content_name: payload.subject as string });
      // Meta CAPI
      fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Lead',
          phone: payload.phone,
          email: payload.email,
          sourceUrl: window.location.href,
          customData: { content_name: payload.subject },
        }),
      }).catch(() => {});
      // AiSensy WhatsApp
      fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: payload.phone,
          name: payload.name,
          service: payload.subject,
        }),
      }).catch(() => {});
      (e.target as HTMLFormElement).reset();
    } catch {
      setError('Something went wrong. Please try WhatsApp instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact-form" className="py-10 sm:py-16 bg-muted/20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Message Sent</h3>
            <p className="text-sm text-muted-foreground">Our team will call you within 2 hours.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-form" className="py-10 sm:py-16 bg-muted/20">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-bold mb-1.5 sm:mb-3 text-foreground">
            Get Your Free Consultation
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            Tell us about your business. We'll call within 2 hours.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 sm:p-7 border border-border shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="name" placeholder="Your Name" required
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all" />
              <input type="tel" name="phone" placeholder="Phone" required
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all" />
            </div>

            <input type="email" name="email" placeholder="Email (optional)"
              className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all" />

            <select name="subject"
              className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all">
              <option value="Growth Plan">I want the Rs 6,999 Growth Plan</option>
              <option value="Website">I need a website</option>
              <option value="Ads">I need ads management</option>
              <option value="Other">Something else</option>
            </select>

            <textarea name="message" placeholder="Anything else? (optional)" rows={2}
              className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all resize-none" />

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 sm:py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-4 h-4" /> Send Request</>
              )}
            </button>
          </form>

          <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-3">
            No spam. No commitment. We can meet in person in Kolkata, Durgapur or Asansol.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
