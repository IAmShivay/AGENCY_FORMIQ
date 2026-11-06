"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AdsSeoProject, getAdsSeoProjects } from '@/lib/portfolio';
import { PlusCircle, Edit, Trash2, Target, Loader2, Image as ImageIcon, X, Plus, Minus } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_BTN_GHOST,
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

export default function AdminAdsSeo() {
  const [projects, setProjects] = useState<AdsSeoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [formData, setFormData] = useState<Partial<AdsSeoProject>>({
    title: '',
    description: '',
    image: '',
    category: 'Meta Ads',
    client: '',
    platform: '',
    results: [],
    tags: [],
    metrics: [],
    media_urls: [],
  });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAdsSeoProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching ads/seo projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const array = e.target.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setFormData({ ...formData, [field]: array });
  };

  const addMetric = () => {
    setFormData({ ...formData, metrics: [...(formData.metrics || []), { label: '', value: '' }] });
  };

  const updateMetric = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...(formData.metrics || [])];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, metrics: updated });
  };

  const removeMetric = (index: number) => {
    const updated = [...(formData.metrics || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, metrics: updated });
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMedia(true);
    const newUrls: string[] = [...(formData.media_urls || [])];

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const fileName = `ads-seo-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = `portfolio-ads-seo/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      setFormData({ ...formData, media_urls: newUrls });
      toast.success(`${files.length} file(s) uploaded`);
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploadingMedia(false);
    }
  };

  const removeMedia = (index: number) => {
    const updated = [...(formData.media_urls || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, media_urls: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!formData.title?.trim()) { toast.error('Title is required'); return; }
    if (!formData.description?.trim()) { toast.error('Description is required'); return; }

    try {
      setIsSubmitting(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) { toast.error('Authentication required'); return; }

      const sanitized = {
        title: formData.title?.trim() || '',
        description: formData.description?.trim() || '',
        image: formData.image?.trim() || '',
        category: formData.category?.trim() || 'Meta Ads',
        client: formData.client?.trim() || '',
        platform: formData.platform?.trim() || '',
        results: Array.isArray(formData.results) ? formData.results.filter(r => r.trim()) : [],
        tags: Array.isArray(formData.tags) ? formData.tags.filter(t => t.trim()) : [],
        metrics: (formData.metrics || []).filter(m => m.label.trim() && m.value.trim()),
        media_urls: formData.media_urls || [],
      };

      if (editingId) {
        const { error } = await supabase.from('portfolio_ads_seo').update(sanitized).eq('id', editingId);
        if (error) throw error;
        toast.success('Project updated!');
      } else {
        const { error } = await supabase.from('portfolio_ads_seo').insert([sanitized]);
        if (error) throw error;
        toast.success('Project added!');
      }

      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: AdsSeoProject) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      client: project.client,
      platform: project.platform,
      results: project.results,
      tags: project.tags,
      metrics: project.metrics || [],
      media_urls: project.media_urls || [],
    });
    setEditingId(project.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    toast('Delete this project?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const { error } = await supabase.from('portfolio_ads_seo').delete().eq('id', id);
            if (error) throw error;
            toast.success('Deleted!');
            fetchProjects();
          } catch (error: any) {
            toast.error(error.message || 'Failed to delete');
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
      duration: 10000,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', image: '', category: 'Meta Ads',
      client: '', platform: '', results: [], tags: [], metrics: [], media_urls: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Portfolio"
        title="Ads & SEO"
        description="Add and maintain the ads and SEO projects shown in the portfolio."
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? ADMIN_BTN_OUTLINE : ADMIN_BTN_PRIMARY}
          >
            {showForm ? 'Cancel' : <><PlusCircle className="h-4 w-4" /> Add project</>}
          </button>
        }
      />

      {showForm && (
        <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
          <h2 className={`${ADMIN_H2} mb-5`}>{editingId ? 'Edit project' : 'New project'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Title</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange}
                  className={ADMIN_INPUT} required />
              </div>
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Category</label>
                <select name="category" value={formData.category || ''} onChange={handleChange}
                  className={ADMIN_INPUT} required>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="SEO">SEO</option>
                  <option value="Google Business">Google Business</option>
                  <option value="YouTube Ads">YouTube Ads</option>
                </select>
              </div>
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Client</label>
                <input type="text" name="client" value={formData.client || ''} onChange={handleChange}
                  className={ADMIN_INPUT} />
              </div>
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Platform</label>
                <input type="text" name="platform" value={formData.platform || ''} onChange={handleChange}
                  className={ADMIN_INPUT} placeholder="Facebook & Instagram, Google Search, etc." />
              </div>
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Cover image URL</label>
                <input type="text" name="image" value={formData.image || ''} onChange={handleChange}
                  className={ADMIN_INPUT} placeholder="https://..." />
              </div>
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Tags (comma separated)</label>
                <input type="text" value={formData.tags?.join(', ') || ''} onChange={(e) => handleArrayChange(e, 'tags')}
                  className={ADMIN_INPUT} placeholder="Meta Ads, E-commerce, D2C" />
              </div>
              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange}
                  className={`${ADMIN_INPUT} h-auto py-2.5`} rows={3} required />
              </div>
              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Key results (comma separated)</label>
                <input type="text" value={formData.results?.join(', ') || ''} onChange={(e) => handleArrayChange(e, 'results')}
                  className={ADMIN_INPUT} placeholder="5.2x ROAS, 40% lower CPA, 2M+ reach" />
              </div>

              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className={`${ADMIN_LABEL} block`}>Metrics</label>
                  <button type="button" onClick={addMetric} className={`${ADMIN_BTN_GHOST} h-8 px-3 text-xs`}>
                    <Plus size={14} /> Add metric
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.metrics || []).map((metric, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" value={metric.label} onChange={(e) => updateMetric(i, 'label', e.target.value)}
                        className={`${ADMIN_INPUT} min-w-0 flex-1`} placeholder="Label (e.g., ROAS)" />
                      <input type="text" value={metric.value} onChange={(e) => updateMetric(i, 'value', e.target.value)}
                        className={`${ADMIN_INPUT} min-w-0 flex-1`} placeholder="Value (e.g., 5.2x)" />
                      <button type="button" onClick={() => removeMetric(i)} className={`${ADMIN_ICON_BTN} hover:bg-destructive/10 hover:text-destructive`}>
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={`${ADMIN_LABEL} mb-2 block`}>Proof media (screenshots, reports, videos)</label>
                <div className="rounded-xl border border-dashed border-border p-4">
                  <input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} className="mb-3 block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border file:border-solid file:border-border file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-foreground hover:file:bg-muted" disabled={uploadingMedia} />
                  {uploadingMedia && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </div>
                  )}
                  {formData.media_urls && formData.media_urls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      {formData.media_urls.map((url, i) => (
                        <div key={i} className="relative group">
                          {url.match(/\.(mp4|webm|mov)$/i) ? (
                            <video src={url} className="h-24 w-full rounded-xl border border-border object-cover" />
                          ) : (
                            <div className="h-24 w-full rounded-xl border border-border bg-muted" style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                          )}
                          <button type="button" onClick={() => removeMedia(i)}
                            className="absolute right-1 top-1 rounded-full border border-border bg-background p-1 text-destructive transition-opacity sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">Upload ad screenshots, analytics reports, ranking proofs, etc.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={resetForm} className={ADMIN_BTN_OUTLINE}>Cancel</button>
              <button type="submit" disabled={isSubmitting}
                className={ADMIN_BTN_PRIMARY}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update project' : 'Add project')}
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
        ) : projects.length === 0 ? (
          <div className={ADMIN_EMPTY}>
            <p>No ads/SEO projects found. Add your first!</p>
          </div>
        ) : (
          <div>
            <table className={ADMIN_TABLE}>
              <thead>
                <tr>
                  <th className={ADMIN_TH}>Project</th>
                  <th className={ADMIN_TH}>Category</th>
                  <th className={ADMIN_TH}>Platform</th>
                  <th className={ADMIN_TH}>Media</th>
                  <th className={`${ADMIN_TH} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className={ADMIN_ROW}>
                    <td className={ADMIN_TD}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0">
                          {project.image ? (
                            <div className="h-10 w-10 rounded-xl border border-border bg-muted" style={{ backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                              <Target size={20} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="max-w-xs truncate text-muted-foreground">{project.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className={ADMIN_TD}>
                      <span className={`${ADMIN_BADGE} ${ADMIN_TONE.accent}`}>{project.category}</span>
                    </td>
                    <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground`}>{project.platform}</td>
                    <td className={ADMIN_TD}>
                      <div className="flex items-center gap-1">
                        <ImageIcon size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.media_urls?.length || 0}</span>
                      </div>
                    </td>
                    <td className={`${ADMIN_TD} text-right`}>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEdit(project)}
                          className={ADMIN_ICON_BTN} title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(project.id)}
                          className={`${ADMIN_ICON_BTN} hover:bg-destructive/10 hover:text-destructive`} title="Delete">
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
