"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Monitor, Code, ExternalLink, X } from 'lucide-react';
import { WebsiteProject as DBWebsiteProject, getWebsiteProjects } from '@/lib/portfolio';

// Define TypeScript interface for the project structure
interface ProjectCaseStudy {
  challenge: string;
  solution: string;
  results: string;
  testimonial: string;
  screens: string[];
}

interface WebsiteProject {
  id: string | number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  category: string;
  completionDate: string;
  features: string[];
  liveLink: string;
  repoLink: string;
  caseStudy: ProjectCaseStudy;
}

// Function to convert DB model to component model
function convertToComponentModel(dbProject: DBWebsiteProject): WebsiteProject {
  return {
    id: dbProject.id,
    title: dbProject.title,
    description: dbProject.description,
    image: dbProject.image || '/images/portfolio/website-1.jpg',
    tags: dbProject.tags || [],
    link: dbProject.link || '#',
    category: dbProject.category,
    completionDate: dbProject.completion_date || '',
    features: dbProject.features || [],
    liveLink: dbProject.live_link || '#',
    repoLink: dbProject.repo_link || '#',
    caseStudy: {
      challenge: dbProject.case_study_challenge || '',
      solution: dbProject.case_study_solution || '',
      results: dbProject.case_study_results || '',
      testimonial: dbProject.case_study_testimonial || '',
      screens: dbProject.case_study_screens || []
    }
  };
}

const WebsitesPortfolio = () => {
  // Website categories for filtering
  const categories = ['All', 'E-Commerce', 'Corporate', 'Educational', 'Landing Pages'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [websiteProjects, setWebsiteProjects] = useState<WebsiteProject[]>([]);

  // State for case study popup
  const [selectedProject, setSelectedProject] = useState<WebsiteProject | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch website projects from the database
  useEffect(() => {
    async function fetchWebsites() {
      try {
        setLoading(true);
        const dbProjects = await getWebsiteProjects();

        console.log('Fetched website projects:', dbProjects);

        // If we have data from the database, use it
        if (dbProjects && dbProjects.length > 0) {
          // Convert DB model to component model
          const convertedProjects = dbProjects.map(convertToComponentModel);
          setWebsiteProjects(convertedProjects);
        } else {
          // Otherwise, set empty array (don't use fallback data)
          console.log('No website projects found in database');
          setWebsiteProjects([]);
          // Commented out fallback data usage
          // setWebsiteProjects(fallbackWebsiteProjects);
        }
      } catch (error) {
        console.error('Error fetching website projects:', error);
        // Set empty array on error (don't use fallback data)
        setWebsiteProjects([]);
        // Commented out fallback data usage
        // setWebsiteProjects(fallbackWebsiteProjects);
      } finally {
        setLoading(false);
      }
    }

    fetchWebsites();
  }, []);

  // Function to open case study popup
  const openCaseStudy = (project: WebsiteProject) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
    // Prevent scrolling when popup is open
    document.body.style.overflow = 'hidden';
  };

  // Function to close case study popup
  const closeCaseStudy = () => {
    setIsPopupOpen(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  // Fallback website projects data in case the database is empty
  const fallbackWebsiteProjects: WebsiteProject[] = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce solution with advanced filtering and payment integration.',
      image: '/images/portfolio/website-1.jpg',
      tags: ['Next.js', 'Tailwind CSS', 'Stripe'],
      link: '#',
      category: 'E-Commerce',
      completionDate: 'March 2024',
      features: ['Product Search', 'User Accounts', 'Secure Payments', 'Order Tracking'],
      liveLink: 'https://example.com',
      repoLink: 'https://github.com',
      caseStudy: {
        challenge: 'The client needed a modern e-commerce platform that could handle their large product catalog while providing a seamless shopping experience for customers.',
        solution: 'We developed a custom e-commerce platform using Next.js with server-side rendering for optimal performance and SEO. Integration with Stripe provided secure payment processing.',
        results: 'After launching the new platform, the client saw a 43% increase in conversion rates and a 27% reduction in cart abandonment.',
        testimonial: 'The new platform has transformed our online business. Customers love the intuitive interface and our team appreciates how easy it is to manage products and orders.',
        screens: ['/images/portfolio/ecom-screen-1.jpg', '/images/portfolio/ecom-screen-2.jpg']
      }
    },
    {
      id: 2,
      title: 'Corporate Website',
      description: 'Responsive corporate website with custom CMS and interactive elements.',
      image: '/images/portfolio/website-2.jpg',
      tags: ['React', 'Node.js', 'MongoDB'],
      link: '#',
      category: 'Corporate',
      completionDate: 'January 2024',
      features: ['Blog System', 'Career Portal', 'Contact Forms', 'Case Studies','Contact form'],
      liveLink: 'https://example.com',
      repoLink: 'https://github.com',
      caseStudy: {
        challenge: 'Our client, a growing technology firm, needed a modern website that would better represent their brand and allow their marketing team to easily update content.',
        solution: 'We built a custom React frontend with a Node.js API connecting to MongoDB, providing a seamless content management experience through a custom admin interface.',
        results: 'The new website led to a 65% increase in lead generation and significantly reduced the time required to update content from days to minutes.',
        testimonial: 'formiqstudio delivered exactly what we needed - a professional website that truly represents our brand while being incredibly easy to maintain.',
        screens: ['/images/portfolio/corp-screen-1.jpg', '/images/portfolio/corp-screen-2.jpg']
      }
    },
    {
      id: 3,
      title: 'Educational Platform',
      description: 'Learning management system with video courses and progress tracking.',
      image: '/images/portfolio/website-3.jpg',
      tags: ['Next.js', 'Firebase', 'Tailwind CSS'],
      link: '#',
      category: 'Educational',
      completionDate: 'February 2024',
      features: ['Course Library', 'Progress Tracking', 'Certificates', 'Discussion Forums'],
      liveLink: 'https://example.com',
      repoLink: 'https://github.com',
      caseStudy: {
        challenge: 'The client, an educational institution, needed a robust platform to deliver online courses to students worldwide with progress tracking and certification.',
        solution: 'We built a comprehensive learning management system using Next.js and Firebase, implementing real-time features and secure authentication.',
        results: 'The platform now hosts over 5,000 students with a 98% satisfaction rate and has enabled the client to expand their educational offerings globally.',
        testimonial: 'The platform has revolutionized how we deliver education. Our students love the interactive features and our instructors appreciate the detailed analytics.',
        screens: ['/images/portfolio/edu-screen-1.jpg', '/images/portfolio/edu-screen-2.jpg']
      }
    },
    {
      id: 4,
      title: 'Real Estate Listing Portal',
      description: 'Interactive property listing website with map integration and advanced search.',
      image: '/images/portfolio/website-4.jpg',
      tags: ['Vue.js', 'Express', 'PostgreSQL', 'Mapbox'],
      link: '#',
      category: 'E-Commerce',
      completionDate: 'April 2024',
      features: ['Property Search', 'Map View', 'Virtual Tours', 'Mortgage Calculator'],
      liveLink: 'https://example.com',
      repoLink: 'https://github.com',
      caseStudy: {
        challenge: 'A real estate agency needed a modern property listing platform that would display properties with advanced search capabilities and interactive maps.',
        solution: 'We developed a Vue.js application with Mapbox integration and a robust backend using Express and PostgreSQL with comprehensive filtering options.',
        results: 'Property inquiries increased by 78% and the average time spent on site increased from 2 minutes to over 7 minutes after launch.',
        testimonial: 'This portal has completely transformed our business. Our agents love how easy it is to showcase properties and our clients appreciate the intuitive search features.',
        screens: ['/images/portfolio/real-estate-screen-1.jpg', '/images/portfolio/real-estate-screen-2.jpg']
      }
    },
    {
      id: 5,
      title: 'Product Landing Page',
      description: 'High-converting landing page for a SaaS product with animations and CTAs.',
      image: '/images/portfolio/website-5.jpg',
      tags: ['HTML5', 'GSAP', 'Tailwind CSS', 'JavaScript'],
      link: '#',
      category: 'Landing Pages',
      completionDate: 'December 2023',
      features: ['Animations', 'Testimonials', 'Lead Forms', 'Mobile Optimized'],
      liveLink: 'https://example.com',
      repoLink: 'https://github.com',
      caseStudy: {
        challenge: 'A SaaS startup needed a high-converting landing page to showcase their new product and generate pre-launch signups.',
        solution: 'We designed and developed a visually engaging landing page with GSAP animations and strategic CTAs to maximize conversions.',
        results: 'The landing page achieved a 14.3% conversion rate, significantly above industry average, resulting in over 5,000 pre-launch signups.',
        testimonial: 'The landing page exceeded all our expectations. The animations were eye-catching without being distracting, and the conversion rate was phenomenal.',
        screens: ['/images/portfolio/landing-screen-1.jpg', '/images/portfolio/landing-screen-2.jpg']
      }
    },
    {
      id: 6,
      title: 'University Portal',
      description: 'Comprehensive university website with student and faculty portals.',
      image: '/images/portfolio/website-6.jpg',
      tags: ['React', 'Django', 'PostgreSQL'],
      link: '#',
      category: 'Educational',
      completionDate: 'March 2024',
      features: ['Course Registration', 'Event Calendar', 'Faculty Directory', 'Alumni Network'],
      liveLink: 'https://example.com',
      repoLink: 'https://github.com',
      caseStudy: {
        challenge: 'A university needed to modernize their online presence and provide separate portals for students, faculty, and administrative staff.',
        solution: 'We developed a comprehensive web portal with React frontend and Django backend, implementing role-based access and custom workflows.',
        results: 'Administrative efficiency increased by 42% and student satisfaction with online services improved from 65% to 91%.',
        testimonial: 'The new portal has streamlined so many of our processes. Students and faculty alike have commented on how much easier it is to access information and complete tasks.',
        screens: ['/images/portfolio/uni-screen-1.jpg', '/images/portfolio/uni-screen-2.jpg']
      }
    },
  ];

  // Log when website projects change
  useEffect(() => {
    console.log('Website projects updated:', websiteProjects.length);
  }, [websiteProjects.length]);

  // Filter projects based on active category
  const filteredProjects = activeFilter === 'All'
    ? websiteProjects
    : websiteProjects.filter(project => project.category === activeFilter);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent pt-28 md:pt-36 lg:pt-44">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Globe className="w-10 h-10 text-primary mr-3" />
              <h1 className="text-5xl md:text-6xl font-bold premium-text-gradient">
                Website Development
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Crafting exceptional digital experiences that drive results and engage users.
            </p>
          </div>
        </div>

        {/* Geometric Shapes for Visual Interest */}
        <div className="absolute top-20 left-12 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-12 right-16 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>

        {/* Wave Divider */}
        <div className="absolute -bottom-6 left-0 right-0 h-12 bg-background transform -skew-y-2"></div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-card p-6 rounded-xl shadow-md text-center border border-border/20">
            <p className="text-3xl font-bold text-primary mb-1">50+</p>
            <p className="text-sm text-muted-foreground">Websites Launched</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-md text-center border border-border/20">
            <p className="text-3xl font-bold text-primary mb-1">12</p>
            <p className="text-sm text-muted-foreground">Industries Served</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-md text-center border border-border/20">
            <p className="text-3xl font-bold text-primary mb-1">99%</p>
            <p className="text-sm text-muted-foreground">Client Satisfaction</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-md text-center border border-border/20">
            <p className="text-3xl font-bold text-primary mb-1">5</p>
            <p className="text-sm text-muted-foreground">Industry Awards</p>
          </div>
        </div>
      </div>

      {/* Main Portfolio Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${activeFilter === category
                  ? 'bg-primary text-primary-foreground shadow-md neon-glow-primary'
                  : 'bg-card border border-border hover:bg-muted'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full border border-border/20"
            >
              {/* Project Image with Overlay */}
              <div className="h-56 overflow-hidden relative">
                <div
                  className="w-full h-full bg-muted flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <a
                      href={project.liveLink}
                      className="mx-2 p-3 bg-background rounded-full text-primary hover:bg-background/90 transition-colors"
                      aria-label="View live site"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a
                      href={project.repoLink}
                      className="mx-2 p-3 bg-background rounded-full text-primary hover:bg-background/90 transition-colors"
                      aria-label="View repository"
                    >
                      <Code className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Placeholder for when images are not available */}
                  {!project.image.startsWith('http') && (
                    <span className="text-muted-foreground">Image Placeholder</span>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-sm font-medium rounded-full neon-glow-primary">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>

                  {/* Completion Date */}
                  <div className="mb-4 flex items-center">
                    <Monitor className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {project.completionDate}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technology Tags */}
                  <div className="mb-5">
                    <h4 className="text-sm font-medium mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA Button - Fixed alignment at the bottom */}
                <div className="mt-4">
                  <button
                    onClick={() => openCaseStudy(project)}
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors duration-300 neon-glow-primary"
                  >
                    View Case Study
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16">
            {activeFilter === 'All' ? (
              <div>
                <p className="text-xl text-muted-foreground mb-4">No website projects available yet.</p>
                <p className="text-muted-foreground">Please check back later or contact us to discuss your website project.</p>
              </div>
            ) : (
              <p className="text-xl text-muted-foreground">No projects found in the {activeFilter} category.</p>
            )}
          </div>
        )}
      </div>

      {/* Case Study Popup */}
      {isPopupOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border">
            {/* Popup Header */}
            <div className="sticky top-0 bg-card p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">{selectedProject.title} Case Study</h2>
              <button
                onClick={closeCaseStudy}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              {/* Project Image */}
              <div
                className="w-full h-64 bg-muted rounded-xl mb-6"
                style={{
                  backgroundImage: `url(${selectedProject.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>

              {/* Challenge */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">The Challenge</h3>
                <p className="text-muted-foreground">{selectedProject.caseStudy.challenge}</p>
              </div>

              {/* Solution */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">Our Solution</h3>
                <p className="text-muted-foreground">{selectedProject.caseStudy.solution}</p>
              </div>

              {/* Technologies Used */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-foreground">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">Results</h3>
                <p className="text-muted-foreground">{selectedProject.caseStudy.results}</p>
              </div>

              {/* Testimonial */}
              <div className="mb-6 bg-accent/10 p-6 rounded-xl border-l-4 border-accent">
                <h3 className="text-lg font-bold mb-2 text-foreground">Client Testimonial</h3>
                <p className="text-muted-foreground italic">"{selectedProject.caseStudy.testimonial}"</p>
              </div>

              {/* Screenshots */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Project Screenshots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.caseStudy.screens.map((screen, index) => (
                    <div
                      key={index}
                      className="bg-muted h-48 rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${screen})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Visit Links */}
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <a
                  href={selectedProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Visit Live Site
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <a
                  href={selectedProject.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-border"
                >
                  View Code
                  <Code className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Section */}
      <div className="bg-card py-16 mt-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-foreground">What Our Clients Say</h2>

            <div className="bg-accent/10 p-8 rounded-2xl shadow-lg relative border border-accent/20">
              {/* Quote Icon */}
              <div className="absolute -top-5 left-10 bg-accent text-accent-foreground p-2 rounded-full">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>

              <p className="text-lg italic text-muted-foreground mb-6">
                "formiqstudio transformed our outdated website into a modern, responsive platform that perfectly represents our brand.
                The team's attention to detail and technical expertise exceeded our expectations, and the results have been incredible for our business."
              </p>

              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-muted mr-4"></div>
                <div>
                  <p className="font-bold text-foreground">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Marketing Director, TechVision Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary-foreground">Ready to elevate your web presence?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Let's create a website that drives results and provides exceptional user experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-background hover:bg-background/90 text-foreground font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Start a Project
            </button>
            <button className="px-8 py-3 bg-transparent hover:bg-primary/20 text-primary-foreground border-2 border-primary-foreground font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              View More Work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitesPortfolio;