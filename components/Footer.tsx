'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Star } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import Logo from './Logo';

const socialLinks = [
  { href: 'https://www.facebook.com/formiqstudio', icon: <FaFacebookF className="w-3.5 h-3.5" />, label: 'Facebook', color: 'text-[#1877F2]', bg: 'bg-[#1877F2]/10 hover:bg-[#1877F2]/20' },
  { href: 'https://www.instagram.com/formiqstudio', icon: <FaInstagram className="w-3.5 h-3.5" />, label: 'Instagram', color: 'text-[#E1306C]', bg: 'bg-[#E1306C]/10 hover:bg-[#E1306C]/20' },
  { href: 'https://www.linkedin.com/company/formiqstudio', icon: <FaLinkedinIn className="w-3.5 h-3.5" />, label: 'LinkedIn', color: 'text-[#0A66C2]', bg: 'bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20' },
  { href: 'https://www.youtube.com/@formiqstudio', icon: <FaYoutube className="w-3.5 h-3.5" />, label: 'YouTube', color: 'text-[#FF0000]', bg: 'bg-[#FF0000]/10 hover:bg-[#FF0000]/20' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">

        {/* Mobile: compact single column */}
        <div className="sm:hidden space-y-5 mb-5">
          <div className="flex items-center justify-between">
            <Logo size={100} />
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center transition-colors`}>
                  <span className={s.color}>{s.icon}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 text-primary" />
            Arrah Shree Pally, Arrah Shree Pally, Durgapur, WB 713212 713212
          </div>
          {/* Mobile Google Review QR */}
          <a
            href="https://g.page/r/CdyKwEPD_8rDEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-card border border-amber-200/60"
          >
            <img
              src="/images/google-review-qr.png"
              alt="Scan QR to rate FormiqStudio on Google"
              width={56}
              height={56}
              className="w-14 h-14 rounded-lg bg-white p-1 border border-border shadow-sm object-contain flex-shrink-0"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground flex items-center gap-1">
                Rate us on Google <span className="text-[#4285F4]">→</span>
              </p>
              <p className="text-[11px] text-muted-foreground">Scan with Camera · 30 sec · 5★</p>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                ))}
                <span className="text-[10px] font-semibold text-amber-700 ml-1">4.9/5 · 50+ reviews</span>
              </div>
            </div>
          </a>
        </div>

        {/* Desktop: 4 columns */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Logo size={120} />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              We help local businesses grow online with websites, ads, and social media management.
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center transition-colors`}>
                  <span className={s.color}>{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "About Us" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Services</h3>
            <ul className="space-y-2.5">
              {["Website", "Facebook & Insta Ads", "Social Media", "Google Ads & SEO", "Google Business", "E-commerce"].map((s) => (
                <li key={s}>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Contact</h3>
            <div className="space-y-3">
              <a href="mailto:hello@formiqstudio.in" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                hello@formiqstudio.in
              </a>
              <a href="tel:+918918349445" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                +91 8918349445
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                Arrah Shree Pally, Durgapur, WB 713212
              </div>
            </div>
            {/* Google Review QR - Footer */}
            <a
              href="https://g.page/r/CdyKwEPD_8rDEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-card border border-amber-200/60 hover:border-amber-300 hover:shadow-md transition-all group"
            >
              <div className="relative flex-shrink-0">
                <img
                  src="/images/google-review-qr.png"
                  alt="Scan QR to rate FormiqStudio on Google"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg bg-white p-1 border border-border shadow-sm object-contain"
                  loading="lazy"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#4285F4] rounded-full flex items-center justify-center border-2 border-white">
                  <Star className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  Rate us on Google
                  <span className="text-[#4285F4]">→</span>
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">Scan to leave a 5★ review</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                  ))}
                  <span className="text-[10px] font-semibold text-amber-700 ml-1">4.9/5</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} <span className="font-medium text-foreground">FormiqStudio</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <a href="/llms.txt" className="hover:text-primary transition-colors" title="AI crawlers: llms.txt for ChatGPT, Perplexity, Claude">llms.txt</a>
            <span className="text-border">•</span>
            <a href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</a>
            <span className="text-border">•</span>
            <a href="/robots.txt" className="hover:text-primary transition-colors">Robots</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
