'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Wrench, BarChart4, Terminal, ExternalLink, Search, Filter, ArrowRight, ChevronRight, Star, Zap, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import './software-tools.css';

// Define the tool interface
interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  link: string;
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Enterprise';
  image?: string;
}

export default function SoftwareToolsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample tools data
  const tools: Tool[] = [
    {
      id: '1',
      name: 'Productivity Suite',
      description: 'All-in-one productivity solution for teams and businesses with document management, spreadsheets, and presentations.',
      category: 'productivity',
      tags: ['Collaboration', 'Documents', 'Team Management'],
      link: '#',
      pricing: 'Freemium',
    },
    {
      id: '2',
      name: 'SEO Analyzer',
      description: 'Comprehensive SEO analysis tool to improve your website ranking and visibility in search engines.',
      category: 'marketing',
      tags: ['SEO', 'Analytics', 'Reporting'],
      link: '#',
      pricing: 'Paid',
    },
    {
      id: '3',
      name: 'Code Repository',
      description: 'Version control system for tracking changes in source code during software development.',
      category: 'development',
      tags: ['Version Control', 'Collaboration', 'Code Management'],
      link: '#',
      pricing: 'Free',
    },
    {
      id: '4',
      name: 'Project Management Tool',
      description: 'Manage projects, track progress, and collaborate with team members in real-time.',
      category: 'productivity',
      tags: ['Task Management', 'Team Collaboration', 'Gantt Charts'],
      link: '#',
      pricing: 'Freemium',
    },
    {
      id: '5',
      name: 'Email Marketing Platform',
      description: 'Create, send, and analyze email campaigns with advanced automation and segmentation.',
      category: 'marketing',
      tags: ['Email Campaigns', 'Automation', 'Analytics'],
      link: '#',
      pricing: 'Paid',
    },
    {
      id: '6',
      name: 'Code Editor',
      description: 'Powerful code editor with syntax highlighting, debugging, and version control integration.',
      category: 'development',
      tags: ['Coding', 'Debugging', 'Extensions'],
      link: '#',
      pricing: 'Free',
    },
  ];

  // Filter tools based on active category and search query
  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Get the icon for a category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity':
        return <Wrench className="h-5 w-5" />;
      case 'marketing':
        return <BarChart4 className="h-5 w-5" />;
      case 'development':
        return <Terminal className="h-5 w-5" />;
      default:
        return <Code className="h-5 w-5" />;
    }
  };

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
      <div className="relative bg-gradient-to-br from-primary/5 via-primary/5 to-white dark:from-gray-900 dark:via-primary/5 dark:to-gray-900 min-h-[90vh] flex items-center py-20 px-4">
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
            {/* Code symbols */}
            <motion.div
              className="absolute top-1/4 left-1/4 text-primary/20 dark:text-primary/10 text-6xl font-mono"
              initial={{ y: 0, rotate: 0 }}
              animate={{ y: [-15, 0, -15], rotate: [5, 0, 5] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              &lt;/&gt;
            </motion.div>
            <motion.div
              className="absolute bottom-1/3 right-1/4 text-primary/20 dark:text-primary/10 text-5xl font-mono"
              initial={{ y: 0, rotate: 0 }}
              animate={{ y: [15, 0, 15], rotate: [-5, 0, -5] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              {'{}'}
            </motion.div>

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
              <Terminal className="w-8 h-8 text-primary/70" />
            </motion.div>
            <motion.div
              className="absolute top-2/3 right-1/3 p-4 bg-white/30 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-xl"
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
                    delay: 1.5
                  }
                }
              }}
            >
              <BarChart4 className="w-8 h-8 text-primary/70" />
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side content */}
            <motion.div
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Next-Generation Tools</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent leading-tight">
                Supercharge Your <br />
                Digital Workflow
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Discover our suite of cutting-edge software tools designed to enhance productivity,
                streamline marketing efforts, and accelerate development workflows.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-8 py-6 text-base font-medium group relative overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    Explore All Tools
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-medium border-2 hover:bg-primary/5 transition-colors duration-300">
                  Request Custom Solution
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Trusted by 1,000+ companies</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">From startups to enterprise organizations</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side 3D-like card stack */}
            <motion.div
              className="relative h-[500px] hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Main featured tool card */}
              <motion.div
                className="absolute top-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 z-30"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="h-40 bg-gradient-to-r from-primary to-primary relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                  <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full">
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  </div>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white">
                    Featured Tool
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      AI-Powered Productivity Suite
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Boost your team's efficiency with our all-in-one productivity solution powered by advanced AI capabilities.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                        New
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary/70 dark:border-primary/20">
                        AI-Powered
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5">
                      Learn more
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Background stacked cards for 3D effect */}
              <div className="absolute top-10 right-10 w-full max-w-md h-[300px] bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-lg z-20 transform rotate-[-6deg]"></div>
              <div className="absolute top-16 right-5 w-full max-w-md h-[300px] bg-gray-200 dark:bg-gray-600 rounded-2xl shadow-lg z-10 transform rotate-[-12deg]"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-7xl mx-auto glass-effect rounded-2xl shadow-xl p-6 md:p-8 -mt-20 relative z-20 border border-white/20 dark:border-gray-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-1/2 xl:w-2/5">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary/70" />
              </div>
              <input
                type="text"
                placeholder="Search for tools, features, or categories..."
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

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/30 dark:bg-gray-800/30 rounded-full backdrop-blur-sm">
                <Filter size={16} className="text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories</span>
              </div>

              <Tabs
                defaultValue="all"
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-auto bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm p-1.5 rounded-full border border-white/10 dark:border-gray-700/10">
                  <TabsTrigger
                    value="all"
                    className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm px-4 py-2 text-sm transition-all duration-200"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="productivity"
                    className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm px-4 py-2 text-sm transition-all duration-200"
                  >
                    Productivity
                  </TabsTrigger>
                  <TabsTrigger
                    value="marketing"
                    className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm px-4 py-2 text-sm transition-all duration-200"
                  >
                    Marketing
                  </TabsTrigger>
                  <TabsTrigger
                    value="development"
                    className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm px-4 py-2 text-sm transition-all duration-200"
                  >
                    Development
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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
              <h2 className="text-sm font-medium text-primary uppercase tracking-wider">Browse Our Collection</h2>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white animated-gradient-text">
              {activeCategory === 'all' ? 'All Tools' :
               activeCategory === 'productivity' ? 'Productivity Tools' :
               activeCategory === 'marketing' ? 'Marketing Tools' : 'Development Tools'}
            </h2>
          </motion.div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  className="group relative glass-effect rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-800/30 hover:border-primary/30 dark:hover:border-primary/30 hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Decorative gradient top */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-primary to-accent transform origin-left group-hover:scale-x-100 scale-x-0 transition-transform duration-500"></div>

                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.05] dark:group-hover:opacity-[0.08] transition-opacity duration-500"></div>

                  <div className="relative p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="p-3.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm"
                          whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                        >
                          {getCategoryIcon(tool.category)}
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                          {tool.name}
                        </h3>
                      </div>
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${getPricingColor(tool.pricing)}`}>
                        {tool.pricing}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-8 line-clamp-3">
                      {tool.description}
                    </p>

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
                      <Link
                        href={`/software-tools/${tool.category}`}
                        className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors duration-200"
                      >
                        View details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                      <Button variant="outline" size="sm" className="rounded-full border-white/30 dark:border-gray-700/30 backdrop-blur-sm" asChild>
                        <Link
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 group-hover:text-primary transition-colors duration-200"
                        >
                          Visit <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                We couldn't find any tools matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                variant="outline"
                className="rounded-full border-white/30 dark:border-gray-700/30 backdrop-blur-sm"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
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
                initial={{ scale: 1, opacity: 0.1 }}
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.1, 0.2] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              <motion.div
                className="absolute bottom-0 left-1/3 w-[35rem] h-[35rem] rounded-full bg-white/20 blur-3xl"
                initial={{ scale: 1, opacity: 0.1 }}
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.1, 0.15] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              ></motion.div>

              {/* Grid pattern */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

              {/* Floating elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-20 right-[20%] p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
                  initial={{ y: 0 }}
                  animate={{ y: [-15, 0, -15] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Code className="w-8 h-8 text-white/70" />
                </motion.div>
                <motion.div
                  className="absolute bottom-20 left-[15%] p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
                  initial={{ y: 0 }}
                  animate={{ y: [15, 0, 15] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Terminal className="w-8 h-8 text-white/70" />
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
                  Need a Custom Software Solution?
                </motion.h2>

                <motion.p
                  className="text-white/90 text-lg mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  We can develop custom software tools tailored to your specific business needs.
                  Our team of expert developers will work with you to create solutions that streamline
                  your workflows and boost productivity.
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
                        <Zap className="w-6 h-6 text-yellow-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Custom Development</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-4">
                      Tailored solutions built specifically for your business needs and workflows.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {['Personalized Approach', 'Expert Developers', 'Ongoing Support'].map((feature, i) => (
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
