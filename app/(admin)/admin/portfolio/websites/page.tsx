"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { WebsiteProject, getWebsiteProjects } from '@/lib/portfolio';
import { PlusCircle, Edit, Trash2, Globe, ExternalLink , Loader2 } from 'lucide-react';
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

  useEffect(() => {
    fetchWebsites();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const { value } = e.target;
    const array = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setFormData({ ...formData, [field]: array });
  };

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

    Object.keys(sanitizedData).forEach(key => {
      const value = sanitizedData[key as keyof typeof sanitizedData];
      if (value === '' && !['title', 'description', 'category'].includes(key)) {
        delete sanitizedData[key as keyof typeof sanitizedData];
      }
    });

    return sanitizedData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

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

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const sanitizedData = prepareFormData(formData);

      if (editingId) {
        const { error } = await supabase
          .from('portfolio_websites')
          .update(sanitizedData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Website updated successfully!');
      } else {
        const { error } = await supabase
          .from('portfolio_websites')
          .insert([sanitizedData]);

        if (error) throw error;
        toast.success('Website added successfully!');
      }

      resetForm();
      fetchWebsites();
    } catch (error: any) {
      console.error('Error saving website:', error);
      toast.error(error.message || 'Failed to save website');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleDelete = async (id: string) => {
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
        onClick: () => {},
      },
      duration: 10000,
    });
  };

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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio"
        title="Websites"
        description="Add and maintain the website case studies shown in the portfolio."
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? ADMIN_BTN_OUTLINE : ADMIN_BTN_PRIMARY}
          >
            {showForm ? 'Cancel' : <><PlusCircle className="h-4 w-4" /> Add website</>}
          </button>
        }
      />

      {showForm && (
        <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
          <h2 className={`${ADMIN_H2} mb-5`}>{editingId ? 'Edit website' : 'New website'}</h2>
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
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Educational">Educational</option>
                  <option value="Landing Pages">Landing Pages</option>
                  <option value="Blog">Blog</option>
                  <option value="Portfolio">Portfolio</option>
                </select>
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
                <label className={`${ADMIN_LABEL} mb-2 block`}>Completion date</label>
                <input
                  type="text"
                  name="completion_date"
                  value={formData.completion_date || ''}
                  onChange={handleChange}
                  className={ADMIN_INPUT}
                  placeholder="March 2024"
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
                <label className={`${ADMIN_LABEL} mb-2 block`}>Live link</label>
                <input
                  type="text"
                  name="live_link"
                  value={formData.live_link || ''}
                  onChange={handleChange}
                  className={ADMIN_INPUT}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Repository link</label>
                <input
                  type="text"
                  name="repo_link"
                  value={formData.repo_link || ''}
                  onChange={handleChange}
                  className={ADMIN_INPUT}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'tags')}
                  className={ADMIN_INPUT}
                  placeholder="Next.js, React, Tailwind CSS"
                />
              </div>

              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'features')}
                  className={ADMIN_INPUT}
                  placeholder="User Authentication, Payment Processing, Admin Dashboard"
                />
              </div>

              <div className="md:col-span-2">
                <h3 className={`${ADMIN_H2} mt-4 border-t border-border pt-6`}>Case study information</h3>
              </div>

              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Challenge</label>
                <textarea
                  name="case_study_challenge"
                  value={formData.case_study_challenge || ''}
                  onChange={handleChange}
                  className={`${ADMIN_INPUT} h-auto py-2.5`}
                  rows={3}
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Solution</label>
                <textarea
                  name="case_study_solution"
                  value={formData.case_study_solution || ''}
                  onChange={handleChange}
                  className={`${ADMIN_INPUT} h-auto py-2.5`}
                  rows={3}
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Results</label>
                <textarea
                  name="case_study_results"
                  value={formData.case_study_results || ''}
                  onChange={handleChange}
                  className={`${ADMIN_INPUT} h-auto py-2.5`}
                  rows={3}
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Testimonial</label>
                <textarea
                  name="case_study_testimonial"
                  value={formData.case_study_testimonial || ''}
                  onChange={handleChange}
                  className={`${ADMIN_INPUT} h-auto py-2.5`}
                  rows={3}
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Case study screens (comma separated URLs)</label>
                <input
                  type="text"
                  value={formData.case_study_screens?.join(', ') || ''}
                  onChange={(e) => handleArrayChange(e, 'case_study_screens')}
                  className={ADMIN_INPUT}
                  placeholder="https://example.com/screen1.jpg, https://example.com/screen2.jpg"
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
                disabled={isSubmitting}
                className={ADMIN_BTN_PRIMARY}
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {isSubmitting
                  ? (editingId ? 'Updating...' : 'Adding...')
                  : (editingId ? 'Update website' : 'Add website')
                }
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
        ) : websites.length === 0 ? (
          <div className={ADMIN_EMPTY}>
            <p>No websites found. Add your first website!</p>
          </div>
        ) : (
          <div>
            <table className={ADMIN_TABLE}>
              <thead>
                <tr>
                  <th className={ADMIN_TH}>Website</th>
                  <th className={ADMIN_TH}>Category</th>
                  <th className={ADMIN_TH}>Date</th>
                  <th className={`${ADMIN_TH} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {websites.map((website) => (
                  <tr key={website.id} className={ADMIN_ROW}>
                    <td className={ADMIN_TD}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0">
                          {website.image ? (
                            <div
                              className="h-10 w-10 rounded-xl border border-border bg-muted"
                              style={{
                                backgroundImage: `url(${website.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            ></div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                              <Globe size={20} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{website.title}</div>
                          <div className="max-w-xs truncate text-muted-foreground">{website.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className={ADMIN_TD}>
                      <span className={`${ADMIN_BADGE} ${ADMIN_TONE.accent}`}>
                        {website.category}
                      </span>
                    </td>
                    <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground`}>
                      {website.completion_date}
                    </td>
                    <td className={`${ADMIN_TD} text-right`}>
                      <div className="flex justify-end gap-1">
                        {website.live_link && (
                          <a
                            href={website.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={ADMIN_ICON_BTN}
                            title="View live site"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(website)}
                          className={ADMIN_ICON_BTN}
                          title="Edit website"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(website.id)}
                          className={`${ADMIN_ICON_BTN} hover:bg-destructive/10 hover:text-destructive`}
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
