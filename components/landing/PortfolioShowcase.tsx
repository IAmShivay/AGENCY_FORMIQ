"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Globe, Smartphone, PaintBucket, ArrowRight, Code, Eye, ShoppingCart, BarChart3, MessageSquare, Palette } from "lucide-react";
import { Button } from '@/components/ui/button';
import ProjectModal from './ProjectModal';

const PortfolioShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const openProjectModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };

  // Featured portfolio projects
  const portfolioProjects = [
    {
      id: 1,
      title: "LuxeHouse - Premium Furniture E-commerce",
      description: "Complete e-commerce platform for a premium furniture brand in Durgapur. Custom product configurator, Cashfree payments, automated GST invoicing, and a full admin dashboard to manage orders, gallery, and inventory.",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop",
      category: "E-Commerce Platform",
      tags: ["React", "TypeScript", "Express", "MongoDB", "Cashfree"],
      type: "website",
      icon: ShoppingCart,
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
      icon: MessageSquare,
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
      icon: Palette,
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
      liveUrl: "#"
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${18 + i * 2}s`,
            }}
          >
            <div className="w-32 h-32 rounded-full bg-primary/5 blur-2xl" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 animated-gradient-text">
              Our Success Stories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how we've helped 500+ startups and businesses transform their ideas into successful digital products
            </p>
          </motion.div>

          {/* Featured Projects Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {portfolioProjects.map((project, index) => {
              const Icon = project.icon;
              const isFeatured = index < 2;

              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
                    isFeatured
                      ? 'bg-gradient-to-br from-card via-card/95 to-primary/10 border-2 border-primary/30 shadow-xl hover:shadow-2xl'
                      : 'bg-gradient-to-br from-card via-card/95 to-primary/5 border border-primary/20 hover:border-primary/40 shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => openProjectModal(project)}
                >
                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="absolute top-4 right-4 z-20 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      FEATURED
                    </div>
                  )}

                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Overlay Content */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center mb-2">
                        <Icon className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">{project.category}</span>
                      </div>
                    </div>

                    {/* View Project Button */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-black"
                        onClick={() => openProjectModal(project)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Results */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-sm font-medium">{project.results}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Portfolio Stats */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="group">
                  <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                  <div className="text-sm text-muted-foreground">Projects Delivered</div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">15</div>
                  <div className="text-sm text-muted-foreground">Days Average</div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4 animated-gradient-text">
                Ready to Join Our Success Stories?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let's discuss your project and create something amazing together. Get your MVP in just 15 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/portfolio">
                  <Button variant="outline" size="lg" className="group">
                    View Full Portfolio
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  onClick={() => {
                    const contactSection = document.getElementById('contact-form');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Your Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectModal}
      />
    </section>
  );
};

export default PortfolioShowcase;
