'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  getHeroMedia,
  saveHeroMedia,
  DEFAULT_HERO_MEDIA,
  type HeroMedia,
  getFounderPopupContent,
  saveFounderPopupContent,
  DEFAULT_FOUNDER_POPUP,
  type FounderPopupContent,
} from '@/lib/siteContent';
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  Upload,
  Image,
  Video,
  Eye,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SiteContentPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'founder_popup'>('hero');
  const [media, setMedia] = useState<HeroMedia>(DEFAULT_HERO_MEDIA);
  const [founderPopup, setFounderPopup] = useState<FounderPopupContent>(DEFAULT_FOUNDER_POPUP);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPopup, setSavingPopup] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getHeroMedia(), getFounderPopupContent()]).then(([heroData, popupData]) => {
      setMedia(heroData);
      setFounderPopup(popupData);
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

  const handleFounderUpload = async (file: File, field: 'video_thumbnail' | 'founder_avatar') => {
    setUploading(field);
    const ext = file.name.split('.').pop();
    const fileName = `site-content/founder-${Date.now()}.${ext}`;

    const { error, data } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      toast.error('Upload failed: ' + error.message);
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(data.path);
    setFounderPopup((prev) => ({ ...prev, [field]: urlData.publicUrl }));
    setUploading(null);
    toast.success('Image uploaded');
  };

  const handleSaveFounderPopup = async () => {
    setSavingPopup(true);
    const success = await saveFounderPopupContent(founderPopup);
    setSavingPopup(false);
    if (success) {
      toast.success('Founder video popup settings saved!');
    } else {
      toast.error('Failed to save settings. Please check your Supabase configuration.');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Site Content & Popups</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your homepage hero media and the founder welcome video popup
          </p>
        </div>

        {activeTab === 'hero' ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Hero Media
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <a
              href="/?preview_founder=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3.5 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-all gap-1.5"
            >
              <ExternalLink className="w-4 h-4 text-primary" />
              Preview Live Popup
            </a>
            <button
              onClick={handleSaveFounderPopup}
              disabled={savingPopup}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {savingPopup ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Founder Popup
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Video className="w-4 h-4" />
          Homepage Hero Media
        </button>
        <button
          onClick={() => setActiveTab('founder_popup')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'founder_popup'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Founder Video Popup (First-Time Visitors)
        </button>
      </div>

      {activeTab === 'hero' ? (
        <>
          {/* Hero Video */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-4">
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
                className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
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
                  className="flex-1 px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-md cursor-pointer hover:bg-secondary/80 transition-all text-sm">
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
                <div className="mt-3 rounded-md overflow-hidden border border-border w-48 aspect-video">
                  <img src={media.video_thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-4">
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
                <div key={index} className="flex gap-3 items-start p-4 bg-muted/30 rounded-md border border-border">
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
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Preview</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-md overflow-hidden aspect-video bg-black border border-border">
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
        </>
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">First-Time Visitor Founder Video</h4>
                <p className="text-xs text-muted-foreground">
                  Shows automatically to new visitors with your intro video, direct Consultation Form link, and WhatsApp button.
                </p>
              </div>
            </div>
            <a
              href="/?preview_founder=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary" /> Test on Live Site
            </a>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Video className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Founder Video & Media</h2>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">
                Founder Video URL (MP4, YouTube, Vimeo, or Loom)
              </label>
              <input
                type="url"
                value={founderPopup.video_url}
                onChange={(e) => setFounderPopup((prev) => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=... or https://...mp4"
                className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports direct video links (.mp4), YouTube URLs, Vimeo, or Loom links.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Video Poster / Thumbnail</label>
              <div className="flex gap-3 items-start">
                <input
                  type="url"
                  value={founderPopup.video_thumbnail || ''}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, video_thumbnail: e.target.value }))}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-md cursor-pointer hover:bg-secondary/80 transition-all text-sm">
                  {uploading === 'video_thumbnail' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFounderUpload(file, 'video_thumbnail');
                    }}
                  />
                </label>
              </div>
              {founderPopup.video_thumbnail && (
                <div className="mt-3 rounded-md overflow-hidden border border-border w-48 aspect-video">
                  <img src={founderPopup.video_thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Founder Details & Titles</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Founder Name</label>
                <input
                  type="text"
                  value={founderPopup.founder_name}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, founder_name: e.target.value }))}
                  placeholder="Shivay Sharma"
                  className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Founder Role / Title</label>
                <input
                  type="text"
                  value={founderPopup.founder_role}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, founder_role: e.target.value }))}
                  placeholder="Founder & CEO"
                  className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Badge Text</label>
                <input
                  type="text"
                  value={founderPopup.badge_text || "Founder's Message"}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, badge_text: e.target.value }))}
                  placeholder="Founder's Message"
                  className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Popup Auto-Open Delay (Seconds)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  value={founderPopup.delay_seconds || 1.2}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, delay_seconds: parseFloat(e.target.value) || 1.2 }))}
                  className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Headline</label>
              <input
                type="text"
                value={founderPopup.heading}
                onChange={(e) => setFounderPopup((prev) => ({ ...prev, heading: e.target.value }))}
                placeholder="Transforming Ideas Into Reality"
                className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">Subheading / Description</label>
              <textarea
                rows={2}
                value={founderPopup.subheading}
                onChange={(e) => setFounderPopup((prev) => ({ ...prev, subheading: e.target.value }))}
                placeholder="Watch this quick video to see how we help businesses scale..."
                className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none resize-none"
              />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Call to Actions (Form Link & WhatsApp)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Form Button Text</label>
                <input
                  type="text"
                  value={founderPopup.form_button_text || 'Get Free Consultation'}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, form_button_text: e.target.value }))}
                  placeholder="Get Free Consultation"
                  className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  Custom Form URL (Optional)
                </label>
                <input
                  type="url"
                  value={founderPopup.form_url || ''}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, form_url: e.target.value }))}
                  placeholder="Leave empty to use built-in 4-step Lead Consultation Form"
                  className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to automatically open the interactive 4-step Lead Consultation Overlay.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">WhatsApp Number</label>
                <input
                  type="tel"
                  value={founderPopup.whatsapp_number}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="919832078313"
                  className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
                <p className="text-xs text-muted-foreground mt-1">Country code without + or spaces (e.g. 919832078313)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">WhatsApp Button Text</label>
                <input
                  type="text"
                  value={founderPopup.whatsapp_button_text || 'Chat on WhatsApp'}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, whatsapp_button_text: e.target.value }))}
                  placeholder="Chat on WhatsApp"
                  className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">WhatsApp Pre-filled Message</label>
              <input
                type="text"
                value={founderPopup.whatsapp_message}
                onChange={(e) => setFounderPopup((prev) => ({ ...prev, whatsapp_message: e.target.value }))}
                placeholder="Hi Shivay! I saw your founder video on FormiqStudio and want to discuss my project."
                className="w-full px-4 py-2.5 rounded-md bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleSaveFounderPopup}
              disabled={savingPopup}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all gap-2"
            >
              {savingPopup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Founder Popup Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
