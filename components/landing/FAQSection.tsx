"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "I don't know anything about ads or marketing. Can you still help?",
    a: "Absolutely. That's exactly who we work with. You focus on running your business. We handle everything - from building your website to creating ads to managing your social media. No technical knowledge needed.",
  },
  {
    q: "What's included in the Rs 6,999/month Growth Plan?",
    a: "Everything you need to grow online: a professional website (built and maintained), Facebook & Instagram ad campaigns, social media management (12 posts/month), Google My Business optimization, a dedicated account manager, and monthly performance reports with real numbers.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-in. If you're not happy, you can cancel at the end of any month. We believe in earning your business every month, not trapping you in a contract.",
  },
  {
    q: "How is this different from hiring a freelancer?",
    a: "A freelancer usually does one thing - maybe design, maybe ads. We provide a complete team: designer, ad specialist, content writer, and account manager. Plus we're local - we can meet you in person in Kolkata, Durgapur, or Asansol.",
  },
  {
    q: "How quickly will I see results?",
    a: "Your website will be live in 15 days. Ad campaigns typically start showing results within the first week. Most of our clients see a noticeable increase in enquiries within the first month.",
  },
  {
    q: "Do you work with businesses outside Kolkata/Durgapur/Asansol?",
    a: "Yes, we work with businesses across India remotely. But for businesses in Kolkata, Durgapur, and Asansol, we offer in-person meetings and local support - which is why our local clients love working with us.",
  },
  {
    q: "How much should I spend on ads separately?",
    a: "We recommend starting with Rs 5,000-10,000/month on ad spend (paid directly to Facebook/Google). This is separate from our service fee. We'll help you decide the right budget based on your business and goals.",
  },
  {
    q: "What if I just need a website, not the full plan?",
    a: "We offer a one-time website package starting at Rs 14,999. It includes a professional 5-page website, mobile responsive design, contact form, WhatsApp integration, and 1 year of free hosting.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-10 sm:py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1.5 sm:mb-3 text-foreground">
            Common Questions
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            Everything you need to know before getting started
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                  open === i ? 'rotate-180' : ''
                }`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
