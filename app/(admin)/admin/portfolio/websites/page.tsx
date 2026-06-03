"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { WebsiteProject, getWebsiteProjects } from '@/lib/portfolio';
import { PlusCircle, Edit, Trash2, Globe, ExternalLink , Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminWebsites() {
  const [websites, setWebsites] = useState<WebsiteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WebsiteProject>>({
    title: '',
    description: '',
    image: '',
    tags: [],
    link: '',
    category: 'E-Commerce',
    completion_date: '',
    features: [],
    live_link: '',
    repo_link: '',
    case_study_challenge: '',
    case_study_solution: '',
    case_study_results: '',
    case_study_testimonial: '',
    case_study_screens: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch websites on component mount
  useEffect(() => {
    fetchWebsites();
  }, []);

  // Fetch websites from the database
  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const data = await getWebsiteProjects();
      setWebsites(data);
    } catch (error) {
      console.error('Error fetching websites:', error);
      toast.error('Failed to load websites');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle array input changes (tags, features, screens)
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const { value } = e.target;
    const array = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setFormData({ ...formData, [field]: array });
  };

  // Sanitize and prepare form data for submission
  const prepareFormData = (data: Partial<WebsiteProject>) => {
    const sanitizedData = {
      title: data.title?.trim() || '',
      description: data.description?.trim() || '',
      image: data.image?.trim() || '',
      tags: Array.isArray(data.tags) ? data.tags.filter(tag => tag.trim()) : [],
      link: data.link?.trim() || '',
      category: data.category?.trim() || 'E-Commerce',
      completion_date: data.completion_date?.trim() || '',
      features: Array.isArray(data.features) ? data.features.filter(feature => feature.trim()) : [],
      live_link: data.live_link?.trim() || '',
      repo_link: data.repo_link?.trim() || '',
      case_study_challenge: data.case_study_challenge?.trim() || '',
      case_study_solution: data.case_study_solution?.trim() || '',
      case_study_results: data.case_study_results?.trim() || '',
      case_study_testimonial: data.case_study_testimonial?.trim() || '',
      case_study_screens: Array.isArray(data.case_study_screens) ? data.case_study_screens.filter(screen => screen.trim()) : []
    };

    // Remove empty string fields for optional fields
    Object.keys(sanitizedData).forEach(key => {
      const value = sanitizedData[key as keyof typeof sanitizedData];
      if (value === '' && !['title', 'description', 'category'].includes(key)) {
        delete sanitizedData[key as keyof typeof sanitizedData];
      }
    });

    return sanitizedData;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Basic validation
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.description?.trim()) {
      toast.error('Description is required');
      return;
    }

    try {
      setIsSubmitting(true);

      // Check authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      // Prepare sanitized data
      const sanitizedData = prepareFormData(formData);

      if (editingId) {
        // Update existing website
        const { error } = await supabase
          .from('portfolio_websites')
          .update(sanitizedData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Website updated successfully!');
      } else {
        // Add new website
        const { error } = await supabase
          .from('portfolio_websites')
          .insert([sanitizedData]);

        if (error) throw error;
        toast.success('Website added successfully!');
      }

      // Reset form and refresh websites
      resetForm();
      fetchWebsites();
    } catch (error: any) {
      console.error('Error saving website:', error);
      toast.error(error.message || 'Failed to save website');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit a website
  const handleEdit = (website: WebsiteProject) => {
    setFormData({
      title: website.title,
      description: website.description,
      image: website.image,
      tags: website.tags,
      link: website.link,
      category: website.category,
      completion_date: website.completion_date,
      features: website.features,
      live_link: website.live_link,
      repo_link: website.repo_link,
      case_study_challenge: website.case_study_challenge,
      case_study_solution: website.case_study_solution,
      case_study_results: website.case_study_results,
      case_study_testimonial: website.case_study_testimonial,
      case_study_screens: website.case_study_screens
    });
    setEditingId(website.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a website with confirmation
  const handleDelete = async (id: string) => {
    // Use a custom confirmation toast
    toast('Are you sure you want to delete this website?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const { error } = await supabase
              .from('portfolio_websites')
              .delete()
              .eq('id', id);

            if (error) throw error;
            toast.success('Website deleted successfully!');
            fetchWebsites();
          } catch (error: any) {
            console.error('Error deleting website:', error);
            toast.error(error.message || 'Failed to delete website');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {}, // Do nothing on cancel
      },
      duration: 10000,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      tags: [],
      link: '',
      category: 'E-Commerce',
      completion_date: '',
      features: [],
      live_link: '',
      repo_link: '',
      case_study_challenge: '',
      case_study_solution: '',
      case_study_results: '',
      case_study_testimonial: '',
      case_study_screens: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Portfolio Websites</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : <><PlusCircle size={20} /> Add Website</>}
        </button>
      </div>



      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Website' : 'Add New Website'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  required
                >
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Educational">Educational</option>
                  <option value="Landing Pages">Landing Pages</option>
                  <option value="Blog">Blog</option>
                  <option value="Portfolio">Portfolio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Completion Date</label>
                <input
                  type="text"
                  name="completion_date"
                  value={formData.completion_date || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="March 2024"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  rows={3}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Live Link</label>
                <input
                  type="text"
                  name="live_link"
                  value={formData.live_link || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Repository Link</label>
                <input
                  type="text"
                  name="repo_link"
                  value={formData.repo_link || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'tags')}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="Next.js, React, Tailwind CSS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'features')}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="User Authentication, Payment Processing, Admin Dashboard"
                />
              </div>

              {/* Case Study Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-2 mt-4">Case Study Information</h3>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Challenge</label>
                <textarea
                  name="case_study_challenge"
                  value={formData.case_study_challenge || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  rows={3}
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Solution</label>
                <textarea
                  name="case_study_solution"
                  value={formData.case_study_solution || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  rows={3}
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Results</label>
                <textarea
                  name="case_study_results"
                  value={formData.case_study_results || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  rows={3}
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Testimonial</label>
                <textarea
                  name="case_study_testimonial"
                  value={formData.case_study_testimonial || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  rows={3}
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Case Study Screens (comma separated URLs)</label>
                <input
                  type="text"
                  value={formData.case_study_screens?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'case_study_screens')}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="https://example.com/screen1.jpg, https://example.com/screen2.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {isSubmitting && (
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                )}
                {isSubmitting
                  ? (editingId ? 'Updating...' : 'Adding...')
                  : (editingId ? 'Update Website' : 'Add Website')
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Websites List */}
      <div className="bg-card rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : websites.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No websites found. Add your first website!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Website</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {websites.map((website) => (
                  <tr key={website.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {website.image ? (
                            <div
                              className="h-10 w-10 rounded bg-secondary"
                              style={{
                                backgroundImage: `url(${website.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            ></div>
                          ) : (
                            <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                              <Globe size={20} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{website.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{website.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {website.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {website.completion_date}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {website.live_link && (
                          <a
                            href={website.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
                            title="View live site"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(website)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          title="Edit website"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(website.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete website"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
