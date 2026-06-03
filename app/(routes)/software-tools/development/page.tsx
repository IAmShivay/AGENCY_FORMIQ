'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal, ExternalLink, ArrowLeft, Search } from 'lucide-react';
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

export default function DevelopmentToolsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample development tools data
  const tools: Tool[] = [
    {
      id: '1',
      name: 'Code Repository',
      description: 'Version control system for tracking changes in source code during software development.',
      features: [
        'Distributed version control',
        'Branching and merging',
        'Code review tools',
        'Issue tracking',
        'CI/CD integration'
      ],
      tags: ['Version Control', 'Collaboration', 'Code Management'],
      link: '#',
      pricing: 'Free',
    },
    {
      id: '2',
      name: 'Code Editor',
      description: 'Powerful code editor with syntax highlighting, debugging, and version control integration.',
      features: [
        'Intelligent code completion',
        'Integrated debugging',
        'Git integration',
        'Extension marketplace',
        'Customizable interface'
      ],
      tags: ['Coding', 'Debugging', 'Extensions'],
      link: '#',
      pricing: 'Free',
    },
    {
      id: '3',
      name: 'API Development Platform',
      description: 'Complete solution for designing, building, testing, and documenting APIs.',
      features: [
        'API design tools',
        'Automated testing',
        'Documentation generation',
        'Mock servers',
        'Team collaboration'
      ],
      tags: ['API', 'Testing', 'Documentation'],
      link: '#',
      pricing: 'Freemium',
    },
    {
      id: '4',
      name: 'CI/CD Pipeline Tool',
      description: 'Continuous integration and deployment platform for automating build, test, and deployment processes.',
      features: [
        'Automated builds',
        'Test automation',
        'Deployment automation',
        'Pipeline visualization',
        'Integration with major cloud providers'
      ],
      tags: ['CI/CD', 'DevOps', 'Automation'],
      link: '#',
      pricing: 'Paid',
    },
    {
      id: '5',
      name: 'Database Management Tool',
      description: 'Comprehensive database management solution for developers and database administrators.',
      features: [
        'Visual query builder',
        'Database design tools',
        'Performance monitoring',
        'Data migration',
        'Multiple database support'
      ],
      tags: ['Database', 'SQL', 'Administration'],
      link: '#',
      pricing: 'Freemium',
    },
    {
      id: '6',
      name: 'Containerization Platform',
      description: 'Platform for developing, shipping, and running applications in containers.',
      features: [
        'Container orchestration',
        'Microservices support',
        'Scalability',
        'Security scanning',
        'Multi-environment deployment'
      ],
      tags: ['Containers', 'DevOps', 'Microservices'],
      link: '#',
      pricing: 'Freemium',
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
          Development Tools
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          Accelerate your development workflow with our powerful suite of development tools.
          From code editors to CI/CD pipelines, we provide everything developers need to build better software faster.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search development tools..."
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
                      <Terminal className="h-5 w-5" />
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
            <p className="text-gray-500 dark:text-gray-400">No development tools found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-20 bg-gradient-to-r from-primary/10 to-primary/10 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Development Solution?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          We can develop custom development tools tailored to your specific workflow needs. 
          Contact us to discuss how we can help optimize your development process.
        </p>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
