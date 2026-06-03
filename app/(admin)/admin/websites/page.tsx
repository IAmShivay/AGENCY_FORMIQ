'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink, Search, Globe , Loader2 } from 'lucide-react';
import { WebsiteProject } from '@/lib/portfolio';

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<WebsiteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDeleting, setIsDeleting] = useState(false);

  // Website categories for filtering
  const categories = ['All', 'E-Commerce', 'Corporate', 'Educational', 'Landing Pages', 'Portfolio', 'Blog', 'Other'];

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWebsite = async (id: string) => {
    if (!confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('portfolio_websites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the list
      fetchWebsites();
    } catch (error) {
      console.error('Error deleting website:', error);
      alert('Failed to delete website. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter websites based on search term and category
  const filteredWebsites = websites.filter(website => {
    const matchesSearch = 
      website.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      website.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (website.tags && website.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      website.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Website Portfolio</h1>
          <p className="mt-2 text-muted-foreground">Manage your website projects</p>
        </div>
        <Link
          href="/admin/websites/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Website
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search websites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-foreground"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary text-foreground"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Websites List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : filteredWebsites.length > 0 ? (
        <div className="bg-card shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Website
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Completion Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredWebsites.map((website) => (
                  <tr key={website.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {website.image ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={website.image}
                              alt={website.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                              <Globe className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {website.title}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {website.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {website.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        {website.completion_date || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/websites/${website.id}/edit`} 
                        className="text-primary hover:text-primary/80 mr-3"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>
                      {website.live_link && (
                        <a 
                          href={website.live_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground mr-3"
                        >
                          <ExternalLink className="w-4 h-4 inline" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteWebsite(website.id)}
                        disabled={isDeleting}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card shadow-md rounded-lg p-6 text-center">
          <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No websites found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'All' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by adding your first website project.'}
          </p>
          <Link
            href="/admin/websites/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Website
          </Link>
        </div>
      )}
    </div>
  );
}
