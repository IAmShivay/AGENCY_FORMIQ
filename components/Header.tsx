"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
// ThemeSwitcher removed - using light mode only
import Logo from './Logo';
import {
  ChevronDown,
  ArrowRight,
  Terminal,
  Menu,
  X,
  Globe,
  Smartphone,
  Cloud,
  LayoutGrid,
  AppWindow,
  PaintBucket,
  ShoppingBag,
  ShoppingCart,
  Home,
  Info,
  Users,
  Mail,
  Server,
  BarChart4,
  Wrench,
  Code
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: <Home className="w-4 h-4" />
    },
    {
      href: '/services',
      label: 'Services',
      icon: <Cloud className="w-4 h-4" />,
      dropdown: [
        { href: '/web', label: 'Web Development', icon: <Globe className="w-4 h-4" /> },
        { href: '/mobile', label: 'Mobile Apps', icon: <Smartphone className="w-4 h-4" /> },
        { href: '/ecommerce-marketplace', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4" /> },
        { href: '/marketing', label: 'Digital Marketing', icon: <Cloud className="w-4 h-4" /> },
        { href: '/shopify', label: 'Shopify', icon: <ShoppingBag className="w-4 h-4" /> },
        { href: '/agents', label: 'AI & Ml', icon: <Terminal className="w-4 h-4" /> }
      ]
    },
    {
      href: '/portfolio',
      label: 'Portfolio',
      icon: <LayoutGrid className="w-4 h-4" />,
      dropdown: [
        { href: '/portfolio/websites', label: 'Websites', icon: <LayoutGrid className="w-4 h-4" /> },
        { href: '/portfolio/applications', label: 'Applications', icon: <AppWindow className="w-4 h-4" /> },
        { href: '/portfolio/design', label: 'Design Work', icon: <PaintBucket className="w-4 h-4" /> }
      ]
    },
    {
      href: '/about',
      label: 'About',
      icon: <Info className="w-4 h-4" />
    },
    {
      href: '/contact',
      label: 'Contact',
      icon: <Mail className="w-4 h-4" />
    }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${isScrolled
          ? 'py-2.5 md:py-3 bg-background/95 shadow-md border-b border-border/20'
          : 'py-3 md:py-4 lg:py-5 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-6 lg:gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 relative group">
              <div className="relative group-hover:opacity-90 transition-transform duration-300">
                <Logo size={150} className="sm:w-[150px] drop-shadow-sm" />
              </div>
            </Link>
          </div>

          {/* Desktop Nav - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="bg-gray-100/70 dark:bg-gray-800/50 bg-secondary/80 rounded-full py-2 px-2 flex items-center gap-1">
              {navItems.map((item, i) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.dropdown ? '#' : item.href}
                    onClick={(e) => {
                      if (item.dropdown) {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === item.label ? null : item.label);
                      }
                    }}
                    className={`relative px-4 xl:px-6 py-3 rounded-full text-sm lg:text-base font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${(() => {
                        // For Services tab - only active for /services (exact match) or /web, /mobile, etc.
                        if (item.href === '/services' && (pathname === '/services' || pathname.startsWith('/web') || pathname.startsWith('/mobile') || pathname.startsWith('/marketing') || pathname.startsWith('/shopify') || pathname.startsWith('/agents'))) {
                          return 'text-white bg-primary shadow-sm';
                        }
                        // For other tabs - normal active state logic
                        return (pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/services'))
                          ? 'text-white bg-primary shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200/70 dark:hover:bg-gray-700/50';
                      })()
                      }`}
                  >
                    {item.icon}
                    <span className="hidden xl:inline">{item.label}</span>
                    {item.dropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''
                        }`} />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                        >
                          <div className="p-3">
                            {item.dropdown.map((dropItem) => (
                              <Link
                                key={dropItem.href}
                                href={dropItem.href}
                                className="flex items-center gap-3 px-4 py-4 text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[48px]"
                              >
                                {dropItem.icon} {dropItem.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
          </div>
{/* <ThemeSwitcher/> */}
          {/* Right side: Mobile Menu + CTA */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-shrink-0">

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* CTA Button */}
            <div className="hidden sm:block">
              <Link href="/contact">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white px-6 lg:px-8 xl:px-10 py-3 lg:py-4 flex items-center gap-2 shadow-sm hover:shadow text-sm lg:text-base font-semibold">
                  <span className="hidden md:inline">Get Started</span>
                  <span className="md:hidden">Start</span>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden mt-6 md:mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="p-4 md:p-6 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.href} className="relative">
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                          className="w-full px-4 py-3 md:py-4 text-left text-sm md:text-base font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                        >
                          <span className="flex items-center gap-3">
                            {item.icon}
                            {item.label}
                          </span>
                          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''
                            }`} />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-6 ml-3 mt-2 mb-2 border-l-2 border-primary/20"
                            >
                              {item.dropdown.map((dropItem) => (
                                <Link
                                  key={dropItem.href}
                                  href={dropItem.href}
                                  className="flex items-center gap-3 px-4 py-3 text-sm md:text-base text-gray-600 dark:text-gray-300 hover:text-primary transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                  {dropItem.icon}
                                  {dropItem.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 md:py-4 text-sm md:text-base font-medium rounded-xl transition-colors ${(() => {
                            // For Services tab - only active for /services (exact match) or /web, /mobile, etc.
                            if (item.href === '/services' && (pathname === '/services' || pathname.startsWith('/web') || pathname.startsWith('/mobile') || pathname.startsWith('/marketing') || pathname.startsWith('/shopify') || pathname.startsWith('/agents'))) {
                              return 'bg-primary/10 text-primary';
                            }
                            // For other tabs - normal active state logic
                            return (pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/services'))
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700';
                          })()
                          }`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-gray-100 dark:border-gray-700 sm:hidden">
                  <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white py-3 md:py-4 flex items-center justify-center gap-2 font-semibold">
                    Get Started
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;