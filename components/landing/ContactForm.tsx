"use client";

import { useState } from 'react';
import { Send, CheckCircle, Loader2, Phone } from 'lucide-react';
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
      <section id="contact-form" className="py-12 sm:py-20 bg-muted/20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Message Sent!</h3>
            <p className="text-sm text-muted-foreground mb-4">Our team will call you within 2 hours.</p>
            <a href="https://wa.me/15553419743" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#25D366] font-medium hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Or chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-form" className="py-12 sm:py-20 bg-muted/20">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-bold mb-2 text-foreground">
            Get Your Free Consultation
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            Tell us about your business. We&apos;ll call within 2 hours.
          </p>
        </div>

        <div className="bg-card rounded-2xl p-5 sm:p-8 border border-border shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Name *</label>
                <input type="text" name="name" placeholder="Your Name" required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Phone *</label>
                <input type="tel" name="phone" placeholder="+91 98765 43210" required
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Email</label>
              <input type="email" name="email" placeholder="your@email.com (optional)"
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">What do you need?</label>
              <select name="subject"
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none">
                <option value="Growth Plan">I want the Rs 6,999 Growth Plan</option>
                <option value="Website">I need a website</option>
                <option value="Ads">I need ads management</option>
                <option value="Mobile App">I need a mobile app</option>
                <option value="E-commerce">I need an e-commerce store</option>
                <option value="Other">Something else</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Message</label>
              <textarea name="message" placeholder="Tell us about your project... (optional)" rows={3}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none resize-none" />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>
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

          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
            <a href="tel:+918918349445" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +91 8918349445
            </a>
            <span className="text-muted-foreground/40">|</span>
            <a href="https://wa.me/15553419743" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#25D366] hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>

          <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-3">
            No spam. No commitment. We can meet in person in Kolkata, Durgapur or Asansol.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
