'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { X, Upload, Loader2, Plus } from 'lucide-react';
import { AppProject } from '@/lib/portfolio';
import { ADMIN_BADGE, ADMIN_BTN_OUTLINE, ADMIN_BTN_PRIMARY, ADMIN_FOCUS, ADMIN_H2, ADMIN_ICON_BTN, ADMIN_INPUT, ADMIN_LABEL, ADMIN_TONE } from '@/components/admin/admin-ui';

interface AppFormProps {
  appId?: string;
}

export default function AppForm({ appId }: AppFormProps) {
  const router = useRouter();
  const isEditing = !!appId;

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

  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const platformOptions = ['Web', 'iOS', 'Android', 'macOS', 'Windows', 'iPad'];

  useEffect(() => {
    const fetchAppData = async () => {
      if (!appId) return;

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('portfolio_apps')
          .select('*')
          .eq('id', appId)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            image: data.image || '',
            tags: data.tags || [],
            platforms: data.platforms || [],
            link: data.link || '',
            features: data.features || [],
            year: data.year || ''
          });

          if (data.image) {
            setImagePreview(data.image);
          }
        }
      } catch (error) {
        console.error('Error fetching app:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppData();
  }, [appId, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleFeatureInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const addFeature = () => {
    const feature = featureInput.trim();
    if (feature && !formData.features?.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), feature]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(feature => feature !== featureToRemove) || []
    }));
  };

  const togglePlatform = (platform: string) => {
    if (formData.platforms?.includes(platform)) {
      setFormData(prev => ({
        ...prev,
        platforms: prev.platforms?.filter(p => p !== platform) || []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        platforms: [...(prev.platforms || []), platform]
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image || null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `portfolio-apps/${fileName}`;

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('blog-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress:any) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        } as any);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage() || imageUrl;
      }

      const appData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        tags: formData.tags,
        platforms: formData.platforms,
        link: formData.link,
        features: formData.features,
        year: formData.year
      };

      if (isEditing) {
        const { error } = await supabase
          .from('portfolio_apps')
          .update(appData)
          .eq('id', appId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_apps')
          .insert([{
            ...appData,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
      }

      router.push('/admin/apps');
      router.refresh();
    } catch (error) {
      console.error('Error saving app:', error);
      alert('Failed to save app. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-5">
        <h2 className={ADMIN_H2}>App details</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="title" className={`${ADMIN_LABEL} block`}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={ADMIN_INPUT}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className={`${ADMIN_LABEL} block`}>
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className={`${ADMIN_INPUT} h-auto py-2.5`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="year" className={`${ADMIN_LABEL} block`}>
              Year *
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              placeholder="e.g., 2024"
              className={`${ADMIN_INPUT} tabular-nums`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="link" className={`${ADMIN_LABEL} block`}>
              App link
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com or app store link"
              className={ADMIN_INPUT}
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className={ADMIN_H2}>Platforms *</h2>
        <div className="flex flex-wrap gap-2">
          {platformOptions.map((platform) => {
            const active = formData.platforms?.includes(platform);
            return (
              <button
                key={platform}
                type="button"
                onClick={() => togglePlatform(platform)}
                aria-pressed={active}
                className={`inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors ${ADMIN_FOCUS} ${
                  active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {platform}
              </button>
            );
          })}
        </div>
        {formData.platforms?.length === 0 && (
          <p className="text-sm text-destructive">Please select at least one platform</p>
        )}
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className={ADMIN_H2}>Technologies & features</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="tagInput" className={`${ADMIN_LABEL} block`}>
              Technologies/tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add a tag and press Enter"
                className={`${ADMIN_INPUT} min-w-0 flex-1`}
              />
              <button
                type="button"
                onClick={addTag}
                className={ADMIN_BTN_OUTLINE}
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            {!!formData.tags?.length && (
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className={`${ADMIN_BADGE} ${ADMIN_TONE.neutral} pr-1`}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:text-foreground"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="featureInput" className={`${ADMIN_LABEL} block`}>
              Key features
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="featureInput"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={handleFeatureInputKeyDown}
                placeholder="Add a feature and press Enter"
                className={`${ADMIN_INPUT} min-w-0 flex-1`}
              />
              <button
                type="button"
                onClick={addFeature}
                className={ADMIN_BTN_OUTLINE}
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            {!!formData.features?.length && (
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.features?.map((feature) => (
                  <span
                    key={feature}
                    className={`${ADMIN_BADGE} ${ADMIN_TONE.positive} pr-1`}
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-success/20"
                      aria-label={`Remove ${feature}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className={ADMIN_H2}>App screenshot/image *</h2>
        <div className="flex justify-center rounded-2xl border border-dashed border-input px-6 py-8">
          <div className="space-y-2 text-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-64 w-auto max-w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className={`${ADMIN_ICON_BTN} absolute right-2 top-2 h-7 w-7 bg-foreground text-background hover:bg-destructive hover:text-destructive-foreground`}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                <div className="flex flex-wrap justify-center text-sm text-muted-foreground">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer rounded-md font-medium text-foreground underline-offset-4 hover:underline focus-within:outline-none"
                  >
                    <span>Upload an image</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/apps')}
          className={ADMIN_BTN_OUTLINE}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || formData.platforms?.length === 0}
          className={ADMIN_BTN_PRIMARY}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {isEditing ? 'Update app' : 'Create app'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
