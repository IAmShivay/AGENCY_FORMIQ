"use client";

import { ArrowUpRight } from 'lucide-react';
import EnquiryForm from '@/components/forms/EnquiryForm';
import { BOOKING_URL } from '@/lib/pricing';
import { ENQUIRY_EMAIL } from '@/lib/enquiry-options';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const EYEBROW = 'font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground';

/** Enquiry section used at the foot of the service pages (anchor: #contact-form). */
const ContactForm = () => (
  <section id="contact-form" aria-labelledby="contact-form-title" className="bg-background text-foreground py-20 sm:py-28 lg:py-32 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className={`${EYEBROW} mb-5`}>(Start a project)</p>
        <h2 id="contact-form-title" className="font-display text-4xl sm:text-5xl font-bold leading-[0.98] tracking-[-0.04em]">
          Tell us about your project.
        </h2>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
          We reply within one working day, then a 30-minute call to scope it and a fixed quote with timeline.
        </p>
        <div className="mt-8 space-y-2 text-base">
          <a href={`mailto:${ENQUIRY_EMAIL}`} className={`inline-flex min-h-11 items-center rounded-sm ${FOCUS_RING}`}>
            <span className="link-draw">{ENQUIRY_EMAIL}</span>
          </a>
          <p className="text-muted-foreground">
            Prefer to talk?{' '}
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center gap-1 text-foreground font-semibold rounded-sm ${FOCUS_RING}`}>
              <span className="link-draw">Book a call</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
      <div className="lg:col-span-7 lg:col-start-6">
        <EnquiryForm idPrefix="service-enquiry" source="Service page" />
      </div>
    </div>
  </section>
);

export default ContactForm;
