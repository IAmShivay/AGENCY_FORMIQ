'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { X, Upload, Loader2, Plus } from 'lucide-react';
import { WebsiteProject } from '@/lib/portfolio';
import { ADMIN_BADGE, ADMIN_BTN_OUTLINE, ADMIN_BTN_PRIMARY, ADMIN_H2, ADMIN_ICON_BTN, ADMIN_INPUT, ADMIN_LABEL, ADMIN_TONE } from '@/components/admin/admin-ui';

const TEXTAREA = `${ADMIN_INPUT} h-auto py-2.5`;
const DROPZONE = 'flex justify-center rounded-2xl border border-dashed border-input px-6 py-8';
const UPLOAD_LINK = 'relative cursor-pointer rounded-md font-medium text-foreground underline-offset-4 hover:underline focus-within:outline-none';
const REMOVE_BTN = 'absolute h-7 w-7 bg-foreground text-background hover:bg-destructive hover:text-destructive-foreground';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface WebsiteFormProps {
  websiteId?: string;
}

export default function WebsiteForm({ websiteId }: WebsiteFormProps) {
  const router = useRouter();
  const isEditing = !!websiteId;

  const [formData, setFormData] = useState<Partial<WebsiteProject>>({
    title: '',
    description: '',
    image: '',
    tags: [],
    link: '',
    category: '',
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

  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [screenFiles, setScreenFiles] = useState<File[]>([]);
  const [screenPreviews, setScreenPreviews] = useState<string[]>([]);

  const categories = ['E-Commerce', 'Corporate', 'Educational', 'Landing Pages', 'Portfolio', 'Blog', 'Other'];

  useEffect(() => {
    const fetchWebsiteData = async () => {
      if (!websiteId) return;

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('portfolio_websites')
          .select('*')
          .eq('id', websiteId)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            image: data.image || '',
            tags: data.tags || [],
            link: data.link || '',
            category: data.category || '',
            completion_date: data.completion_date || '',
            features: data.features || [],
            live_link: data.live_link || '',
            repo_link: data.repo_link || '',
            case_study_challenge: data.case_study_challenge || '',
            case_study_solution: data.case_study_solution || '',
            case_study_results: data.case_study_results || '',
            case_study_testimonial: data.case_study_testimonial || '',
            case_study_screens: data.case_study_screens || []
          });

          if (data.image) {
            setImagePreview(data.image);
          }
        }
      } catch (error) {
        console.error('Error fetching website:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
  }, [websiteId, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRichTextChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleScreensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setScreenFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenPreview = (index: number) => {
    setScreenPreviews(prev => prev.filter((_, i) => i !== index));
    setScreenFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image || null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `portfolio-websites/${fileName}`;

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

  const uploadScreens = async (): Promise<string[]> => {
    if (screenFiles.length === 0) return formData.case_study_screens || [];

    const uploadedUrls: string[] = [];

    for (const file of screenFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${uploadedUrls.length}.${fileExt}`;
      const filePath = `portfolio-websites/screens/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading screen:', error);
      }
    }

    return [...(formData.case_study_screens || []), ...uploadedUrls];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const imageUrl = await uploadImage();
      const screenUrls = await uploadScreens();

      const websiteData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        tags: formData.tags,
        link: formData.link,
        category: formData.category,
        completion_date: formData.completion_date,
        features: formData.features,
        live_link: formData.live_link,
        repo_link: formData.repo_link,
        case_study_challenge: formData.case_study_challenge,
        case_study_solution: formData.case_study_solution,
        case_study_results: formData.case_study_results,
        case_study_testimonial: formData.case_study_testimonial,
        case_study_screens: screenUrls
      };

      if (isEditing) {
        const { error } = await supabase
          .from('portfolio_websites')
          .update(websiteData)
          .eq('id', websiteId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_websites')
          .insert([{
            ...websiteData,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
      }

      router.push('/admin/websites');
      router.refresh();
    } catch (error) {
      console.error('Error saving website:', error);
      alert('Failed to save website. Please try again.');
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
        <h2 className={ADMIN_H2}>Project details</h2>
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
              className={TEXTAREA}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className={`${ADMIN_LABEL} block`}>
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={ADMIN_INPUT}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="completion_date" className={`${ADMIN_LABEL} block`}>
              Completion date
            </label>
            <input
              type="text"
              id="completion_date"
              name="completion_date"
              value={formData.completion_date}
              onChange={handleChange}
              placeholder="e.g., March 2024"
              className={ADMIN_INPUT}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="live_link" className={`${ADMIN_LABEL} block`}>
              Live website URL
            </label>
            <input
              type="url"
              id="live_link"
              name="live_link"
              value={formData.live_link}
              onChange={handleChange}
              placeholder="https://example.com"
              className={ADMIN_INPUT}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="repo_link" className={`${ADMIN_LABEL} block`}>
              Repository URL
            </label>
            <input
              type="url"
              id="repo_link"
              name="repo_link"
              value={formData.repo_link}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              className={ADMIN_INPUT}
            />
          </div>
        </div>
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
        <h2 className={ADMIN_H2}>Cover image</h2>
        <div className={DROPZONE}>
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
                  className={`${ADMIN_ICON_BTN} ${REMOVE_BTN} right-2 top-2`}
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
                    className={UPLOAD_LINK}
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

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className={ADMIN_H2}>Case study</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="case_study_challenge" className={`${ADMIN_LABEL} block`}>
              Case study: the challenge
            </label>
            <textarea
              id="case_study_challenge"
              name="case_study_challenge"
              value={formData.case_study_challenge}
              onChange={handleChange}
              rows={3}
              className={TEXTAREA}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="case_study_solution" className={`${ADMIN_LABEL} block`}>
              Case study: the solution
            </label>
            <textarea
              id="case_study_solution"
              name="case_study_solution"
              value={formData.case_study_solution}
              onChange={handleChange}
              rows={3}
              className={TEXTAREA}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="case_study_results" className={`${ADMIN_LABEL} block`}>
              Case study: the results
            </label>
            <textarea
              id="case_study_results"
              name="case_study_results"
              value={formData.case_study_results}
              onChange={handleChange}
              rows={3}
              className={TEXTAREA}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="case_study_testimonial" className={`${ADMIN_LABEL} block`}>
              Client testimonial
            </label>
            <textarea
              id="case_study_testimonial"
              name="case_study_testimonial"
              value={formData.case_study_testimonial}
              onChange={handleChange}
              rows={3}
              className={TEXTAREA}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className={ADMIN_LABEL}>Case study screenshots</p>
          <div className={DROPZONE}>
            <div className="space-y-2 text-center">
              {(screenPreviews.length > 0 || !!formData.case_study_screens?.length) && (
                <div className="mb-4 flex flex-wrap justify-center gap-4">
                  {screenPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Screen ${index + 1}`}
                        className="h-32 w-auto max-w-full rounded-xl border border-border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeScreenPreview(index)}
                        className={`${ADMIN_ICON_BTN} ${REMOVE_BTN} right-1 top-1`}
                        aria-label={`Remove screen ${index + 1}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {formData.case_study_screens?.map((screen, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={screen}
                        alt={`Existing Screen ${index + 1}`}
                        className="h-32 w-auto max-w-full rounded-xl border border-border object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              <div className="flex flex-wrap justify-center text-sm text-muted-foreground">
                <label
                  htmlFor="screens-upload"
                  className={UPLOAD_LINK}
                >
                  <span>Upload screenshots</span>
                  <input
                    id="screens-upload"
                    name="screens-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handleScreensChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/websites')}
          className={ADMIN_BTN_OUTLINE}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className={ADMIN_BTN_PRIMARY}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {isEditing ? 'Update website' : 'Create website'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
