"use client";

import React, { useState, useEffect } from 'react';
import { Palette, ExternalLink, Search } from 'lucide-react';
import { DesignProject, getDesignProjects } from '@/lib/portfolio';

const DesignsPortfolio = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [designProjects, setDesignProjects] = useState<DesignProject[]>([]);

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
          // Commented out fallback data usage
          // setDesignProjects(fallbackDesignProjects);
        }
      } catch (error) {
        console.error('Error fetching design projects:', error);
        // Set empty array on error (don't use fallback data)
        setDesignProjects([]);
        // Commented out fallback data usage
        // setDesignProjects(fallbackDesignProjects);
      } finally {
        setLoading(false);
      }
    }

    fetchDesigns();
  }, []);

  // Fallback design projects data
  const fallbackDesignProjects: DesignProject[] = [
    {
      id: '1',
      title: 'Brand Identity System',
      description: 'Complete brand identity including logo, color palette, typography, and brand guidelines.',
      image: '/images/portfolio/design-1.jpg',
      category: 'Branding',
      client: 'TechStart Solutions',
      link: '#',
      year: '2024',
      services: ['Logo Design', 'Brand Guidelines', 'Marketing Materials']
    },
    {
      id: '2',
      title: 'E-Commerce UI Design',
      description: 'Modern and intuitive user interface design for an e-commerce platform.',
      image: '/images/portfolio/design-2.jpg',
      category: 'UI/UX',
      client: 'Fashion Forward',
      link: '#',
      year: '2023',
      services: ['UI Design', 'Wireframing', 'Prototyping']
    },
    {
      id: '3',
      title: 'Product Packaging Design',
      description: 'Eye-catching packaging design for a premium skincare product line.',
      image: '/images/portfolio/design-3.jpg',
      category: 'Packaging',
      client: 'Glow Essentials',
      link: '#',
      year: '2023',
      services: ['Packaging Design', 'Label Design', 'Product Photography']
    }
  ];

  // Category filter options
  const categories = ['All', 'Branding', 'UI/UX', 'Packaging', 'Print', 'Illustration'];

  // Filter projects based on search query and category
  const filteredProjects = designProjects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Function to get icon for service
  const getServiceIcon = (service: string) => {
    return <span className="w-4 h-4 mr-1">•</span>;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-500/10 via-primary/5 to-pink-500/10 dark:from-purple-500/20 dark:via-primary/15 dark:to-pink-500/20">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-6 bg-white/80 dark:bg-gray-800/80 p-3 rounded-2xl shadow-lg">
              <Palette className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-primary to-pink-500">
                Design Portfolio
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-6 max-w-3xl mx-auto">
              Explore our creative design work spanning branding, UI/UX, packaging, and more. Each project represents our commitment to aesthetic excellence and functional design.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
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
          <div className="mb-8 text-gray-600 dark:text-gray-400">
            <span className="font-medium">Showing {filteredProjects.length} designs</span>
            {searchQuery && <span> matching "{searchQuery}"</span>}
            {selectedCategory !== 'All' && <span> in {selectedCategory} category</span>}
          </div>
        )}

        {/* Design Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <div
                  className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <a
                      href={project.link}
                      className="p-3 bg-white rounded-full text-primary hover:bg-gray-100 transition-colors"
                      aria-label="View project"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-black/70 text-white text-sm font-medium rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>

                {/* Client & Year */}
                <div className="flex justify-between mb-4 text-sm">
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Client:</span> {project.client}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Year:</span> {project.year}
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                      >
                        {getServiceIcon(service)}
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Project Button */}
                <a
                  href={project.link}
                  className="inline-block w-full text-center px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 font-medium rounded-lg transition-colors mt-2"
                >
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow">
            <Palette className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            {searchQuery || selectedCategory !== 'All' ? (
              <>
                <h3 className="text-2xl font-bold mb-2">No designs found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                  className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-2">No design projects available yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We're currently working on adding our design portfolio. Please check back later or contact us to discuss your design project.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Call To Action */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need a design project?</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's create a visual identity that captures your brand's essence and connects with your audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Start Your Project
            </button>
            <button className="px-8 py-3 bg-white hover:bg-gray-100 text-primary border border-primary font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              View More Designs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignsPortfolio;
