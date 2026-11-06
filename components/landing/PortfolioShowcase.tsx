"use client";

import { useState, type UIEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Magnetic from '@/components/studio/Magnetic';
import ProjectModal, { type PortfolioProject } from './ProjectModal';
import { openLeadSheet } from '@/lib/lead-sheet';
import { RAIL_ITEM, RAIL_TO_MD, pad2 } from '@/components/studio/ui';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const TITLE_SEPARATOR = ' - ';
const RAIL_SM_GUTTER = 'sm:-mx-6 sm:px-6 sm:scroll-px-6';

// Featured portfolio projects
const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: "LuxeHouse - Premium Furniture E-commerce",
    description: "Complete e-commerce platform for a premium furniture brand in Durgapur. Custom product configurator, Cashfree payments, automated GST invoicing, and a full admin dashboard to manage orders, gallery, and inventory.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop",
    category: "E-Commerce Platform",
    tags: ["React", "TypeScript", "Express", "MongoDB", "Cashfree"],
    type: "website",
    results: "40% more inquiries",
    timeline: "2 months",
    teamSize: "2 developers",
    technologies: ["React", "Vite", "TypeScript", "Express", "MongoDB", "Cashfree", "Cloudinary", "PM2"],
    challenge: "LuxeHouse needed a professional online presence to compete with national furniture brands while managing custom orders, invoices, and inventory from a single dashboard.",
    solution: "We built a full-stack e-commerce platform with real-time product customization, automated invoice generation with GST calculations, and integrated WhatsApp for customer communication.",
    keyFeatures: [
      "Product Configurator with real-time preview",
      "Admin Dashboard for orders & inventory",
      "Automated Invoice Generator with GST",
      "Gallery Management via Cloudinary",
      "Cashfree Payment Integration",
      "WhatsApp Integration for customer support",
      "Responsive mobile-first design",
      "SEO-optimized product pages"
    ],
    impact: "LuxeHouse saw a 40% increase in customer inquiries within the first month. Invoice processing became 3x faster with automated GST calculations, and the brand now competes professionally against national furniture chains.",
    metrics: [
      { value: "40%", label: "More Inquiries" },
      { value: "3x", label: "Faster Invoicing" },
      { value: "100%", label: "Online Presence" }
    ],
    testimonial: {
      quote: "FormiqStudio built us a platform that rivals national furniture brands. Our customers love the online experience and we save hours on invoicing every week.",
      author: "LuxeHouse Team",
      position: "Durgapur"
    },
    liveUrl: "https://furniture.formiqstudio.in"
  },
  {
    id: 2,
    title: "ClearCRM - SaaS CRM Platform",
    description: "Enterprise-grade CRM with native WhatsApp Business integration, AI-powered chatbot flows, visual workflow builder, lead pipeline management, and multi-tenant architecture built for Indian businesses.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
    category: "SaaS CRM",
    tags: ["Next.js", "TypeScript", "MongoDB", "WhatsApp API", "Claude AI"],
    type: "website",
    results: "80% faster responses",
    timeline: "3 months",
    teamSize: "2 developers",
    technologies: ["Next.js", "TypeScript", "MongoDB", "WhatsApp Cloud API", "Claude AI", "RTK Query"],
    challenge: "Businesses needed an affordable CRM that natively integrates WhatsApp Business for Indian market communication patterns, replacing expensive tools that don't support WhatsApp workflows.",
    solution: "Built a multi-tenant SaaS CRM with visual WhatsApp flow builder, AI-powered auto-replies using Claude, and a complete lead-to-invoice pipeline. Each business gets its own workspace with team collaboration features.",
    keyFeatures: [
      "Visual WhatsApp Bot Builder",
      "Lead Pipeline with drag-and-drop",
      "Invoice Management with GST",
      "AI Auto-replies powered by Claude",
      "Team Collaboration & roles",
      "Multi-workspace architecture",
      "Automated follow-up sequences",
      "Analytics & reporting dashboard"
    ],
    impact: "ClearCRM is serving multiple businesses with 80% faster lead response times. Automated follow-ups save teams 15+ hours per week, and the WhatsApp integration has become the primary sales channel for most users.",
    metrics: [
      { value: "80%", label: "Faster Responses" },
      { value: "15+", label: "Hours Saved/Week" },
      { value: "Multi", label: "Tenant SaaS" }
    ],
    testimonial: {
      quote: "Finally a CRM that understands how Indian businesses communicate. The WhatsApp integration alone has transformed our sales process.",
      author: "ClearCRM User",
      position: "Early Adopter"
    },
    liveUrl: "https://crm.formiqstudio.in"
  },
  {
    id: 3,
    title: "Annvaya - Superfoods Brand Identity",
    description: "Complete brand identity and packaging design for an organic superfoods and herbal products company. Earthy, premium aesthetic targeting health-conscious urban consumers across India.",
    image: "https://images.unsplash.com/photo-1505576399279-0d754687a2d8?w=600&h=400&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop",
    category: "Branding & Packaging",
    tags: ["Brand Identity", "Packaging", "Social Media", "Design System"],
    type: "design",
    results: "Premium brand launch",
    timeline: "1 month",
    teamSize: "2 designers",
    technologies: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Canva"],
    challenge: "Annvaya needed a brand identity that conveyed premium quality, organic authenticity, and trustworthiness in a crowded superfoods market dominated by established players.",
    solution: "Created a cohesive brand identity system with earthy color palette, custom typography, and packaging designs that stand out on shelves. Developed social media templates for consistent brand presence across Instagram and Facebook.",
    keyFeatures: [
      "Logo Design with multiple variants",
      "Packaging Design for product range",
      "Brand Guidelines document",
      "Social Media Creative templates",
      "Color palette & typography system",
      "Marketing collateral designs",
      "Product photography direction",
      "Print-ready packaging files"
    ],
    impact: "Annvaya launched with a premium brand identity that positioned them alongside established superfoods brands. The packaging design received positive feedback from distributors, and social media engagement increased significantly with the templated creative system.",
    metrics: [
      { value: "100%", label: "Brand System" },
      { value: "15+", label: "SKU Packaging" },
      { value: "50+", label: "Social Templates" }
    ],
    testimonial: {
      quote: "The brand identity FormiqStudio created perfectly captures our vision of premium, organic products. Distributors and customers alike are impressed by our packaging.",
      author: "Annvaya Team",
      position: "Founders"
    },
    liveUrl: ""
  }
];

/** "LuxeHouse - Premium Furniture E-commerce" → ["LuxeHouse", "Premium Furniture E-commerce"] */
const splitTitle = (title: string) => {
  const at = title.indexOf(TITLE_SEPARATOR);
  return at === -1 ? [title, ''] : [title.slice(0, at), title.slice(at + TITLE_SEPARATOR.length)];
};

const PortfolioShowcase = () => {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProjectModal = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const [activeSlide, setActiveSlide] = useState(0);
  const lastSlide = portfolioProjects.length - 1;
  const trackSlide = (e: UIEvent<HTMLOListElement>) => {
    const rail = e.currentTarget;
    const range = rail.scrollWidth - rail.clientWidth;
    if (range > 0) setActiveSlide(Math.round((rail.scrollLeft / range) * lastSlide));
  };

  return (
    <section id="work" className="relative overflow-hidden bg-background text-foreground py-14 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-12 lg:items-end mb-8 md:mb-20">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-3 md:mb-5">(01) Selected work</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.98] tracking-[-0.04em]">
              Work that <span className="text-primary">stays</span> with people.
            </h2>
          </div>
          <p className="lg:col-span-4 lg:col-start-9 text-base md:text-lg text-muted-foreground leading-relaxed">
            A few recent projects, each made to be recognised at a glance.
          </p>
        </div>

        {/* Case studies: alternating editorial rows */}
        <ol onScroll={trackSlide} className={`${RAIL_TO_MD} ${RAIL_SM_GUTTER} md:block md:space-y-24`}>
          {portfolioProjects.map((project, index) => {
            const [name, subtitle] = splitTitle(project.title);
            const flipped = index % 2 === 1;
            return (
              <li key={project.id} className={`${RAIL_ITEM} md:w-auto`}>
                <article className="group relative grid gap-4 md:gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center">
                  <div className={`relative overflow-hidden rounded-[22px] border border-border bg-muted aspect-[4/3] lg:col-span-7 ${flipped ? 'lg:col-start-6 lg:row-start-1' : ''}`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 58vw, (min-width: 768px) 100vw, 82vw"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className={`lg:col-span-5 ${flipped ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-2 md:mb-4">
                      {String(index + 1).padStart(2, '0')} / {project.category}
                    </p>
                    <h3 className="font-display text-3xl md:text-5xl font-bold leading-none tracking-[-0.04em]">
                      {/* Stretched button: the whole row opens the case study */}
                      <button
                        type="button"
                        onClick={() => openProjectModal(project)}
                        className={`text-left before:absolute before:inset-0 before:z-10 before:rounded-[22px] rounded-sm ${FOCUS_RING}`}
                      >
                        {name}
                        <span className="sr-only">, view case study</span>
                      </button>
                    </h3>
                    {subtitle && <p className="mt-3 hidden md:block text-lg text-muted-foreground">{subtitle}</p>}
                    <p className="mt-2 md:mt-6 text-lg md:text-2xl font-display font-semibold tracking-[-0.03em]">{project.results}</p>
                    <p className="mt-3 hidden md:block font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground leading-relaxed">
                      {project.tags.join(' / ')}
                    </p>

                    <span aria-hidden="true" className="mt-4 md:mt-8 inline-flex items-center gap-2 text-[15px] font-semibold">
                      <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current after:origin-right after:scale-x-0 after:transition-transform after:duration-[600ms] group-hover:after:origin-left group-hover:after:scale-x-100">
                        View case
                      </span>
                      <ArrowUpRight className="w-4 h-4 motion-safe:transition-transform motion-safe:duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <div aria-hidden="true" className="md:hidden mt-5 flex items-center gap-4">
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {pad2(activeSlide + 1)} / {pad2(portfolioProjects.length)}
          </span>
          <span className="flex flex-1 gap-1.5">
            {portfolioProjects.map((project, index) => (
              <span
                key={project.id}
                className={`h-px flex-1 motion-safe:transition-colors motion-safe:duration-500 ${index === activeSlide ? 'bg-foreground' : 'bg-border'}`}
              />
            ))}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-12 md:mt-28 pt-8 md:pt-12 border-t border-border grid gap-6 md:gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h3 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-[1.02]">
              Have a project in mind?
            </h3>
            <p className="mt-3 md:mt-4 text-muted-foreground text-base md:text-lg max-w-xl">
              Tell us what you&apos;re making. We&apos;ll come back with a clear scope, timeline and fixed price.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 lg:justify-end">
            <Magnetic>
              <Link
                href="/portfolio"
                className={`btn-ink h-14 px-7 border border-foreground/20 text-foreground rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap ${FOCUS_RING}`}
              >
                See all work
              </Link>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={openLeadSheet}
                className={`btn-ink btn-ink-invert h-14 px-7 bg-primary text-primary-foreground rounded-full font-semibold inline-flex items-center justify-center gap-2 text-[15px] whitespace-nowrap group/cta ${FOCUS_RING}`}
              >
                Start a project
                <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-500 group-hover/cta:translate-x-1" />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectModal}
      />
    </section>
  );
};

export default PortfolioShowcase;
