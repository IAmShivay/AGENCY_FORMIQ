"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CreativeProject, getCreativeProjects } from '@/lib/portfolio';
import { PlusCircle, Edit, Trash2, PaintBucket, ExternalLink, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCreatives() {
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [formData, setFormData] = useState<Partial<CreativeProject>>({
    title: '',
    description: '',
    image: '',
    category: 'Brand Identity',
    client: '',
    deliverables: [],
    tags: [],
    media_urls: [],
  });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getCreativeProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching creatives:', error);
      toast.error('Failed to load creatives');
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

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMedia(true);
    const newUrls: string[] = [...(formData.media_urls || [])];

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const fileName = `creative-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = `portfolio-creatives/${fileName}`;

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
        category: formData.category?.trim() || 'Brand Identity',
        client: formData.client?.trim() || '',
        deliverables: Array.isArray(formData.deliverables) ? formData.deliverables.filter(d => d.trim()) : [],
        tags: Array.isArray(formData.tags) ? formData.tags.filter(t => t.trim()) : [],
        media_urls: formData.media_urls || [],
      };

      if (editingId) {
        const { error } = await supabase.from('portfolio_creatives').update(sanitized).eq('id', editingId);
        if (error) throw error;
        toast.success('Creative updated!');
      } else {
        const { error } = await supabase.from('portfolio_creatives').insert([sanitized]);
        if (error) throw error;
        toast.success('Creative added!');
      }

      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: CreativeProject) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      client: project.client,
      deliverables: project.deliverables,
      tags: project.tags,
      media_urls: project.media_urls || [],
    });
    setEditingId(project.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    toast('Delete this creative project?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const { error } = await supabase.from('portfolio_creatives').delete().eq('id', id);
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
      title: '', description: '', image: '', category: 'Brand Identity',
      client: '', deliverables: [], tags: [], media_urls: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Creatives Portfolio</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : <><PlusCircle size={20} /> Add Creative</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Creative' : 'Add New Creative'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={formData.category || ''} onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border" required>
                  <option value="Brand Identity">Brand Identity</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Photography">Photography</option>
                  <option value="Print Design">Print Design</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Video">Video</option>
                  <option value="Packaging">Packaging</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <input type="text" name="client" value={formData.client || ''} onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                <input type="text" name="image" value={formData.image || ''} onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border" placeholder="https://..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange}
                  className="w-full p-2 border rounded-lg bg-card border-border" rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deliverables (comma separated)</label>
                <input type="text" value={formData.deliverables?.join(', ') || ''} onChange={(e) => handleArrayChange(e, 'deliverables')}
                  className="w-full p-2 border rounded-lg bg-card border-border" placeholder="Logo Design, Social Templates, Packaging" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input type="text" value={formData.tags?.join(', ') || ''} onChange={(e) => handleArrayChange(e, 'tags')}
                  className="w-full p-2 border rounded-lg bg-card border-border" placeholder="Branding, Social Media, Print" />
              </div>

              {/* Media Upload Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Proof Media (Images / Screenshots)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="mb-3"
                    disabled={uploadingMedia}
                  />
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
                            <video src={url} className="w-full h-24 object-cover rounded-lg" />
                          ) : (
                            <div className="w-full h-24 bg-muted rounded-lg" style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                          )}
                          <button type="button" onClick={() => removeMedia(i)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Upload images, screenshots, or video proofs of your work</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting}
                className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Creative' : 'Add Creative')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="bg-card rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No creative projects found. Add your first!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Media</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {project.image ? (
                            <div className="h-10 w-10 rounded bg-secondary" style={{ backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                          ) : (
                            <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                              <PaintBucket size={20} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{project.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">{project.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{project.client}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <ImageIcon size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.media_urls?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(project)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(project.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="Delete">
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
