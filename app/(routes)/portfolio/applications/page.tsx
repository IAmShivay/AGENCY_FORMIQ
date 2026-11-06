"use client";

import PageHeader from '@/components/studio/PageHeader';
import PageCTA from '@/components/studio/PageCTA';
import React, { useState, useEffect } from 'react';
import { AppProject, getAppProjects } from '@/lib/portfolio';
import { AppWindow, Smartphone, Globe, Code, ExternalLink, Search, X, Calendar, Layers } from 'lucide-react';
// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'ios':
      return <AppWindow className="w-4 h-4 text-primary" />;
    case 'android':
      return <Smartphone className="w-4 h-4 text-primary" />;
    case 'web':
      return <Globe className="w-4 h-4 text-primary" />;
    default:
      return <Code className="w-4 h-4 text-primary" />;
  }
};

const ApplicationsPortfolio = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [loading, setLoading] = useState(true);
  const [appProjects, setAppProjects] = useState<AppProject[]>([]);

  // State for project details popup
  const [selectedProject, setSelectedProject] = useState<AppProject | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to open project details popup
  const openProjectDetails = (project: AppProject) => {
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

  // Fetch app projects from the database
  useEffect(() => {
    async function fetchApps() {
      try {
        setLoading(true);
        const data = await getAppProjects();

        // If we have data from the database, use it
        if (data && data.length > 0) {
          setAppProjects(data);
        } else {
          // Otherwise, set empty array (don't use fallback data)
          setAppProjects([]);
          // Commented out fallback data usage
          // setAppProjects(fallbackAppProjects);
        }
      } catch (error) {
        console.error('Error fetching app projects:', error);
        // Set empty array on error (don't use fallback data)
        setAppProjects([]);
        // Commented out fallback data usage
        // setAppProjects(fallbackAppProjects);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  // Fallback application projects data
  const fallbackAppProjects = [
    {
      id: 1,
      title: 'Health & Fitness App',
      description: 'A comprehensive fitness tracking application with personalized workout plans, nutrition guidance, and progress analytics. Features include custom workout builder, meal planning, and social community support.',
      image: '/images/portfolio/app-1.jpg',
      tags: ['React Native', 'Firebase', 'Redux', 'Health API'],
      platforms: ['iOS', 'Android'],
      link: '#',
      features: ['Activity Tracking', 'Meal Planning', 'Progress Analytics', 'Community Forums'],
      year: '2024',
    },
    {
      id: 2,
      title: 'Financial Management Dashboard',
      description: 'Interactive dashboard for personal finance management with advanced data visualization, budget planning tools, and investment portfolio tracking. Includes bank account integration and expense categorization.',
      image: '/images/portfolio/app-2.jpg',
      tags: ['React', 'Node.js', 'D3.js', 'Express'],
      platforms: ['Web'],
      link: '#',
      features: ['Budget Planning', 'Investment Tracking', 'Expense Analytics', 'Financial Goals'],
      year: '2023',
    },
    {
      id: 3,
      title: 'Social Networking Platform',
      description: 'Feature-rich social platform with real-time messaging, content sharing, and personalized feeds. Supports video streaming, encrypted messaging, and customizable user profiles.',
      image: '/images/portfolio/app-3.jpg',
      tags: ['Flutter', 'Firebase', 'WebRTC', 'Cloud Functions'],
      platforms: ['iOS', 'Android', 'Web'],
      link: '#',
      features: ['Real-time Messaging', 'Content Sharing', 'Video Calls', 'Personalized Feed'],
      year: '2024',
    },
    {
      id: 4,
      title: 'E-Learning Platform',
      description: 'Comprehensive learning management system with course creation tools, interactive quizzes, progress tracking, and certification management for online education.',
      image: '/images/portfolio/app-4.jpg',
      tags: ['Next.js', 'MongoDB', 'Socket.io', 'AWS'],
      platforms: ['Web', 'iPad'],
      link: '#',
      features: ['Course Management', 'Interactive Assessments', 'Progress Tracking', 'Certification'],
      year: '2023',
    },
    {
      id: 5,
      title: 'Remote Team Collaboration Tool',
      description: 'All-in-one workspace for remote teams featuring task management, document collaboration, video conferencing, and team analytics to enhance productivity.',
      image: '/images/portfolio/app-5.jpg',
      tags: ['Vue.js', 'GraphQL', 'PostgreSQL', 'WebSockets'],
      platforms: ['Web', 'macOS', 'Windows'],
      link: '#',
      features: ['Task Management', 'Document Collaboration', 'Video Meetings', 'Team Analytics'],
      year: '2024',
    },
    {
      id: 6,
      title: 'Smart Home Control System',
      description: 'IoT application for controlling and automating home devices with customizable routines, energy usage monitoring, and voice command integration.',
      image: '/images/portfolio/app-6.jpg',
      tags: ['React Native', 'Node.js', 'MQTT', 'TensorFlow'],
      platforms: ['iOS', 'Android', 'Web'],
      link: '#',
      features: ['Device Control', 'Energy Monitoring', 'Voice Commands', 'Automation Rules'],
      year: '2023',
    },
  ];

  // Platform filter options
  const platforms = ['All', 'Web', 'iOS', 'Android', 'macOS', 'Windows', 'iPad'];

  // Filter projects based on search query and platform
  const filteredProjects = appProjects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform =
      selectedPlatform === 'All' ||
      project.platforms.includes(selectedPlatform);

    return matchesSearch && matchesPlatform;
  });

  // Platform icon selector
  const getPlatformIcon = (platform:any) => {
    switch(platform) {
      case 'iOS':
      case 'Android':
      case 'iPad':
        return <Smartphone className="w-4 h-4 mr-1" />;
      case 'Web':
        return <Globe className="w-4 h-4 mr-1" />;
      case 'macOS':
      case 'Windows':
        return <AppWindow className="w-4 h-4 mr-1" />;
      default:
        return <Code className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="bg-background text-foreground">
      <PageHeader
        eyebrow="(01) Portfolio / Applications"
        title={<>Application <span className="text-primary">portfolio</span></>}
        intro="Innovative digital solutions built with cutting-edge technologies for web and mobile platforms."
      >
        <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-3xl">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
            <label htmlFor="app-search" className="sr-only">Search applications</label>
            <input
              id="app-search"
              type="search"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-12 pl-11 pr-4 rounded-full bg-card border border-border text-base text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </div>
          <label htmlFor="app-platform" className="sr-only">Platform</label>
          <select
            id="app-platform"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="min-h-12 px-4 rounded-full bg-card border border-border text-base text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
      </PageHeader>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-8 text-muted-foreground">
            <span className="font-medium">Showing {filteredProjects.length} applications</span>
            {searchQuery && <span> matching "{searchQuery}"</span>}
            {selectedPlatform !== 'All' && <span> for {selectedPlatform} platform</span>}
          </div>
        )}

        {/* Projects Grid with Featured Project at Top */}
        <div className="grid grid-cols-1 gap-8">
          {/* Featured Project (first project in the list, full width) */}
          {filteredProjects.length > 0 && (
            <div className="bg-card rounded-[22px] overflow-hidden border border-border hover:border-foreground/30">
              <div className="grid md:grid-cols-2">
                <div className="h-72 md:h-full overflow-hidden">
                  <div
                    className="w-full h-full bg-muted flex items-center justify-center hover:scale-105 transition-transform duration-700"
                    style={{
                      backgroundImage: `url(${filteredProjects[0].image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!filteredProjects[0].image.startsWith('http') && (
                      <span className="text-muted-foreground">Image Placeholder</span>
                    )}
                  </div>
                </div>
                <div className="p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold px-3 py-1 bg-primary text-primary-foreground rounded-full">
                      Featured Project
                    </span>
                    <span className="text-sm font-medium bg-muted text-foreground px-3 py-1 rounded-full">
                      {filteredProjects[0].year}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    {filteredProjects[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6 flex-grow">
                    {filteredProjects[0].description}
                  </p>

                  {/* Tech Tags */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {filteredProjects[0].tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredProjects[0].features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Available On</h4>
                    <div className="flex flex-wrap gap-2">
                      {filteredProjects[0].platforms.map((platform, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {getPlatformIcon(platform)}
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => openProjectDetails(filteredProjects[0])}
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-300 mt-auto"
                  >
                    View Case Study
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Remaining Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.slice(1).map((project) => (
              <div
                key={project.id}
                className="bg-card rounded-[22px] overflow-hidden transition-all duration-300 flex flex-col border border-border hover:border-foreground/30"
              >
                <div className="relative">
                  <div className="h-56 overflow-hidden">
                    <div
                      className="w-full h-full bg-muted flex items-center justify-center hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url(${project.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {!project.image.startsWith('http') && (
                        <span className="text-muted-foreground">Image Placeholder</span>
                      )}
                    </div>
                  </div>

                  {/* Year Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-black/60 text-white text-sm font-medium rounded-full">
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Platforms with Icons */}
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.platforms.map((platform, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {getPlatformIcon(platform)}
                          {platform}
                        </span>
                      ))}
                    </div>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => openProjectDetails(project)}
                      className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                    >
                      View Project
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            <div className="text-center py-16 bg-card rounded-xl shadow">
              <AppWindow className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              {searchQuery || selectedPlatform !== 'All' ? (
                <>
                  <h3 className="text-2xl font-bold mb-2">No applications found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {setSearchQuery(''); setSelectedPlatform('All');}}
                    className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-2">No applications available yet</h3>
                  <p className="text-muted-foreground mb-6">
                    We're currently working on adding our application projects. Please check back later.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <PageCTA
        title="Have an application idea?"
        subtitle="Let's turn your vision into a powerful digital solution that users will love."
        primary={{ label: "Start your project" }}
        secondary={{"label":"View all work","href":"/portfolio"}}
      />

      {/* Project Details Popup */}
      {isPopupOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" data-lenis-prevent>
            {/* Popup Header */}
            <div className="sticky top-0 bg-card p-6 border-b border-border flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-foreground">{selectedProject.title}</h2>
              <button
                onClick={closeProjectDetails}
                className="p-2 rounded-full bg-muted hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              {/* Project Image */}
              <div
                className="w-full h-80 bg-muted rounded-xl mb-8"
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
                    <h3 className="text-xl font-bold mb-3 text-foreground">Project Overview</h3>
                    <p className="text-foreground">{selectedProject.description}</p>
                  </div>

                  {/* Features */}
                  {selectedProject.features && selectedProject.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-foreground">Key Features</h3>
                      <ul className="space-y-2">
                        {selectedProject.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 text-primary">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-foreground">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Project Metadata */}
                <div className="bg-muted p-6 rounded-xl space-y-4">
                  {/* Year */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Year</h4>
                      <p className="text-foreground">{selectedProject.year}</p>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="flex items-start gap-3">
                    <Layers className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Platforms</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedProject.platforms.map((platform, index) => (
                          <span key={index} className="inline-flex items-center gap-1 text-foreground">
                            {getPlatformIcon(platform)}
                            {platform}{index < selectedProject.platforms.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* External Link */}
                  {selectedProject.link && selectedProject.link !== '#' && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-6 w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit App
                    </a>
                  )}
                </div>
              </div>

              {/* App Screenshots - Placeholder for future enhancement */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-foreground">App Screenshots</h3>
                <div className="bg-muted rounded-xl p-8 text-center">
                  <Smartphone className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">App screenshots will be available soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPortfolio;