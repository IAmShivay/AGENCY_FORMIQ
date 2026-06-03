"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AppProject, getAppProjects } from '@/lib/portfolio';
import { PlusCircle, Edit, Trash2, Smartphone, ExternalLink } from 'lucide-react';

export default function AdminApps() {
  const [apps, setApps] = useState<AppProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AppProject>>({
    title: '',
    description: '',
    image: '',
    tags: [],
    platforms: [],
    link: '',
    features: [],
    year: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch apps on component mount
  useEffect(() => {
    fetchApps();
  }, []);

  // Fetch apps from the database
  const fetchApps = async () => {
    try {
      setLoading(true);
      const data = await getAppProjects();
      setApps(data);
    } catch (error) {
      console.error('Error fetching apps:', error);
      setMessage({ type: 'error', text: 'Failed to load apps' });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle array input changes (tags, platforms, features)
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const { value } = e.target;
    const array = value.split(',').map(item => item.trim());
    setFormData({ ...formData, [field]: array });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingId) {
        // Update existing app
        const { error } = await supabase
          .from('portfolio_apps')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'App updated successfully!' });
      } else {
        // Add new app
        const { error } = await supabase
          .from('portfolio_apps')
          .insert([formData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'App added successfully!' });
      }

      // Reset form and refresh apps
      resetForm();
      fetchApps();
    } catch (error: any) {
      console.error('Error saving app:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save app' });
    }
  };

  // Edit an app
  const handleEdit = (app: AppProject) => {
    setFormData({
      title: app.title,
      description: app.description,
      image: app.image,
      tags: app.tags,
      platforms: app.platforms,
      link: app.link,
      features: app.features,
      year: app.year
    });
    setEditingId(app.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete an app
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_apps')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'App deleted successfully!' });
      fetchApps();
    } catch (error: any) {
      console.error('Error deleting app:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to delete app' });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      tags: [],
      platforms: [],
      link: '',
      features: [],
      year: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Portfolio Apps</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : <><PlusCircle size={20} /> Add App</>}
        </button>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit App' : 'Add New App'}</h2>
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
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="2024"
                  required
                />
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
                <label className="block text-sm font-medium mb-1">Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="https://example.com"
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
                <label className="block text-sm font-medium mb-1">Platforms (comma separated)</label>
                <input
                  type="text"
                  value={formData.platforms?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'platforms')}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="iOS, Android, Web"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'tags')}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="React Native, Firebase, Redux"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'features')}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="User Authentication, Push Notifications, Offline Mode"
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
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              >
                {editingId ? 'Update App' : 'Add App'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Apps List */}
      <div className="bg-card rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : apps.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No apps found. Add your first app!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">App</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Platforms</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apps.map((app) => (
                  <tr key={app.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {app.image ? (
                            <div 
                              className="h-10 w-10 rounded bg-secondary"
                              style={{
                                backgroundImage: `url(${app.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            ></div>
                          ) : (
                            <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                              <Smartphone size={20} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{app.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{app.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {app.platforms.map((platform, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {app.year}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {app.link && (
                          <a 
                            href={app.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                        <button 
                          onClick={() => handleEdit(app)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(app.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
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
