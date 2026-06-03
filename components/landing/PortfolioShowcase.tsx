"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Globe, Smartphone, PaintBucket, ArrowRight, Code, Eye, Gamepad2, BarChart3, TrendingUp, Users } from "lucide-react";
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
      title: "Gaming Platform",
      description: "Multiplayer gaming platform with real-time matchmaking, tournaments, and social features.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop",
      category: "Gaming Platform",
      tags: ["React", "Node.js", "Socket.io", "MongoDB"],
      type: "website",
      icon: Gamepad2,
      results: "50K+ active players",
      timeline: "4 months",
      teamSize: "8 developers",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Redis", "AWS", "WebRTC"],
      challenge: "Building a real-time multiplayer gaming platform that could handle thousands of concurrent players while maintaining low latency and ensuring fair gameplay. The platform needed to support multiple game types, tournaments, and social features.",
      solution: "We developed a scalable microservices architecture using Node.js and Socket.io for real-time communication. Implemented Redis for session management and caching, with MongoDB for persistent data storage. Used WebRTC for peer-to-peer connections in certain game modes.",
      keyFeatures: [
        "Real-time multiplayer gameplay",
        "Tournament management system",
        "Player ranking and leaderboards",
        "In-game chat and voice communication",
        "Anti-cheat detection system",
        "Payment integration for tournaments",
        "Mobile-responsive design",
        "Admin dashboard for game management"
      ],
      impact: "The platform successfully launched with over 50,000 registered players within the first 3 months. Tournament participation increased by 300%, and player retention improved by 45% compared to the client's previous platform.",
      metrics: [
        { value: "50K+", label: "Active Players" },
        { value: "300%", label: "Tournament Growth" },
        { value: "45%", label: "Retention Increase" }
      ],
      testimonial: {
        quote: "The gaming platform exceeded our expectations. The real-time features work flawlessly, and our player engagement has never been higher.",
        author: "Alex Chen",
        position: "CEO, GameHub Studios"
      },
      liveUrl: "https://gaming-007.vercel.app/",
      githubUrl: "https://github.com/example/gaming-platform"
    },
    {
      id: 2,
      title: "Business SaaS Platform",
      description: "Comprehensive business management SaaS with CRM, project management, and analytics.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
      category: "SaaS Platform",
      tags: ["Next.js", "PostgreSQL", "Stripe", "TypeScript"],
      type: "website",
      icon: BarChart3,
      results: "200% productivity boost",
      timeline: "6 months",
      teamSize: "12 developers",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "AWS", "Docker", "Kubernetes"],
      challenge: "Creating an all-in-one business management platform that could replace multiple existing tools while being intuitive enough for non-technical users. The platform needed to handle complex workflows, integrations, and scale to thousands of businesses.",
      solution: "Built a modular SaaS platform using Next.js and TypeScript for type safety. Implemented a microservices architecture with PostgreSQL for data persistence and Prisma for database management. Created a flexible plugin system for custom integrations.",
      keyFeatures: [
        "Customer relationship management",
        "Project and task management",
        "Advanced analytics and reporting",
        "Team collaboration tools",
        "Invoice and payment processing",
        "API integrations with 50+ tools",
        "Custom workflow automation",
        "Multi-tenant architecture"
      ],
      impact: "The platform helped businesses reduce operational overhead by 40% and improve team productivity by 200%. Over 500 companies adopted the platform within 6 months, generating $2M+ in recurring revenue.",
      metrics: [
        { value: "500+", label: "Companies" },
        { value: "200%", label: "Productivity Boost" },
        { value: "$2M+", label: "ARR Generated" }
      ],
      testimonial: {
        quote: "This SaaS platform transformed how we manage our business. Everything we need is in one place, and the automation features saved us countless hours.",
        author: "Sarah Johnson",
        position: "Operations Director, TechFlow Inc"
      },
      liveUrl: "https://turinos.ai/"
    },
    {
      id: 3,
      title: "LuckShack Casino",
      description: "Feature-rich e-commerce casino platform with secure payments, live games, and personalized user experiences.",
      image: "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?w=600&h=400&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1596838132731-31a4e5f9a4a4?w=1200&h=600&fit=crop",
      category: "E-commerce & Gaming",
      tags: ["Next.js", "Node.js", "WebSockets", "MongoDB"],
      type: "website",
      icon: TrendingUp,
      results: "50K+ active players",
      timeline: "3 months",
      teamSize: "8 developers",
      technologies: ["Next.js", "Node.js", "WebSockets", "MongoDB", "Redis", "Docker", "AWS", "Stripe"],
      challenge: "Building a secure, high-performance casino platform with real-time multiplayer games, payment processing, and regulatory compliance. The system needed to handle thousands of concurrent users while maintaining low latency for live games.",
      solution: "Developed a scalable architecture using Next.js for the frontend and Node.js for the backend. Implemented WebSockets for real-time game updates and chat. Used MongoDB for data storage and Redis for session management and caching. Integrated with Stripe for secure payment processing.",
      keyFeatures: [
        "Real-time multiplayer games",
        "Secure payment processing",
        "User account management",
        "Live dealer integration",
        "Loyalty rewards system",
        "Responsive design for all devices",
        "Chat and social features",
        "Advanced security measures"
      ],
      impact: "LuckShack attracted over 50,000 active players within the first month of launch. The platform maintains 99.9% uptime with sub-100ms response times for real-time games, resulting in a 45% higher user retention rate compared to industry averages.",
      metrics: [
        { value: "50K+", label: "Active Players" },
        { value: "99.9%", label: "Uptime" },
        { value: "45%", label: "Higher Retention" }
      ],
      testimonial: {
        quote: "The LuckShack platform exceeded all our expectations. The real-time gaming experience is smooth and engaging, and our players love the intuitive interface.",
        author: "Mitch Newby",
        position: "Owner, LuckShack"
      },
      liveUrl: "https://luckshack.com"
    },
    {
      id: 4,
      title: "Sales CRM System",
      description: "Advanced CRM system with lead management, sales pipeline, and performance analytics.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop",
      category: "CRM Platform",
      tags: ["Vue.js", "Laravel", "MySQL", "Elasticsearch"],
      type: "website",
      icon: Users,
      results: "40% increase in sales",
      timeline: "4 months",
      teamSize: "9 developers",
      technologies: ["Vue.js", "Laravel", "MySQL", "Elasticsearch", "Redis", "AWS", "Twilio", "Stripe"],
      challenge: "Creating a comprehensive CRM system that could handle complex sales processes, automate follow-ups, and provide detailed analytics. The system needed to integrate with multiple communication channels and existing business tools.",
      solution: "Developed a feature-rich CRM using Vue.js for the frontend and Laravel for the backend. Implemented Elasticsearch for advanced search capabilities and integrated with Twilio for communication features. Built automated workflow engine for sales process optimization.",
      keyFeatures: [
        "Lead capture and qualification",
        "Sales pipeline management",
        "Automated email sequences",
        "Call logging and recording",
        "Performance analytics and reporting",
        "Team collaboration tools",
        "Mobile app for field sales",
        "Integration with 30+ tools"
      ],
      impact: "Sales teams using the CRM saw a 40% increase in conversion rates and 50% reduction in lead response time. The platform helped manage over $50M in sales pipeline within the first year.",
      metrics: [
        { value: "40%", label: "Sales Increase" },
        { value: "50%", label: "Faster Response" },
        { value: "$50M+", label: "Pipeline Managed" }
      ],
      testimonial: {
        quote: "This CRM revolutionized our sales process. The automation features and analytics helped us close more deals and understand our customers better.",
        author: "Jennifer Davis",
        position: "Sales Director, Growth Solutions"
      },
      liveUrl: "https://sales.formiqstudio.com"
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
