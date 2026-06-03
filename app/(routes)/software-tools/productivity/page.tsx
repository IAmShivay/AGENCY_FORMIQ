'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, ExternalLink, ArrowLeft, Search, Filter, ArrowRight, ChevronRight, Star, Zap, Sparkles, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import '../software-tools.css';

// Define the tool interface
interface Tool {
  id: string;
  name: string;
  description: string;
  features: string[];
  tags: string[];
  link: string;
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Enterprise';
  image?: string;
}

export default function ProductivityToolsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample productivity tools data
  const tools: Tool[] = [
    {
      id: '1',
      name: 'Productivity Suite',
      description: 'All-in-one productivity solution for teams and businesses with document management, spreadsheets, and presentations.',
      features: [
        'Real-time document collaboration',
        'Cloud storage and file sharing',
        'Integrated calendar and task management',
        'Advanced spreadsheet functionality',
        'Professional presentation tools'
      ],
      tags: ['Collaboration', 'Documents', 'Team Management'],
      link: '#',
      pricing: 'Freemium',
    },
    {
      id: '2',
      name: 'Project Management Tool',
      description: 'Manage projects, track progress, and collaborate with team members in real-time.',
      features: [
        'Kanban boards and Gantt charts',
        'Task assignment and tracking',
        'Time tracking and reporting',
        'File sharing and commenting',
        'Integration with other productivity tools'
      ],
      tags: ['Task Management', 'Team Collaboration', 'Gantt Charts'],
      link: '#',
      pricing: 'Freemium',
    },
    {
      id: '3',
      name: 'Note-Taking App',
      description: 'Capture ideas, organize notes, and access them from any device.',
      features: [
        'Rich text formatting',
        'Web clipper for saving articles',
        'Document scanning',
        'Cross-platform synchronization',
        'Powerful search functionality'
      ],
      tags: ['Notes', 'Organization', 'Cross-platform'],
      link: '#',
      pricing: 'Free',
    },
    {
      id: '4',
      name: 'Time Management Tool',
      description: 'Track time spent on tasks and projects to improve productivity and billing accuracy.',
      features: [
        'Automatic time tracking',
        'Project-based time allocation',
        'Detailed reports and analytics',
        'Invoicing integration',
        'Team productivity insights'
      ],
      tags: ['Time Tracking', 'Productivity', 'Reporting'],
      link: '#',
      pricing: 'Paid',
    },
  ];

  // Filter tools based on search query
  const filteredTools = tools.filter(tool => {
    return searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tool.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Get the color for a pricing badge
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'Free':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Freemium':
        return 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary/70';
      case 'Paid':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Enterprise':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Define animation variants for floating icons
  const floatingIconVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 0, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section with advanced 3D-like elements */}
      <div className="relative bg-gradient-to-br from-primary/5 via-primary/5 to-white dark:from-gray-900 dark:via-primary/5 dark:to-gray-900 min-h-[70vh] flex items-center py-20 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-primary/70 to-primary blur-3xl dark:opacity-20"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-l from-accent to-purple-500 blur-3xl dark:opacity-20"
          ></motion.div>

          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Tool icons */}
            <motion.div
              className="absolute top-1/3 right-1/5 p-4 bg-white/30 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-xl"
              initial="initial"
              animate="animate"
              variants={floatingIconVariants}
            >
              <Wrench className="w-8 h-8 text-primary/70" />
            </motion.div>
            <motion.div
              className="absolute bottom-1/4 left-1/5 p-4 bg-white/30 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-xl"
              initial="initial"
              animate="animate"
              variants={{
                initial: { y: 0 },
                animate: {
                  y: [-10, 0, -10],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }
                }
              }}
            >
              <CheckCircle className="w-8 h-8 text-green-500/70" />
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* Back link */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/software-tools"
              className="inline-flex items-center px-4 py-2 rounded-full glass-effect text-primary hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors shadow-sm border border-white/20 dark:border-gray-700/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Tools
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side content */}
            <motion.div
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full shadow-sm mb-6 border border-white/20 dark:border-gray-700/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Productivity Solutions</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent leading-tight">
                Productivity Tools
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Boost your efficiency and streamline workflows with our selection of powerful productivity tools.
                From project management to document collaboration, we have solutions for every need.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-6 py-5 text-base font-medium group relative overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    Explore All Tools
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-6 py-5 text-base font-medium border-2 hover:bg-primary/5 transition-colors duration-300">
                  Request Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Right side illustration */}
            <motion.div
              className="relative h-[400px] hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="absolute top-0 right-0 w-full max-w-md h-[400px] glass-effect rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/20">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Task Manager Pro</h3>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Popular
                    </Badge>
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Task list visualization */}
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 dark:border-gray-700/20 flex items-center gap-3"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + (i * 0.2) }}
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                          {i === 1 && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                        </div>
                        <div className="flex-1">
                          <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Chart visualization */}
                    <motion.div
                      className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 dark:border-gray-700/20"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Productivity Score</div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ delay: 1.5, duration: 1 }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Background stacked cards for 3D effect */}
              <div className="absolute top-10 right-10 w-full max-w-md h-[300px] bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-lg z-20 transform rotate-[-6deg]"></div>
              <div className="absolute top-16 right-5 w-full max-w-md h-[300px] bg-gray-200 dark:bg-gray-600 rounded-2xl shadow-lg z-10 transform rotate-[-12deg]"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-7xl mx-auto glass-effect rounded-2xl shadow-xl p-6 md:p-8 -mt-20 relative z-20 border border-white/20 dark:border-gray-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-2/3">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary/70" />
              </div>
              <input
                type="text"
                placeholder="Search for productivity tools..."
                className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <motion.div
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                  onClick={() => setSearchQuery('')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/30 dark:bg-gray-800/30 rounded-full backdrop-blur-sm">
                <Filter size={16} className="text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
              </div>

              <select
                className="bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm shadow-sm text-sm"
                defaultValue="popular"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary rounded-full"></div>
              <h2 className="text-sm font-medium text-primary uppercase tracking-wider">Productivity Solutions</h2>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white animated-gradient-text">
              Available Productivity Tools
            </h2>
          </motion.div>

          {filteredTools.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  className="group relative glass-effect rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-800/30 hover:border-primary/30 dark:hover:border-primary/30 hover:-translate-y-2 card-3d"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Decorative gradient top */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-primary to-accent transform origin-left group-hover:scale-x-100 scale-x-0 transition-transform duration-500"></div>

                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.05] dark:group-hover:opacity-[0.08] transition-opacity duration-500"></div>

                  <div className="card-3d-inner relative p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="p-3.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm"
                          whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                        >
                          <Wrench className="h-5 w-5" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                          {tool.name}
                        </h3>
                      </div>
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${getPricingColor(tool.pricing)}`}>
                        {tool.pricing}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {tool.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-medium text-sm mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tool.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 group/feature">
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover/feature:bg-primary/20 transition-colors duration-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {tool.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-white/30 dark:border-gray-700/30 hover:border-primary/50 transition-colors duration-200 backdrop-blur-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/20 dark:border-gray-700/30">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">5.0</span>
                      </div>

                      <Button variant="default" size="sm" className="rounded-full" asChild>
                        <Link
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 group-hover:bg-primary transition-colors duration-200"
                        >
                          Learn More <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="glass-effect rounded-2xl p-16 text-center border border-white/20 dark:border-gray-800/30 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm mb-6 shadow-inner">
                <Search className="h-8 w-8 text-primary/70" />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-4">No tools found</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
                We couldn&apos;t find any productivity tools matching your search criteria. Try adjusting your search terms.
              </p>
              <Button
                variant="outline"
                className="rounded-full border-white/30 dark:border-gray-700/30 backdrop-blur-sm"
                onClick={() => setSearchQuery('')}
              >
                Reset Search
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <motion.div
          className="max-w-7xl mx-auto relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative bg-gradient-to-br from-primary/90 via-primary/90 to-accent/90 rounded-3xl overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-24 -right-24 w-[30rem] h-[30rem] rounded-full bg-white/20 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              ></motion.div>
              <motion.div
                className="absolute bottom-0 left-1/3 w-[35rem] h-[35rem] rounded-full bg-white/20 blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.15, 0.1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              ></motion.div>

              {/* Grid pattern */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

              {/* Floating elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-20 right-[20%] p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                >
                  <Wrench className="w-8 h-8 text-white/70" />
                </motion.div>
                <motion.div
                  className="absolute bottom-20 left-[15%] p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                >
                  <CheckCircle className="w-8 h-8 text-white/70" />
                </motion.div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 p-12 md:p-16 lg:p-20">
              <div className="text-left md:max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
                >
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white">Custom Development</span>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Need a Custom Productivity Solution?
                </motion.h2>

                <motion.p
                  className="text-white/90 text-lg mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  We can develop custom productivity tools tailored to your specific business workflows.
                  Our team of expert developers will work with you to create solutions that streamline
                  your operations and boost efficiency.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/contact" className="flex items-center gap-2">
                      Get in Touch <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 py-6 text-white border-white/40 hover:bg-white/10 hover:border-white transition-all duration-300"
                    asChild
                  >
                    <Link href="/services">View Services</Link>
                  </Button>
                </motion.div>

                <motion.div
                  className="mt-12 flex items-center gap-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    ))}
                  </div>
                  <div className="text-white/90 text-sm">
                    Rated 5.0/5.0 from over 100+ customers
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="hidden lg:block relative w-80 h-80"
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {/* 3D-like stacked cards */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl"></div>

                {/* Content card */}
                <div className="absolute inset-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-white/20">
                        <Wrench className="w-6 h-6 text-yellow-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Productivity Suite</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-4">
                      Custom productivity solutions designed specifically for your business workflows.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {['Task Management', 'Team Collaboration', 'Process Automation'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <span className="text-sm text-white/90">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
