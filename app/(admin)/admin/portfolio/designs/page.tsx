"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DesignProject, getDesignProjects } from '@/lib/portfolio';
import { PlusCircle, Edit, Trash2, Palette, ExternalLink } from 'lucide-react';

export default function AdminDesigns() {
  const [designs, setDesigns] = useState<DesignProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DesignProject>>({
    title: '',
    description: '',
    image: '',
    category: 'Branding',
    client: '',
    link: '',
    year: '',
    services: []
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch designs on component mount
  useEffect(() => {
    fetchDesigns();
  }, []);

  // Fetch designs from the database
  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const data = await getDesignProjects();
      setDesigns(data);
    } catch (error) {
      console.error('Error fetching designs:', error);
      setMessage({ type: 'error', text: 'Failed to load designs' });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle array input changes (services)
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
        // Update existing design
        const { error } = await supabase
          .from('portfolio_designs')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Design updated successfully!' });
      } else {
        // Add new design
        const { error } = await supabase
          .from('portfolio_designs')
          .insert([formData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Design added successfully!' });
      }

      // Reset form and refresh designs
      resetForm();
      fetchDesigns();
    } catch (error: any) {
      console.error('Error saving design:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save design' });
    }
  };

  // Edit a design
  const handleEdit = (design: DesignProject) => {
    setFormData({
      title: design.title,
      description: design.description,
      image: design.image,
      category: design.category,
      client: design.client,
      link: design.link,
      year: design.year,
      services: design.services
    });
    setEditingId(design.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a design
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;

    try {
      const { error } = await supabase
        .from('portfolio_designs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Design deleted successfully!' });
      fetchDesigns();
    } catch (error: any) {
      console.error('Error deleting design:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to delete design' });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      category: 'Branding',
      client: '',
      link: '',
      year: '',
      services: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Portfolio Designs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : <><PlusCircle size={20} /> Add Design</>}
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
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Design' : 'Add New Design'}</h2>
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
                  <option value="Branding">Branding</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Print">Print</option>
                  <option value="Illustration">Illustration</option>
                  <option value="Web Design">Web Design</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client || ''}
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Services (comma separated)</label>
                <input
                  type="text"
                  value={formData.services?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'services')}
                  className="w-full p-2 border rounded-lg bg-card border-border"
                  placeholder="Logo Design, Brand Guidelines, Marketing Materials"
                  required
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
                {editingId ? 'Update Design' : 'Add Design'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Designs List */}
      <div className="bg-card rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : designs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No designs found. Add your first design!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Design</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {designs.map((design) => (
                  <tr key={design.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {design.image ? (
                            <div 
                              className="h-10 w-10 rounded bg-secondary"
                              style={{
                                backgroundImage: `url(${design.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            ></div>
                          ) : (
                            <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                              <Palette size={20} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{design.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{design.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {design.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {design.client}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {design.year}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {design.link && (
                          <a 
                            href={design.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                        <button 
                          onClick={() => handleEdit(design)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(design.id)}
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
