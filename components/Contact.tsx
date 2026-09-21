"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Loader2, CheckCircle, Send, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { trackLead } from "@/lib/meta-pixel";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email") || "",
      phone: formData.get("phone"),
      subject: formData.get("subject") || "Website Inquiry",
      message: formData.get("message") || "",
    };

    try {
      const { error: supabaseError } = await supabase
        .from('contact_messages')
        .insert([payload]);

      if (supabaseError) {
        setFormError('Failed to send. Please try WhatsApp instead.');
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

      // WhatsApp notification
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
      setFormError("Something went wrong. Please try WhatsApp instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-28 md:pt-36 lg:pt-44 pb-20 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="premium-text-gradient">Get in Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s discuss how we can help bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-lg">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Message Sent!</h3>
                <p className="text-muted-foreground">Our team will call you within 2 hours.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground">Name</label>
                    <input name="name" placeholder="Your name" required
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground">Phone</label>
                    <input name="phone" type="tel" placeholder="+91 98320 78313" required
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Email</label>
                  <input name="email" type="email" placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">What do you need?</label>
                  <select name="subject"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none">
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
                  <textarea name="message" placeholder="Tell us about your project..." rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm transition-all outline-none resize-none" />
                </div>

                {formError && (
                  <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{formError}</p>
                )}

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>

                <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                  No spam. No commitment. We&apos;ll respond within 2 hours.
                </p>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-4">
                <a href="mailto:hello@formiqstudio.in" className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Email</p>
                    <p className="text-muted-foreground text-sm">hello@formiqstudio.in</p>
                  </div>
                </a>
                <a href="tel:+918918349445" className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Phone</p>
                    <p className="text-muted-foreground text-sm">+91 8918349445</p>
                  </div>
                </a>
                <a href="https://wa.me/15553419743" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-[#25D366]/30 transition-all">
                  <div className="w-11 h-11 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">WhatsApp</p>
                    <p className="text-muted-foreground text-sm">+1 555-341-9743</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Address</p>
                    <p className="text-muted-foreground text-sm">Arrah Shree Pally, Durgapur, West Bengal 713212</p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://meet.brevo.com/mr-shivay"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5" />
                <h4 className="text-lg font-semibold">Schedule a Call</h4>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                Book a free 30-min consultation. We&apos;ll discuss your goals and create a plan.
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
