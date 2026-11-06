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
        return 'bg-muted text-foreground';
      case 'Freemium':
        return 'bg-primary/10 text-primary';
      case 'Paid':
        return 'bg-muted text-foreground';
      case 'Enterprise':
        return 'bg-muted text-foreground';
      default:
        return 'bg-muted text-foreground';
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
      <div className="relative bg-muted/50 min-h-[90vh] flex items-center py-20 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">

          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Code symbols */}
            <motion.div
              className="absolute top-1/4 left-1/4 text-primary/20 text-6xl font-mono"
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
              className="absolute bottom-1/3 right-1/4 text-primary/20 text-5xl font-mono"
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
              className="absolute top-1/3 right-1/5 p-4 bg-primary-foreground/30 backdrop-blur-md rounded-2xl shadow-xl"
              initial="initial"
              animate="animate"
              variants={floatingIconVariants}
            >
              <Wrench className="w-8 h-8 text-primary/70" />
            </motion.div>
            <motion.div
              className="absolute bottom-1/4 left-1/5 p-4 bg-primary-foreground/30 backdrop-blur-md rounded-2xl shadow-xl"
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
              className="absolute top-2/3 right-1/3 p-4 bg-primary-foreground/30 backdrop-blur-md rounded-2xl shadow-xl"
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
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Next-Generation Tools</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
                Supercharge Your <br />
                Digital Workflow
              </motion.h1>

              <motion.p variants={itemVariants} className="text-xl text-foreground mb-8 leading-relaxed">
                Discover our suite of cutting-edge software tools designed to enhance productivity,
                streamline marketing efforts, and accelerate development workflows.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-8 py-6 text-base font-medium group relative overflow-hidden">
                  <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-foreground bg-muted flex items-center justify-center text-xs font-medium">
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Trusted by 1,000+ companies</div>
                  <div className="text-xs text-muted-foreground">From startups to enterprise organizations</div>
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
                className="absolute top-0 right-0 w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden border border-border z-30"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="h-40 bg-primary relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                  <div className="absolute top-4 right-4 p-2 bg-primary-foreground/20 backdrop-blur-md rounded-full">
                    <Star className="w-5 h-5 text-muted-foreground fill-current" />
                  </div>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-primary-foreground/20 backdrop-blur-md rounded-full text-xs font-medium text-primary-foreground">
                    Featured Tool
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      AI-Powered Productivity Suite
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Boost your team's efficiency with our all-in-one productivity solution powered by advanced AI capabilities.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-muted text-foreground border-border">
                        New
                      </Badge>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
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
              <div className="absolute top-10 right-10 w-full max-w-md h-[300px] bg-muted rounded-2xl shadow-lg z-20 transform rotate-[-6deg]"></div>
              <div className="absolute top-16 right-5 w-full max-w-md h-[300px] bg-muted rounded-2xl shadow-lg z-10 transform rotate-[-12deg]"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-7xl mx-auto glass-effect rounded-2xl shadow-xl p-6 md:p-8 -mt-20 relative z-20 border border-primary-foreground/20"
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
                className="w-full pl-12 pr-4 py-4 bg-primary-foreground/50 border border-primary-foreground/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 backdrop-blur-sm shadow-sm"
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
                  <div className="p-1 rounded-full hover:bg-muted transition-colors">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/30 rounded-full backdrop-blur-sm">
                <Filter size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Categories</span>
              </div>

              <Tabs
                defaultValue="all"
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-auto bg-primary-foreground/20 backdrop-blur-sm p-1.5 rounded-full border border-primary-foreground/10">
                  <TabsTrigger
                    value="all"
                    className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm px-4 py-2 text-sm transition-all duration-200"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="productivity"
                    className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm px-4 py-2 text-sm transition-all duration-200"
                  >
                    Productivity
                  </TabsTrigger>
                  <TabsTrigger
                    value="marketing"
                    className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm px-4 py-2 text-sm transition-all duration-200"
                  >
                    Marketing
                  </TabsTrigger>
                  <TabsTrigger
                    value="development"
                    className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm px-4 py-2 text-sm transition-all duration-200"
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
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <h2 className="text-sm font-medium text-primary uppercase tracking-wider">Browse Our Collection</h2>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
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
                  className="group relative glass-effect rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-primary-foreground/20 hover:border-primary/30 hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Decorative gradient top */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-primary transform origin-left group-hover:scale-x-100 scale-x-0 transition-transform duration-500"></div>

                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500"></div>

                  <div className="relative p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="p-3.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm"
                          whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                        >
                          {getCategoryIcon(tool.category)}
                        </motion.div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {tool.name}
                        </h3>
                      </div>
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${getPricingColor(tool.pricing)}`}>
                        {tool.pricing}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-8 line-clamp-3">
                      {tool.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {tool.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-primary-foreground/50 text-foreground border-primary-foreground/30 hover:border-primary/50 transition-colors duration-200 backdrop-blur-sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-primary-foreground/20">
                      <Link
                        href={`/software-tools/${tool.category}`}
                        className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors duration-200"
                      >
                        View details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                      <Button variant="outline" size="sm" className="rounded-full border-primary-foreground/30 backdrop-blur-sm" asChild>
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
              className="glass-effect rounded-2xl p-16 text-center border border-primary-foreground/20 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/30 backdrop-blur-sm mb-6 shadow-inner">
                <Search className="h-8 w-8 text-primary/70" />
              </div>
              <h3 className="text-2xl font-medium text-foreground mb-4">No tools found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn't find any tools matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                variant="outline"
                className="rounded-full border-primary-foreground/30 backdrop-blur-sm"
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
          <div className="relative bg-primary rounded-3xl overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">

              {/* Grid pattern */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

              {/* Floating elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-20 right-[20%] p-4 bg-primary-foreground/10 backdrop-blur-md rounded-2xl shadow-xl border border-primary-foreground/20"
                  initial={{ y: 0 }}
                  animate={{ y: [-15, 0, -15] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Code className="w-8 h-8 text-primary-foreground/70" />
                </motion.div>
                <motion.div
                  className="absolute bottom-20 left-[15%] p-4 bg-primary-foreground/10 backdrop-blur-md rounded-2xl shadow-xl border border-primary-foreground/20"
                  initial={{ y: 0 }}
                  animate={{ y: [15, 0, 15] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Terminal className="w-8 h-8 text-primary-foreground/70" />
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full mb-6 border border-primary-foreground/20"
                >
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-primary-foreground">Custom Development</span>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Need a Custom Software Solution?
                </motion.h2>

                <motion.p
                  className="text-primary-foreground/90 text-lg mb-8 leading-relaxed"
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
                    className="rounded-full px-8 py-6 bg-card text-primary hover:bg-primary-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/contact" className="flex items-center gap-2">
                      Get in Touch <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 py-6 text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground/10 hover:border-primary-foreground transition-all duration-300"
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
                      <Star key={star} className="w-5 h-5 text-muted-foreground fill-current" />
                    ))}
                  </div>
                  <div className="text-primary-foreground/90 text-sm">
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
                <div className="absolute inset-0 bg-primary-foreground/20 backdrop-blur-sm rounded-2xl border border-primary-foreground/30 shadow-xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-primary-foreground/20 backdrop-blur-sm rounded-2xl border border-primary-foreground/30 shadow-xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-primary-foreground/20 backdrop-blur-sm rounded-2xl border border-primary-foreground/30 shadow-xl"></div>

                {/* Content card */}
                <div className="absolute inset-4 bg-primary-foreground/10 backdrop-blur-md rounded-xl border border-primary-foreground/20 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary-foreground/20">
                        <Zap className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-bold text-primary-foreground">Custom Development</h3>
                    </div>
                    <p className="text-primary-foreground/80 text-sm mb-4">
                      Tailored solutions built specifically for your business needs and workflows.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {['Personalized Approach', 'Expert Developers', 'Ongoing Support'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-card"></div>
                        </div>
                        <span className="text-sm text-primary-foreground/90">{feature}</span>
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
