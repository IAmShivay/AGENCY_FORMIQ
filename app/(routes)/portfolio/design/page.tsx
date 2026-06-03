'use client'
import React, { useState, useEffect } from 'react';
import { Moon, Loader2, Palette, X, Calendar, User, Briefcase, ExternalLink } from 'lucide-react';
import { DesignProject, getDesignProjects } from '@/lib/portfolio';


const DesignPortfolio = () => {
  // Filter categories
  const categories = ['All', 'Branding', 'UI/UX Design', 'Graphic Design'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [designProjects, setDesignProjects] = useState<DesignProject[]>([]);

  // State for project details popup
  const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to open project details popup
  const openProjectDetails = (project: DesignProject) => {
    setSelectedProject(project);
    setIsPopupOpen(true);
    // Prevent scrolling when popup is open
    document.body.style.overflow = 'hidden';
  };

  // Function to close project details popup
  const closeProjectDetails = () => {
    setIsPopupOpen(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  // Fetch design projects from the database
  useEffect(() => {
    async function fetchDesigns() {
      try {
        setLoading(true);
        const data = await getDesignProjects();

        console.log('Fetched design projects:', data);

        // If we have data from the database, use it
        if (data && data.length > 0) {
          setDesignProjects(data);
        } else {
          // Otherwise, set empty array (don't use fallback data)
          console.log('No design projects found in database');
          setDesignProjects([]);
        }
      } catch (error) {
        console.error('Error fetching design projects:', error);
        // Set empty array on error (don't use fallback data)
        setDesignProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDesigns();
  }, []);

  // Fallback design projects data (commented out - for reference only)
  /*
  const fallbackDesignProjects = [
    {
      id: 1,
      title: 'Brand Identity System',
      description: 'Complete brand identity including logo, color palette, typography, and brand guidelines.',
      image: '/images/portfolio/design-1.jpg',
      category: 'Branding',
      client: 'TechStart Solutions',
      link: '#',
      year: '2024',
      services: ['Logo Design', 'Brand Guidelines', 'Marketing Materials'],
    },
    {
      id: 2,
      title: 'E-Commerce UI/UX Design',
      description: 'User-centered design for an e-commerce platform with focus on conversion optimization.',
      image: '/images/portfolio/design-2.jpg',
      category: 'UI/UX Design',
      client: 'Fashion Retailer',
      link: '#',
      year: '2023',
      services: ['User Research', 'Wireframing', 'Prototyping', 'User Testing'],
    },
    {
      id: 3,
      title: 'Mobile App Interface',
      description: 'Intuitive and visually appealing interface design for a productivity application.',
      image: '/images/portfolio/design-3.jpg',
      category: 'UI/UX Design',
      client: 'Productivity Tools Inc.',
      link: '#',
      year: '2024',
      services: ['Mobile UI Design', 'Interaction Design', 'Prototyping'],
    },
    {
      id: 4,
      title: 'Marketing Campaign Materials',
      description: 'Cohesive design system for digital and print marketing campaign materials.',
      image: '/images/portfolio/design-4.jpg',
      category: 'Graphic Design',
      client: 'Wellness Brand',
      link: '#',
      year: '2023',
      services: ['Print Design', 'Digital Assets', 'Social Media Graphics'],
    },
    {
      id: 5,
      title: 'Financial App Redesign',
      description: 'Complete redesign of a financial management application focusing on data visualization and accessibility.',
      image: '/images/portfolio/design-5.jpg',
      category: 'UI/UX Design',
      client: 'FinTrack Solutions',
      link: '#',
      year: '2024',
      services: ['UX Research', 'UI Design', 'Design System'],
    },
    {
      id: 6,
      title: 'Corporate Identity Refresh',
      description: 'Modernizing an established brand while maintaining brand equity and recognition.',
      image: '/images/portfolio/design-6.jpg',
      category: 'Branding',
      client: 'Legacy Industries',
      link: '#',
      year: '2024',
      services: ['Brand Strategy', 'Visual Identity', 'Brand Guidelines'],
    },
  ];
  */

  // Filter projects based on active category
  const filteredProjects = activeFilter === 'All'
    ? designProjects
    : designProjects.filter(project => project.category === activeFilter);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10 pt-28 md:pt-36 lg:pt-44">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Palette className="w-8 h-8 text-primary mr-2" />
              <h1 className="text-5xl md:text-6xl font-bold premium-text-gradient">
                Design Portfolio
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transforming ideas into impactful visuals that elevate brands and enhance user experiences.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-6 left-0 right-0 h-12 bg-background transform -skew-y-2"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
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
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className="h-64 overflow-hidden relative">
                <div
                  className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Placeholder for when images are not available */}
                  {!project.image.startsWith('http') && (
                    <span className="text-gray-400">Image Placeholder</span>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-black/70 text-white text-sm font-medium rounded-full">
                    {project.category}
                  </span>
                </div>

                {/* Year Tag */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-primary/90 text-white text-sm font-bold rounded-md">
                    {project.year}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>

                {/* Client Info */}
                <div className="flex items-center mb-4 text-sm">
                  <span className="font-medium mr-2">Client:</span>
                  <span className="text-gray-600 dark:text-gray-400">{project.client}</span>
                </div>

                {/* Services Tags */}
                <div className="mb-5">
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => openProjectDetails(project)}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors duration-300"
                >
                  View Project Details
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow">
            <Palette className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            {activeFilter === 'All' ? (
              <div>
                <h3 className="text-2xl font-bold mb-3">No design projects available yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We're currently working on adding our design portfolio. Please check back later or contact us to discuss your design project.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold mb-3">No projects found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  No design projects found in the {activeFilter} category.
                </p>
                <button
                  onClick={() => setActiveFilter('All')}
                  className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors"
                >
                  View All Designs
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call To Action */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 py-16 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your brand?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's collaborate to create designs that elevate your business and connect with your audience.
          </p>
          <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Start a Project
          </button>
        </div>
      </div>

      {/* Project Details Popup */}
      {isPopupOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProject.title}</h2>
              <button
                onClick={closeProjectDetails}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              {/* Project Image */}
              <div
                className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"
                style={{
                  backgroundImage: `url(${selectedProject.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Left Column - Project Details */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Project Overview</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedProject.description}</p>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Services Provided</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Project Metadata */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl space-y-4">
                  {/* Client */}
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Client</h4>
                      <p className="text-gray-700 dark:text-gray-300">{selectedProject.client}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Category</h4>
                      <p className="text-gray-700 dark:text-gray-300">{selectedProject.category}</p>
                    </div>
                  </div>

                  {/* Year */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Year</h4>
                      <p className="text-gray-700 dark:text-gray-300">{selectedProject.year}</p>
                    </div>
                  </div>

                  {/* External Link */}
                  {selectedProject.link && selectedProject.link !== '#' && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-4 w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Project
                    </a>
                  )}
                </div>
              </div>

              {/* Additional Project Images - Placeholder for future enhancement */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Project Gallery</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center">
                  <Palette className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Additional project images will be available soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignPortfolio;