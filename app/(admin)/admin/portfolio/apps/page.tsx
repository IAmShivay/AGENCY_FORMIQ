"use client";

import { useState, useEffect } from 'react';
import PortfolioSectionPicker, { useOpenFormFromPicker } from '@/components/admin/PortfolioSectionPicker';
import { supabase } from '@/lib/supabaseClient';
import { AppProject, getAppProjects } from '@/lib/portfolio';
import { PlusCircle, Edit, Trash2, Smartphone, ExternalLink, Loader2 } from 'lucide-react';
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

export default function AdminApps() {
  const [apps, setApps] = useState<AppProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  useOpenFormFromPicker(() => setShowForm(true));
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

  useEffect(() => {
    fetchApps();
  }, []);

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
          .from('portfolio_apps')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'App updated successfully!' });
      } else {
        const { error } = await supabase
          .from('portfolio_apps')
          .insert([formData]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'App added successfully!' });
      }

      resetForm();
      fetchApps();
    } catch (error: any) {
      console.error('Error saving app:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save app' });
    }
  };

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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio"
        title="Apps"
        description="Add and maintain the app projects shown in the portfolio."
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? ADMIN_BTN_OUTLINE : ADMIN_BTN_PRIMARY}
          >
            {showForm ? 'Cancel' : <><PlusCircle className="h-4 w-4" /> Add app</>}
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
          <h2 className={`${ADMIN_H2} mb-5`}>{editingId ? 'Edit app' : 'New app'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingId && <PortfolioSectionPicker current="apps" />}
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
              
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Platforms (comma separated)</label>
                <input
                  type="text"
                  value={formData.platforms?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'platforms')}
                  className={ADMIN_INPUT}
                  placeholder="iOS, Android, Web"
                  required
                />
              </div>
              
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'tags')}
                  className={ADMIN_INPUT}
                  placeholder="React Native, Firebase, Redux"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'features')}
                  className={ADMIN_INPUT}
                  placeholder="User Authentication, Push Notifications, Offline Mode"
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
                {editingId ? 'Update app' : 'Add app'}
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
        ) : apps.length === 0 ? (
          <div className={ADMIN_EMPTY}>
            <p>No apps found. Add your first app!</p>
          </div>
        ) : (
          <div>
            <table className={ADMIN_TABLE}>
              <thead>
                <tr>
                  <th className={ADMIN_TH}>App</th>
                  <th className={ADMIN_TH}>Platforms</th>
                  <th className={ADMIN_TH}>Year</th>
                  <th className={`${ADMIN_TH} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app.id} className={ADMIN_ROW}>
                    <td className={ADMIN_TD}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0">
                          {app.image ? (
                            <div 
                              className="h-10 w-10 rounded-xl border border-border bg-muted"
                              style={{
                                backgroundImage: `url(${app.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            ></div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                              <Smartphone size={20} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{app.title}</div>
                          <div className="max-w-xs truncate text-muted-foreground">{app.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className={ADMIN_TD}>
                      <div className="flex flex-wrap gap-1">
                        {app.platforms.map((platform, index) => (
                          <span 
                            key={index}
                            className={`${ADMIN_BADGE} ${ADMIN_TONE.accent}`}
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground`}>
                      {app.year}
                    </td>
                    <td className={`${ADMIN_TD} text-right`}>
                      <div className="flex justify-end gap-1">
                        {app.link && (
                          <a 
                            href={app.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={ADMIN_ICON_BTN}
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                        <button 
                          onClick={() => handleEdit(app)}
                          className={ADMIN_ICON_BTN}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(app.id)}
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
