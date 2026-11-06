"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/studio/PageHeader";
import Magnetic from "@/components/studio/Magnetic";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { BTN_PRIMARY, CONTAINER, EYEBROW, FOCUS_RING, pad2 } from "@/components/studio/ui";
import { ENQUIRY_EMAIL } from "@/lib/enquiry-options";
import { STUDIO_ADDRESS_LINE } from "@/lib/studio-facts";
import { openLeadSheet } from '@/lib/lead-sheet';

const CONTACT_PHONE_DISPLAY = "+91 8918349445";
const CONTACT_PHONE_HREF = "tel:+918918349445";
const WHATSAPP_DISPLAY = "+91 9832078313";
const WHATSAPP_HREF = "https://wa.me/919832078313";
const OFFICE_ADDRESS = STUDIO_ADDRESS_LINE;

const channels = [
  { label: "Email", value: ENQUIRY_EMAIL, href: `mailto:${ENQUIRY_EMAIL}`, external: false },
  { label: "Phone", value: CONTACT_PHONE_DISPLAY, href: CONTACT_PHONE_HREF, external: false },
  { label: "WhatsApp", value: WHATSAPP_DISPLAY, href: WHATSAPP_HREF, external: true },
];

const Contact = () => (
  <div className="bg-background text-foreground">
    <PageHeader
      eyebrow="(01) Contact"
      title={<>Tell us about your <span className="text-primary">project</span>.</>}
      intro="Have a project in mind? Let's discuss how we can help bring your ideas to life."
    />

    <section className="pb-20 sm:pb-28 lg:pb-32">
      <div className={`${CONTAINER} grid gap-14 lg:grid-cols-12`}>
        {/* Form */}
        <div className="lg:col-span-7">
          <p className={`${EYEBROW} mb-6`}>(02) Send an enquiry</p>
          <EnquiryForm idPrefix="contact" source="Contact page" />
        </div>

        {/* Contact info */}
        <div className="lg:col-span-4 lg:col-start-9">
          <p className={`${EYEBROW} mb-6`}>(03) Reach us directly</p>
          <ul className="border-t border-border">
            {channels.map((c, i) => (
              <li key={c.label} className="border-b border-border">
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-3 py-5 rounded-sm ${FOCUS_RING}`}
                >
                  <span className={EYEBROW}>{pad2(i + 1)}</span>
                  <span className="min-w-0">
                    <span className={`block ${EYEBROW}`}>{c.label}</span>
                    <span className="block mt-1 text-lg font-semibold break-words"><span className="link-draw">{c.value}</span></span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                </a>
              </li>
            ))}
            <li className="border-b border-border grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-5">
              <span className={`${EYEBROW} pt-0.5`}>{pad2(channels.length + 1)}</span>
              <span>
                <span className={`block ${EYEBROW}`}>Address</span>
                <span className="block mt-1 text-base">{OFFICE_ADDRESS}</span>
              </span>
            </li>
          </ul>

          <div className="mt-10 rounded-[22px] tone-ember p-6 sm:p-8">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">Prefer to talk?</h2>
            <p className="mt-3 text-foreground/80">
              Book a free 30-minute call. We&apos;ll discuss your goals and create a plan.
            </p>
            <div className="mt-6">
              <Magnetic>
                <button type="button" onClick={openLeadSheet} className={BTN_PRIMARY}>
                  Book a call
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden="true" />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Contact;
