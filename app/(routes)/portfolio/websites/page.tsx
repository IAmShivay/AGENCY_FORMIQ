"use client";

import PageHeader from '@/components/studio/PageHeader';
import PageCTA from '@/components/studio/PageCTA';
import React, { useState, useEffect } from 'react';
import { Globe, Monitor, ExternalLink, X } from 'lucide-react';
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

        // If we have data from the database, use it
        if (dbProjects && dbProjects.length > 0) {
          // Convert DB model to component model
          const convertedProjects = dbProjects.map(convertToComponentModel);
          setWebsiteProjects(convertedProjects);
        } else {
          // Otherwise, set empty array (don't use fallback data)
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

  // Filter projects based on active category
  const filteredProjects = activeFilter === 'All'
    ? websiteProjects
    : websiteProjects.filter(project => project.category === activeFilter);

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="(01) Portfolio / Websites"
        title={<>Website <span className="text-primary">development</span></>}
        intro="Crafting exceptional digital experiences that drive results and engage users."
      />

      {/* Main Portfolio Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`min-h-11 px-5 rounded-full border text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${activeFilter === category
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-foreground hover:border-foreground/40'
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

        {/* Project Grid - Compact horizontal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {!loading && filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-[22px] overflow-hidden transition-all duration-300 border border-border flex flex-row h-[180px] md:h-[200px] hover:border-foreground/30"
            >
              {/* Project Image - Left side */}
              <div className="w-[140px] md:w-[200px] shrink-0 overflow-hidden relative">
                <div
                  className="w-full h-full bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!project.image.startsWith('http') && (
                    <Globe className="w-8 h-8 text-muted-foreground/40" />
                  )}
                </div>
                {/* Category Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary/90 text-primary-foreground text-[11px] font-medium rounded-full">
                  {project.category}
                </span>
                {/* Live link on hover */}
                {project.liveLink && project.liveLink !== '#' && (
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 p-2 bg-card/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                    title="Visit site">
                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                  </a>
                )}
              </div>

              {/* Content - Right side */}
              <div className="p-4 flex-1 flex flex-col min-w-0 justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded-full border border-primary/20">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[11px] text-muted-foreground">+{project.tags.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-2">
                  {project.completionDate && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Monitor className="w-3 h-3" /> {project.completionDate}
                    </span>
                  )}
                  <button
                    onClick={() => openCaseStudy(project)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-lg transition-colors"
                  >
                    Case Study <ExternalLink className="w-3 h-3" />
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
          <div className="bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border" data-lenis-prevent>
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

              {/* Visit Link */}
              {selectedProject.liveLink && selectedProject.liveLink !== '#' && (
                <div className="flex justify-center mt-8">
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-300 "
                  >
                    Visit Live Site
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PageCTA
        title="Ready to elevate your web presence?"
        subtitle="Let's create a website that drives results and provides exceptional user experiences."
        primary={{ label: "Start a project" }}
        secondary={{"label":"View more work","href":"/portfolio"}}
      />
    </div>
  );
};

export default WebsitesPortfolio;