'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import Magnetic from './studio/Magnetic';
import { getLenis } from '@/lib/studio-motion';
import { GOOGLE_REVIEW_URL, STUDIO_ADDRESS, STUDIO_ADDRESS_LINES } from '@/lib/studio-facts';
import { OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/tracking-config';

const socialLinks = [
  { href: 'https://www.facebook.com/formiqstudio', icon: <FaFacebookF className="w-3.5 h-3.5" />, label: 'Facebook' },
  { href: 'https://www.instagram.com/formiqstudio', icon: <FaInstagram className="w-3.5 h-3.5" />, label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/formiqstudio', icon: <FaLinkedinIn className="w-3.5 h-3.5" />, label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@formiqstudio', icon: <FaYoutube className="w-3.5 h-3.5" />, label: 'YouTube' },
];

const LEGAL_COLUMN_TITLE = 'Legal';

const columns = [
  {
    title: 'Studio',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/web', label: 'Website' },
      { href: '/marketing', label: 'Facebook & Insta ads' },
      { href: '/marketing', label: 'Google Ads & SEO' },
      { href: '/ecommerce-marketplace', label: 'E-commerce' },
      { href: '/shopify', label: 'Shopify' },
      { href: '/agents', label: 'AI agents' },
    ],
  },
  {
    title: LEGAL_COLUMN_TITLE,
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });

/** Local studio time, so visitors know whether a reply is minutes or a morning away. */
const StudioClock = () => {
  const [now, setNow] = useState('');
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(() => { if (!document.hidden) tick(); }, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{STUDIO_ADDRESS.city} {now || '--:--'} IST</span>;
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="tone-ink relative bg-background text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20">
        {/* Statement + direct contact */}
        <div className="grid lg:grid-cols-[1.3fr,1fr] gap-10 lg:gap-16 pb-12 sm:pb-16 border-b border-border">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">(Next step)</p>
            <h2 className="font-display text-[2rem] leading-[1.02] sm:text-5xl lg:text-6xl font-semibold tracking-[-0.045em] text-foreground">
              Have a business? <span className="text-primary">Let&rsquo;s fill it</span> with customers.
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-5">
            <a href="mailto:hello@formiqstudio.in" data-track-source="footer" className="group inline-flex items-center min-h-11 gap-2 text-xl sm:text-2xl font-display font-medium tracking-[-0.03em] text-foreground w-fit">
              <span className="link-draw">hello@formiqstudio.in</span>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a href="tel:+918918349445" data-track-source="footer" className="inline-flex items-center min-h-11 gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
              <span className="link-draw">+91 8918349445</span>
            </a>
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <Magnetic key={s.label} strength={0.45}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors">
                    {s.icon}
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        {/* Link columns + review */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 py-12 sm:py-14">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">{col.title}</h3>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="inline-flex items-center min-h-11 md:min-h-9 text-[15px] text-foreground/80 hover:text-foreground transition-colors">
                      <span className="roll" data-text={link.label}><span>{link.label}</span></span>
                    </Link>
                  </li>
                ))}
                {col.title === LEGAL_COLUMN_TITLE && (
                  <li>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
                      className="inline-flex items-center min-h-11 md:min-h-9 text-[15px] text-foreground/80 hover:text-foreground transition-colors"
                    >
                      <span className="roll" data-text="Cookie settings"><span>Cookie settings</span></span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">Visit</h3>
            <address className="not-italic text-[15px] text-foreground/80 leading-relaxed mb-4">
              {STUDIO_ADDRESS_LINES.map((line) => <span key={line} className="block">{line}</span>)}
            </address>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl border border-border hover:border-foreground/40 transition-colors group"
            >
              <img
                src="/images/google-review-qr.png"
                alt="Scan QR to rate FormiqStudio on Google"
                width={56}
                height={56}
                className="w-14 h-14 rounded-lg bg-white p-1 object-contain flex-shrink-0"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">Rate us on Google →</p>
                <p className="text-[11px] text-muted-foreground">Scan · 30 sec</p>
              </div>
            </a>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-5 border-t border-border font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          <p>&copy; {currentYear} FormiqStudio</p>
          <p className="hidden md:block"><StudioClock /></p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => { const l = getLenis(); if (l) l.scrollTo(0, { duration: 1.6 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-foreground transition-colors min-h-[44px] sm:min-h-0"
            >
              Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
