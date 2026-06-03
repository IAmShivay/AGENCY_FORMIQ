'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart4, ExternalLink, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

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

export default function MarketingToolsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample marketing tools data
  const tools: Tool[] = [
    {
      id: '1',
      name: 'SEO Analyzer',
      description: 'Comprehensive SEO analysis tool to improve your website ranking and visibility in search engines.',
      features: [
        'Keyword research and analysis',
        'On-page SEO optimization',
        'Backlink analysis and monitoring',
        'Competitor analysis',
        'Detailed SEO reports and recommendations'
      ],
      tags: ['SEO', 'Analytics', 'Reporting'],
      link: '#',
      pricing: 'Paid',
    },
    {
      id: '2',
      name: 'Email Marketing Platform',
      description: 'Create, send, and analyze email campaigns with advanced automation and segmentation.',
      features: [
        'Drag-and-drop email builder',
        'Audience segmentation',
        'Automated email sequences',
        'A/B testing',
        'Detailed analytics and reporting'
      ],
      tags: ['Email Campaigns', 'Automation', 'Analytics'],
      link: '#',
      pricing: 'Freemium',
    },
    {
      id: '3',
      name: 'Social Media Manager',
      description: 'Schedule, publish, and analyze social media content across multiple platforms.',
      features: [
        'Content calendar and scheduling',
        'Social media monitoring',
        'Engagement analytics',
        'Team collaboration',
        'Automated posting'
      ],
      tags: ['Social Media', 'Content', 'Analytics'],
      link: '#',
      pricing: 'Paid',
    },
    {
      id: '4',
      name: 'Content Generation Tool',
      description: 'AI-powered content creation tool for blogs, social media, and marketing materials.',
      features: [
        'AI content generation',
        'Content optimization for SEO',
        'Multiple content formats',
        'Tone and style customization',
        'Plagiarism checking'
      ],
      tags: ['AI', 'Content Creation', 'Copywriting'],
      link: '#',
      pricing: 'Freemium',
    },
    {
      id: '5',
      name: 'Analytics Dashboard',
      description: 'Comprehensive analytics platform to track and visualize marketing performance metrics.',
      features: [
        'Real-time data visualization',
        'Custom reporting',
        'Multi-channel tracking',
        'Goal setting and monitoring',
        'Data export and integration'
      ],
      tags: ['Analytics', 'Reporting', 'Data Visualization'],
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

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Back link */}
      <div className="mb-8">
        <Link href="/software-tools" className="inline-flex items-center text-primary hover:underline transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Tools
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Marketing Tools
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          Elevate your marketing strategy with our powerful suite of marketing tools.
          From SEO optimization to content creation, we provide everything you need to grow your online presence.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search marketing tools..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart4 className="h-5 w-5" />
                    </div>
                    <CardTitle>{tool.name}</CardTitle>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${getPricingColor(tool.pricing)}`}>
                    {tool.pricing}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  {tool.description}
                </CardDescription>
                
                <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {tool.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {tool.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-end">
                <Button variant="default" size="sm" asChild>
                  <Link href={tool.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Learn More <ExternalLink size={14} />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No marketing tools found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-20 bg-gradient-to-r from-primary/10 to-primary/10 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Marketing Solution?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          We can develop custom marketing tools tailored to your specific business needs. 
          Contact us to discuss how we can help grow your online presence.
        </p>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
