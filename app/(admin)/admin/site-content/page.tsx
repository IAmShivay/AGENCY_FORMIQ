'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getHeroMedia, saveHeroMedia, DEFAULT_HERO_MEDIA, type HeroMedia } from '@/lib/siteContent';
import { Loader2, Save, Plus, Trash2, Upload, Image, Video, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function SiteContentPage() {
  const [media, setMedia] = useState<HeroMedia>(DEFAULT_HERO_MEDIA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    getHeroMedia().then((data) => {
      setMedia(data);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (file: File, target: 'video_thumbnail' | 'gallery', galleryIndex?: number) => {
    const uploadKey = target === 'gallery' ? `gallery-${galleryIndex}` : target;
    setUploading(uploadKey);

    const ext = file.name.split('.').pop();
    const fileName = `site-content/${Date.now()}.${ext}`;

    const { error, data } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      toast.error('Upload failed: ' + error.message);
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(data.path);
    const publicUrl = urlData.publicUrl;

    if (target === 'video_thumbnail') {
      setMedia((prev) => ({ ...prev, video_thumbnail: publicUrl }));
    } else if (target === 'gallery' && galleryIndex !== undefined) {
      setMedia((prev) => {
        const gallery = [...prev.gallery];
        gallery[galleryIndex] = { ...gallery[galleryIndex], url: publicUrl };
        return { ...prev, gallery };
      });
    }

    setUploading(null);
    toast.success('Image uploaded');
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await saveHeroMedia(media);
    setSaving(false);
    if (success) {
      toast.success('Homepage media updated');
    } else {
      toast.error('Failed to save. Make sure the site_content table exists.');
    }
  };

  const addGalleryItem = () => {
    setMedia((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { url: '', label: '' }],
    }));
  };

  const removeGalleryItem = (index: number) => {
    setMedia((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Homepage Media</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the video and images on your homepage hero section</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50 text-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Setup notice */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
        <strong>First time?</strong> Run this SQL in your Supabase SQL editor:
        <pre className="mt-2 p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-xs overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS site_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);`}
        </pre>
      </div>

      {/* Hero Video */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Video className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Hero Video</h2>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">Video URL</label>
          <input
            type="url"
            value={media.video_url}
            onChange={(e) => setMedia((prev) => ({ ...prev, video_url: e.target.value }))}
            placeholder="https://videos.pexels.com/..."
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
          />
          <p className="text-xs text-muted-foreground mt-1">Direct MP4 link or YouTube embed URL</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">Video Thumbnail</label>
          <div className="flex gap-3 items-start">
            <input
              type="url"
              value={media.video_thumbnail}
              onChange={(e) => setMedia((prev) => ({ ...prev, video_thumbnail: e.target.value }))}
              placeholder="https://images.pexels.com/..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
            />
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl cursor-pointer hover:bg-secondary/80 transition-all text-sm">
              {uploading === 'video_thumbnail' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file, 'video_thumbnail');
                }}
              />
            </label>
          </div>
          {media.video_thumbnail && (
            <div className="mt-3 rounded-xl overflow-hidden border border-border w-48 aspect-video">
              <img src={media.video_thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Gallery Images</h2>
          </div>
          <button
            onClick={addGalleryItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        <div className="space-y-4">
          {media.gallery.map((item, index) => (
            <div key={index} className="flex gap-3 items-start p-4 bg-muted/30 rounded-xl border border-border">
              <div className="flex-1 space-y-3">
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => {
                      const gallery = [...media.gallery];
                      gallery[index] = { ...gallery[index], url: e.target.value };
                      setMedia((prev) => ({ ...prev, gallery }));
                    }}
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary text-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-all text-sm">
                    {uploading === `gallery-${index}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file, 'gallery', index);
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const gallery = [...media.gallery];
                    gallery[index] = { ...gallery[index], label: e.target.value };
                    setMedia((prev) => ({ ...prev, gallery }));
                  }}
                  placeholder="Label (e.g. Client Meetings)"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
              </div>

              {item.url && (
                <div className="w-20 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                </div>
              )}

              <button
                onClick={() => removeGalleryItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Preview</h2>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden aspect-video bg-black border border-border">
            <img src={media.video_thumbnail} alt="Hero preview" className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {media.gallery.map((img, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden aspect-[4/3] border border-border">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-white text-[10px] font-medium">{img.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
