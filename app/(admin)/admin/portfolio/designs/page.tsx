"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DesignProject, getDesignProjects } from '@/lib/portfolio';
import { PlusCircle, Edit, Trash2, Palette, ExternalLink, Loader2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EMPTY,
  ADMIN_H2,
  ADMIN_ICON_BTN,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_ROW,
  ADMIN_TABLE,
  ADMIN_TABLE_WRAP,
  ADMIN_TD,
  ADMIN_TH,
  ADMIN_TONE,
} from '@/components/admin/admin-ui';

const MESSAGE_TONE = {
  success: ADMIN_TONE.positive,
  error: ADMIN_TONE.negative,
} as const;

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

  useEffect(() => {
    fetchDesigns();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const { value } = e.target;
    const array = value.split(',').map(item => item.trim());
    setFormData({ ...formData, [field]: array });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingId) {
        const { error } = await supabase
          .from('portfolio_designs')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Design updated successfully!' });
      } else {
        const { error } = await supabase
          .from('portfolio_designs')
          .insert([formData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Design added successfully!' });
      }

      resetForm();
      fetchDesigns();
    } catch (error: any) {
      console.error('Error saving design:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save design' });
    }
  };

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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio"
        title="Designs"
        description="Add and maintain the design projects shown in the portfolio."
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? ADMIN_BTN_OUTLINE : ADMIN_BTN_PRIMARY}
          >
            {showForm ? 'Cancel' : <><PlusCircle className="h-4 w-4" /> Add design</>}
          </button>
        }
      />

      {message.text && (
        <div className={`rounded-xl border p-4 text-sm ${message.type === 'success' ? MESSAGE_TONE.success : MESSAGE_TONE.error}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
          <h2 className={`${ADMIN_H2} mb-5`}>{editingId ? 'Edit design' : 'New design'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className={ADMIN_INPUT}
                  required
                />
              </div>
              
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Category</label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  className={ADMIN_INPUT}
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
                <label className={`${ADMIN_LABEL} mb-2 block`}>Client</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client || ''}
                  onChange={handleChange}
                  className={ADMIN_INPUT}
                  required
                />
              </div>
              
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year || ''}
                  onChange={handleChange}
                  className={ADMIN_INPUT}
                  placeholder="2024"
                  required
                />
              </div>
              
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleChange}
                  className={ADMIN_INPUT}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link || ''}
                  onChange={handleChange}
                  className={ADMIN_INPUT}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className={`${ADMIN_INPUT} h-auto py-2.5`}
                  rows={3}
                  required
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Services (comma separated)</label>
                <input
                  type="text"
                  value={formData.services?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'services')}
                  className={ADMIN_INPUT}
                  placeholder="Logo Design, Brand Guidelines, Marketing Materials"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className={ADMIN_BTN_OUTLINE}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={ADMIN_BTN_PRIMARY}
              >
                {editingId ? 'Update design' : 'Add design'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={ADMIN_TABLE_WRAP}>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : designs.length === 0 ? (
          <div className={ADMIN_EMPTY}>
            <p>No designs found. Add your first design!</p>
          </div>
        ) : (
          <div>
            <table className={ADMIN_TABLE}>
              <thead>
                <tr>
                  <th className={ADMIN_TH}>Design</th>
                  <th className={ADMIN_TH}>Category</th>
                  <th className={ADMIN_TH}>Client</th>
                  <th className={ADMIN_TH}>Year</th>
                  <th className={`${ADMIN_TH} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {designs.map((design) => (
                  <tr key={design.id} className={ADMIN_ROW}>
                    <td className={ADMIN_TD}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0">
                          {design.image ? (
                            <div 
                              className="h-10 w-10 rounded-xl border border-border bg-muted"
                              style={{
                                backgroundImage: `url(${design.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            ></div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                              <Palette size={20} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{design.title}</div>
                          <div className="max-w-xs truncate text-muted-foreground">{design.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className={ADMIN_TD}>
                      <span className={`${ADMIN_BADGE} ${ADMIN_TONE.accent}`}>
                        {design.category}
                      </span>
                    </td>
                    <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground`}>
                      {design.client}
                    </td>
                    <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground`}>
                      {design.year}
                    </td>
                    <td className={`${ADMIN_TD} text-right`}>
                      <div className="flex justify-end gap-1">
                        {design.link && (
                          <a 
                            href={design.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={ADMIN_ICON_BTN}
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                        <button 
                          onClick={() => handleEdit(design)}
                          className={ADMIN_ICON_BTN}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(design.id)}
                          className={`${ADMIN_ICON_BTN} hover:bg-destructive/10 hover:text-destructive`}
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
