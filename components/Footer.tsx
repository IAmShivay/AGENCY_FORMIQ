'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight, Globe, Linkedin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">

          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Logo size={120} />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Transforming ideas into digital reality through innovative software solutions and cutting-edge technology.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://formiqstudio.com" target="_blank" rel="noopener noreferrer" aria-label="Website"
                className="w-9 h-9 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Globe className="w-4 h-4 text-primary" />
              </a>
              <a href="mailto:hello@formiqstudio.in" aria-label="Email"
                className="w-9 h-9 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Mail className="w-4 h-4 text-primary" />
              </a>
              <a href="https://www.linkedin.com/company/formiqstudio" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Linkedin className="w-4 h-4 text-primary" />
              </a>
              <a href="tel:+918918349445" aria-label="Phone"
                className="w-9 h-9 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors duration-200">
                <Phone className="w-4 h-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/contact", label: "Contact" },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Services</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/web", label: "Web Development" },
                { href: "/mobile", label: "Mobile App Development" },
                { href: "/ecommerce-marketplace", label: "E-commerce & Marketplace" },
                { href: "/marketing", label: "Digital Marketing" },
                { href: "/shopify", label: "Shopify" },
                { href: "/agents", label: "AI & ML" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">Get In Touch</h3>
            <div className="space-y-3">
              <a href="mailto:hello@formiqstudio.in" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                hello@formiqstudio.in
              </a>
              <a href="tel:+918918349445" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                +91 8918349445 (India)
              </a>
              <a href="tel:+12245238210" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                +1 224-523-8210 (USA)
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                Durgapur, West Bengal, India
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-muted-foreground">
              © {currentYear} <span className="font-medium text-foreground">FormiqStudio</span>. All rights reserved.
            </p>
            <div className="flex gap-5 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">Privacy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
