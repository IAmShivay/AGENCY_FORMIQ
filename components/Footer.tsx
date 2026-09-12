'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

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
              <a href="tel:+918918349445" className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-primary" />
              </a>
              <a href="mailto:hello@formiqstudio.in" className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-3.5 h-3.5 text-primary" />
              </a>
              <a href="https://wa.me/918918349445" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-[#25D366]/10 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
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
            Durgapur, West Bengal, India
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
            <div className="flex items-center gap-3">
              <a href="mailto:hello@formiqstudio.in" aria-label="Email"
                className="w-9 h-9 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4 text-primary" />
              </a>
              <a href="https://wa.me/918918349445" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-9 h-9 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
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
                Durgapur, West Bengal
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
