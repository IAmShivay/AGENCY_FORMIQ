"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Wordmark, { wordmarkIn, wordmarkHover } from './studio/Wordmark';
import LeadFormOverlay from './LeadFormOverlay';
import Magnetic from './studio/Magnetic';
import ThemeToggle from './studio/ThemeToggle';
import { gsap, useGSAP, prefersReducedMotion, isFinePointer, introReady, shouldPlayEntrance } from '@/lib/studio-motion';
import {
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Terminal,
  Globe,
  Smartphone,
  Cloud,
  LayoutGrid,
  AppWindow,
  PaintBucket,
  Target,
  Sparkles,
  ShoppingBag,
  ShoppingCart,
  Phone,
} from 'lucide-react';

const SERVICE_PATHS = ['/web', '/mobile', '/marketing', '/shopify', '/agents'];

const navItems = [
  { href: '/', label: 'Home' },
  {
    href: '/services',
    label: 'Services',
    dropdown: [
      { href: '/web', label: 'Web Development', icon: <Globe className="w-4 h-4" /> },
      { href: '/mobile', label: 'Mobile Apps', icon: <Smartphone className="w-4 h-4" /> },
      { href: '/ecommerce-marketplace', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4" /> },
      { href: '/marketing', label: 'Digital Marketing', icon: <Cloud className="w-4 h-4" /> },
      { href: '/shopify', label: 'Shopify', icon: <ShoppingBag className="w-4 h-4" /> },
      { href: '/agents', label: 'AI & Ml', icon: <Terminal className="w-4 h-4" /> },
    ],
  },
  {
    href: '/portfolio',
    label: 'Portfolio',
    dropdown: [
      { href: '/portfolio/websites', label: 'Websites', icon: <LayoutGrid className="w-4 h-4" /> },
      { href: '/portfolio/applications', label: 'Applications', icon: <AppWindow className="w-4 h-4" /> },
      { href: '/portfolio/design', label: 'Design Work', icon: <PaintBucket className="w-4 h-4" /> },
      { href: '/portfolio/creatives', label: 'Creatives', icon: <Sparkles className="w-4 h-4" /> },
      { href: '/portfolio/ads-seo', label: 'Ads & SEO', icon: <Target className="w-4 h-4" /> },
    ],
  },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const isActive = (href: string, pathname: string) => {
  // Services is active for /services and the individual service pages.
  if (href === '/services') return pathname === '/services' || SERVICE_PATHS.some((p) => pathname.startsWith(p));
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // Wordmark: assembles after the preloader; hover makes the brackets breathe.
  useGSAP(() => {
    const link = logoRef.current;
    const mark = link?.querySelector('.wordmark');
    if (!link || !mark) return;
    if (shouldPlayEntrance()) {
      gsap.set(mark, { autoAlpha: 0 });
      introReady.then(() => wordmarkIn(mark, 0.1));
    }
    if (isFinePointer() && !prefersReducedMotion()) return wordmarkHover(link, mark);
  });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Mobile menu. Fresh, explicit tweens on every open/close (no paused timeline
  // driven by play/reverse): a circle grows from the burger's measured centre,
  // then the links rise out of their masks. Nothing here has CSS transform
  // transitions, so GSAP's inline transforms are never fought.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const fast = prefersReducedMotion();
    const b = burgerRef.current?.getBoundingClientRect();
    const x = b ? b.left + b.width / 2 : window.innerWidth - 38;
    const y = b ? b.top + b.height / 2 : 34;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const items = menu.querySelectorAll<HTMLElement>('[data-menu-item]');
    const foot = menu.querySelector<HTMLElement>('[data-menu-foot]');
    gsap.killTweensOf([menu, ...Array.from(items), foot]);

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(menu, { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${r}px at ${x}px ${y}px)`, duration: fast ? 0 : 0.7, ease: 'expo.inOut' });
      gsap.fromTo(items, { yPercent: 110 },
        { yPercent: 0, duration: fast ? 0 : 0.75, ease: 'expo.out', stagger: fast ? 0 : 0.045, delay: fast ? 0 : 0.28, clearProps: 'transform' });
      if (foot) gsap.fromTo(foot, { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: fast ? 0 : 0.5, ease: 'power3.out', delay: fast ? 0 : 0.5, clearProps: 'transform' });
    } else {
      document.body.style.overflow = '';
      setMobileGroup(null);
      if (menu.style.visibility !== 'visible') return; // never opened
      gsap.to(menu, {
        clipPath: `circle(0px at ${x}px ${y}px)`, duration: fast ? 0 : 0.5, ease: 'expo.inOut',
        onComplete: () => { gsap.set(menu, { visibility: 'hidden' }); },
      });
    }
  }, [isMobileMenuOpen]);

  // The bar keeps its shape while the menu is open, so nothing reflows under the burger.
  const compact = isScrolled;

  return (
    <>
      <header data-compact={compact} className="studio-nav fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className="studio-nav-inner pointer-events-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link ref={logoRef} href="/" className="flex-shrink-0 relative z-10 flex items-center min-h-[44px]" aria-label="FormiqStudio home">
            <Wordmark className="text-[22px] lg:text-[24px]" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main">
            {navItems.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative h-10 px-4 xl:px-5 rounded-full text-[15px] font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      active ? 'bg-foreground text-background' : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    <span className="roll" data-text={item.label}><span>{item.label}</span></span>
                    {item.dropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {item.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64 z-50"
                        >
                          <div className="p-2 bg-popover text-popover-foreground rounded-2xl border border-border shadow-[0_24px_60px_-30px_hsl(0_0%_0%/0.45)]">
                            {item.dropdown.map((dropItem, i) => (
                              <Link
                                key={dropItem.href}
                                href={dropItem.href}
                                className="group flex items-center gap-3 px-3.5 py-3 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-xl transition-colors min-h-[48px]"
                              >
                                <span className="font-mono text-[10px] text-muted-foreground w-4">0{i + 1}</span>
                                {dropItem.icon}
                                <span className="flex-1">{dropItem.label}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 relative z-10">
            <ThemeToggle />
            <Magnetic>
              <button
                onClick={() => setShowLeadForm(true)}
                className="btn-ink btn-ink-invert hidden sm:inline-flex h-11 px-5 lg:px-6 items-center gap-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold whitespace-nowrap"
              >
                Get started <ArrowRight className="w-4 h-4" />
              </button>
            </Magnetic>
            <button
              ref={burgerRef}
              className="burger lg:hidden tap w-11 h-11 inline-flex flex-col items-center justify-center gap-[6px] rounded-full bg-foreground"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              data-open={isMobileMenuOpen}
              aria-expanded={isMobileMenuOpen}
              aria-controls="studio-mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="block w-[18px] h-[1.5px] rounded-full bg-background" />
              <span className="block w-[18px] h-[1.5px] rounded-full bg-background" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        id="studio-mobile-menu"
        className="fixed inset-0 z-40 lg:hidden bg-background invisible"
        aria-hidden={!isMobileMenuOpen}
        data-lenis-prevent
      >
        <div className="flex flex-col h-full px-5 pt-24 pb-[max(1.25rem,env(safe-area-inset-bottom))] overflow-y-auto">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">Menu</p>
          <ul className="flex-1">
            {navItems.map((item, i) => {
              const active = isActive(item.href, pathname);
              const open = mobileGroup === item.label;
              return (
                <li key={item.href} className="border-b border-border">
                  <div className="overflow-hidden">
                    <div data-menu-item className="flex items-center">
                      <Link
                        href={item.href}
                        tabIndex={isMobileMenuOpen ? 0 : -1}
                        className={`flex-1 flex items-baseline gap-3 py-3 text-[2.15rem] min-[380px]:text-[2.5rem] font-display font-semibold tracking-[-0.04em] leading-[1.05] ${active ? 'text-foreground' : 'text-foreground/45'}`}
                      >
                        <span className="font-mono text-[10px] tracking-normal text-muted-foreground -translate-y-4">0{i + 1}</span>
                        {item.label}
                      </Link>
                      {item.dropdown && (
                        <button
                          type="button"
                          tabIndex={isMobileMenuOpen ? 0 : -1}
                          onClick={() => setMobileGroup(open ? null : item.label)}
                          aria-expanded={open}
                          aria-label={`${open ? 'Hide' : 'Show'} ${item.label} pages`}
                          className="tap w-11 h-11 inline-flex items-center justify-center rounded-full border border-border text-foreground"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>
                  {item.dropdown && (
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.19,1,.22,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className="grid grid-cols-2 gap-1.5 pb-4">
                          {item.dropdown.map((d) => (
                            <Link
                              key={d.href}
                              href={d.href}
                              tabIndex={open ? 0 : -1}
                              className="flex items-center gap-2 min-h-[44px] px-3 rounded-xl bg-muted text-[13px] font-medium text-foreground"
                            >
                              {d.icon} {d.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div data-menu-foot className="pt-5 space-y-3">
            <button
              onClick={() => { setIsMobileMenuOpen(false); setShowLeadForm(true); }}
              tabIndex={isMobileMenuOpen ? 0 : -1}
              className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:+918918349445" data-track-source="mobile-menu" tabIndex={isMobileMenuOpen ? 0 : -1} className="h-12 rounded-full border border-border flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                <Phone className="w-4 h-4" /> Call
              </a>
              <a href="https://wa.me/919832078313" target="_blank" rel="noopener noreferrer" data-track-source="mobile-menu" tabIndex={isMobileMenuOpen ? 0 : -1} className="h-12 rounded-full border border-border flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                WhatsApp <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground text-center">Kolkata · Durgapur · Asansol</p>
          </div>
        </div>
      </div>
      <LeadFormOverlay open={showLeadForm} onClose={() => setShowLeadForm(false)} />
    </>
  );
};

export default Header;
