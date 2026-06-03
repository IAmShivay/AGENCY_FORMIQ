"use client";
import React, { useState, useEffect } from 'react';
import { AppProject, getAppProjects } from '@/lib/portfolio';
import { AppWindow, Smartphone, Globe, Code, ExternalLink, Search, X, Calendar, User, Briefcase, Layers } from 'lucide-react';
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

        console.log('Fetched app projects:', data);

        // If we have data from the database, use it
        if (data && data.length > 0) {
          setAppProjects(data);
        } else {
          // Otherwise, set empty array (don't use fallback data)
          console.log('No app projects found in database');
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
    <div className="bg-background min-h-screen">
      {/* Hero Section with Interactive Elements */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 pt-28 md:pt-36 lg:pt-44">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-6 bg-card/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-border/20">
              <AppWindow className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold premium-text-gradient">
                Application Portfolio
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Innovative digital solutions built with cutting-edge technologies for web and mobile platforms.
            </p>

            {/* Search & Filter Bar */}
            <div className="bg-card rounded-xl shadow-lg p-2 md:p-4 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto border border-border/20">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex-shrink-0">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 rounded-lg bg-muted border-0 focus:ring-2 focus:ring-primary text-foreground"
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path
              fill="currentColor"
              className="text-background"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,69.3C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
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
            <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border">
              <div className="grid md:grid-cols-2">
                <div className="h-72 md:h-full overflow-hidden">
                  <div
                    className="w-full h-full bg-muted flex items-center justify-center transform hover:scale-105 transition-transform duration-700"
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
                    <span className="text-sm font-bold px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full">
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
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {filteredProjects[0].tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary/70 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredProjects[0].features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Available On</h4>
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
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-auto"
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
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative">
                  <div className="h-56 overflow-hidden">
                    <div
                      className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transform hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url(${project.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {!project.image.startsWith('http') && (
                        <span className="text-gray-400">Image Placeholder</span>
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
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
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
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
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
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow">
              <AppWindow className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              {searchQuery || selectedPlatform !== 'All' ? (
                <>
                  <h3 className="text-2xl font-bold mb-2">No applications found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
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
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We're currently working on adding our application projects. Please check back later.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">20+</div>
              <div className="text-gray-600 dark:text-gray-300">Applications Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5M+</div>
              <div className="text-gray-600 dark:text-gray-300">User Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">12</div>
              <div className="text-gray-600 dark:text-gray-300">Industry Awards</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-300">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="bg-primary/5 dark:bg-primary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Have an application idea?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's turn your vision into a powerful digital solution that users will love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Start Your Project
            </button>
            <button className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              View All Applications
            </button>
          </div>
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

                  {/* Features */}
                  {selectedProject.features && selectedProject.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Key Features</h3>
                      <ul className="space-y-2">
                        {selectedProject.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 text-primary">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Technologies Used</h3>
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
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl space-y-4">
                  {/* Year */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Year</h4>
                      <p className="text-gray-700 dark:text-gray-300">{selectedProject.year}</p>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="flex items-start gap-3">
                    <Layers className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Platforms</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedProject.platforms.map((platform, index) => (
                          <span key={index} className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">
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
                      className="flex items-center justify-center gap-2 mt-6 w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit App
                    </a>
                  )}
                </div>
              </div>

              {/* App Screenshots - Placeholder for future enhancement */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">App Screenshots</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center">
                  <Smartphone className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">App screenshots will be available soon.</p>
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