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
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BTN_GHOST,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_H2,
  ADMIN_ICON_BTN,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from '@/components/admin/admin-ui';

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
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="Content"
          title="Site content & popups"
          description="Manage the homepage hero media and the founder welcome video popup."
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content"
        title="Site content & popups"
        description="Manage the homepage hero media and the founder welcome video popup."
        actions={
          activeTab === 'hero' ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className={ADMIN_BTN_PRIMARY}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save hero media
            </button>
          ) : (
            <>
              <a
                href="/?preview_founder=true"
                target="_blank"
                rel="noopener noreferrer"
                className={ADMIN_BTN_OUTLINE}
              >
                <ExternalLink className="h-4 w-4" />
                Preview live popup
              </a>
              <button
                onClick={handleSaveFounderPopup}
                disabled={savingPopup}
                className={ADMIN_BTN_PRIMARY}
              >
                {savingPopup ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save founder popup
              </button>
            </>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`${activeTab === 'hero' ? ADMIN_BTN_PRIMARY : ADMIN_BTN_GHOST} h-auto min-h-[2.5rem] whitespace-normal py-2 text-left`}
        >
          <Video className="h-4 w-4 shrink-0" />
          Homepage hero media
        </button>
        <button
          onClick={() => setActiveTab('founder_popup')}
          className={`${activeTab === 'founder_popup' ? ADMIN_BTN_PRIMARY : ADMIN_BTN_GHOST} h-auto min-h-[2.5rem] whitespace-normal py-2 text-left`}
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          Founder video popup (first-time visitors)
        </button>
      </div>

      {activeTab === 'hero' ? (
        <>
          <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} space-y-5`}>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-muted-foreground" />
              <h2 className={ADMIN_H2}>Hero video</h2>
            </div>

            <div>
              <label className={`${ADMIN_LABEL} mb-2 block`}>Video URL</label>
              <input
                type="url"
                value={media.video_url}
                onChange={(e) => setMedia((prev) => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://videos.pexels.com/..."
                className={ADMIN_INPUT}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">Direct MP4 link or YouTube embed URL</p>
            </div>

            <div>
              <label className={`${ADMIN_LABEL} mb-2 block`}>Video thumbnail</label>
              <div className="flex items-start gap-3">
                <input
                  type="url"
                  value={media.video_thumbnail}
                  onChange={(e) => setMedia((prev) => ({ ...prev, video_thumbnail: e.target.value }))}
                  placeholder="https://images.pexels.com/..."
                  className={`${ADMIN_INPUT} min-w-0 flex-1`}
                />
                <label className={`${ADMIN_BTN_OUTLINE} shrink-0 cursor-pointer`}>
                  {uploading === 'video_thumbnail' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
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
                <div className="mt-3 aspect-video w-48 max-w-full overflow-hidden rounded-xl border border-border">
                  <img src={media.video_thumbnail} alt="Thumbnail preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} space-y-5`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-muted-foreground" />
                <h2 className={ADMIN_H2}>Gallery images</h2>
              </div>
              <button
                onClick={addGalleryItem}
                className={`${ADMIN_BTN_OUTLINE} h-9 px-3.5`}
              >
                <Plus className="h-4 w-4" /> Add image
              </button>
            </div>

            <div className="space-y-4">
              {media.gallery.map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                  <div className="min-w-0 flex-1 space-y-3">
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
                        className={`${ADMIN_INPUT} min-w-0 flex-1`}
                      />
                      <label className={`${ADMIN_ICON_BTN} h-10 w-10 shrink-0 cursor-pointer border border-border`}>
                        {uploading === `gallery-${index}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
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
                      className={ADMIN_INPUT}
                    />
                  </div>

                  {item.url && (
                    <div className="hidden h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-border sm:block">
                      <img src={item.url} alt={item.label} className="h-full w-full object-cover" />
                    </div>
                  )}

                  <button
                    onClick={() => removeGalleryItem(index)}
                    className={`${ADMIN_ICON_BTN} shrink-0 hover:bg-destructive/10 hover:text-destructive`}
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <h2 className={ADMIN_H2}>Preview</h2>
            </div>
            <div className="space-y-3">
              <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                <img src={media.video_thumbnail} alt="Hero preview" className="h-full w-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {media.gallery.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
                    <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                    <span className="absolute bottom-1.5 left-1.5 max-w-[calc(100%-0.75rem)] truncate rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground">{img.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className={`${ADMIN_CARD} flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">First-time visitor founder video</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Shows automatically to new visitors with your intro video, direct Consultation Form link, and WhatsApp button.
                </p>
              </div>
            </div>
            <a
              href="/?preview_founder=true"
              target="_blank"
              rel="noopener noreferrer"
              className={`${ADMIN_BTN_OUTLINE} h-9 shrink-0 px-3.5`}
            >
              <ExternalLink className="h-3.5 w-3.5" /> Test on live site
            </a>
          </div>

          <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} space-y-5`}>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-muted-foreground" />
              <h2 className={ADMIN_H2}>Founder video & media</h2>
            </div>

            <div>
              <label className={`${ADMIN_LABEL} mb-2 block`}>
                Founder video URL (MP4, YouTube, Vimeo or Loom)
              </label>
              <input
                type="url"
                value={founderPopup.video_url}
                onChange={(e) => setFounderPopup((prev) => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=... or https://...mp4"
                className={ADMIN_INPUT}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Supports direct video links (.mp4), YouTube URLs, Vimeo, or Loom links.
              </p>
            </div>

            <div>
              <label className={`${ADMIN_LABEL} mb-2 block`}>Video poster / thumbnail</label>
              <div className="flex items-start gap-3">
                <input
                  type="url"
                  value={founderPopup.video_thumbnail || ''}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, video_thumbnail: e.target.value }))}
                  placeholder="https://..."
                  className={`${ADMIN_INPUT} min-w-0 flex-1`}
                />
                <label className={`${ADMIN_BTN_OUTLINE} shrink-0 cursor-pointer`}>
                  {uploading === 'video_thumbnail' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
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
                <div className="mt-3 aspect-video w-48 max-w-full overflow-hidden rounded-xl border border-border">
                  <img src={founderPopup.video_thumbnail} alt="Thumbnail preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} space-y-5`}>
            <h2 className={ADMIN_H2}>Founder details & titles</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Founder name</label>
                <input
                  type="text"
                  value={founderPopup.founder_name}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, founder_name: e.target.value }))}
                  placeholder="Shivay Sharma"
                  className={ADMIN_INPUT}
                />
              </div>

              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Founder role / title</label>
                <input
                  type="text"
                  value={founderPopup.founder_role}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, founder_role: e.target.value }))}
                  placeholder="Founder & CEO"
                  className={ADMIN_INPUT}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Badge text</label>
                <input
                  type="text"
                  value={founderPopup.badge_text || "Founder's Message"}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, badge_text: e.target.value }))}
                  placeholder="Founder's Message"
                  className={ADMIN_INPUT}
                />
              </div>

              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Popup auto-open delay (seconds)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  value={founderPopup.delay_seconds || 1.2}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, delay_seconds: parseFloat(e.target.value) || 1.2 }))}
                  className={ADMIN_INPUT}
                />
              </div>
            </div>

            <div>
              <label className={`${ADMIN_LABEL} mb-2 block`}>Headline</label>
              <input
                type="text"
                value={founderPopup.heading}
                onChange={(e) => setFounderPopup((prev) => ({ ...prev, heading: e.target.value }))}
                placeholder="Transforming Ideas Into Reality"
                className={ADMIN_INPUT}
              />
            </div>

            <div>
              <label className={`${ADMIN_LABEL} mb-2 block`}>Subheading / description</label>
              <textarea
                rows={2}
                value={founderPopup.subheading}
                onChange={(e) => setFounderPopup((prev) => ({ ...prev, subheading: e.target.value }))}
                placeholder="Watch this quick video to see how we help businesses scale..."
                className={`${ADMIN_INPUT} h-auto resize-none py-2.5`}
              />
            </div>
          </div>

          <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} space-y-5`}>
            <h2 className={ADMIN_H2}>Calls to action (form link & WhatsApp)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>Form button text</label>
                <input
                  type="text"
                  value={founderPopup.form_button_text || 'Get Free Consultation'}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, form_button_text: e.target.value }))}
                  placeholder="Get Free Consultation"
                  className={ADMIN_INPUT}
                />
              </div>

              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>
                  Custom form URL (optional)
                </label>
                <input
                  type="url"
                  value={founderPopup.form_url || ''}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, form_url: e.target.value }))}
                  placeholder="Leave empty to use built-in 4-step Lead Consultation Form"
                  className={ADMIN_INPUT}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Leave empty to automatically open the interactive 4-step Lead Consultation Overlay.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>WhatsApp number</label>
                <input
                  type="tel"
                  value={founderPopup.whatsapp_number}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="919832078313"
                  className={ADMIN_INPUT}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">Country code without + or spaces (e.g. 919832078313)</p>
              </div>

              <div>
                <label className={`${ADMIN_LABEL} mb-2 block`}>WhatsApp button text</label>
                <input
                  type="text"
                  value={founderPopup.whatsapp_button_text || 'Chat on WhatsApp'}
                  onChange={(e) => setFounderPopup((prev) => ({ ...prev, whatsapp_button_text: e.target.value }))}
                  placeholder="Chat on WhatsApp"
                  className={ADMIN_INPUT}
                />
              </div>
            </div>

            <div>
              <label className={`${ADMIN_LABEL} mb-2 block`}>WhatsApp pre-filled message</label>
              <input
                type="text"
                value={founderPopup.whatsapp_message}
                onChange={(e) => setFounderPopup((prev) => ({ ...prev, whatsapp_message: e.target.value }))}
                placeholder="Hi Shivay! I saw your founder video on FormiqStudio and want to discuss my project."
                className={ADMIN_INPUT}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleSaveFounderPopup}
              disabled={savingPopup}
              className={`${ADMIN_BTN_PRIMARY} h-11 px-6`}
            >
              {savingPopup ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save founder popup settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
