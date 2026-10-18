'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 sm:pb-8">

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
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 text-primary" />
            Arrah Shree Pally, Arrah Shree Pally, Durgapur, WB 713212 713212
          </div>
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
          </div>
        </div>

        <div className="border-t border-border pt-4 sm:pt-6">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} <span className="font-medium text-foreground">FormiqStudio</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
