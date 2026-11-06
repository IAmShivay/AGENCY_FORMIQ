'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { X, Upload, Loader2 } from 'lucide-react';
import { ADMIN_BADGE, ADMIN_BTN_OUTLINE, ADMIN_BTN_PRIMARY, ADMIN_H2, ADMIN_ICON_BTN, ADMIN_INPUT, ADMIN_LABEL, ADMIN_TONE } from './admin-ui';

const HINT = 'text-xs text-muted-foreground';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface Author {
  id: string;
  name: string;
}

interface BlogFormProps {
  postId?: string;
}

export default function BlogForm({ postId }: BlogFormProps) {
  const router = useRouter();
  const isEditing = !!postId;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author_id: '',
    coverImage: '',
    tags: [] as string[],
    readingTime: 5,
  });

  const [authors, setAuthors] = useState<Author[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchAuthors = async () => {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('id, name');

      if (error) {
        console.error('Error fetching authors:', error);
        return;
      }

      setAuthors(data || []);

      if (data && data.length > 0 && !isEditing) {
        setFormData(prev => ({ ...prev, author_id: data[0].id }));
      }
    };

    const fetchPostData = async () => {
      if (!postId) return;

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            category: data.category || '',
            author_id: data.author_id || '',
            coverImage: data.cover_image || '',
            tags: data.tags || [],
            readingTime: data.reading_time || 5,
          });

          if (data.cover_image) {
            setImagePreview(data.cover_image);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
    fetchPostData();
  }, [postId, isEditing]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'title') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));

    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    setFormData(prev => ({ ...prev, readingTime }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
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

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.coverImage;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `blog-covers/${fileName}`;

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
      let coverImageUrl = formData.coverImage;
      if (imageFile) {
        coverImageUrl = await uploadImage() || coverImageUrl;
      }

      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author_id: formData.author_id,
        cover_image: coverImageUrl,
        tags: formData.tags,
        reading_time: formData.readingTime,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([{
            ...postData,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
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
        <h2 className={ADMIN_H2}>Post details</h2>
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

          <div className="space-y-2">
            <label htmlFor="slug" className={`${ADMIN_LABEL} block`}>
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className={`${ADMIN_INPUT} font-mono`}
            />
            <p className={HINT}>
              URL-friendly name (auto-generated from title)
            </p>
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
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="author_id" className={`${ADMIN_LABEL} block`}>
              Author *
            </label>
            <select
              id="author_id"
              name="author_id"
              value={formData.author_id}
              onChange={handleChange}
              required
              className={ADMIN_INPUT}
            >
              <option value="">Select an author</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="readingTime" className={`${ADMIN_LABEL} block`}>
              Reading time (minutes)
            </label>
            <input
              type="number"
              id="readingTime"
              name="readingTime"
              value={formData.readingTime}
              onChange={handleChange}
              min="1"
              className={`${ADMIN_INPUT} tabular-nums`}
            />
            <p className={HINT}>
              Auto-calculated based on content length
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className={ADMIN_H2}>Cover image *</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="flex flex-1 cursor-pointer justify-center rounded-2xl border border-dashed border-input px-6 py-8 transition-colors hover:border-foreground/40 hover:bg-muted/40">
            <div className="space-y-2 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Upload a file</span> or drag and drop
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          {imagePreview && (
            <div className="relative h-32 w-full flex-shrink-0 overflow-hidden rounded-xl border border-border sm:w-48">
              <img
                src={imagePreview}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                  if (!isEditing) {
                    setFormData(prev => ({ ...prev, coverImage: '' }));
                  }
                }}
                className={`${ADMIN_ICON_BTN} absolute right-1.5 top-1.5 h-7 w-7 bg-foreground text-background hover:bg-destructive hover:text-destructive-foreground`}
                aria-label="Remove cover image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className={ADMIN_H2}>Summary & tags</h2>
        <div className="space-y-2">
          <label htmlFor="excerpt" className={`${ADMIN_LABEL} block`}>
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            required
            className={`${ADMIN_INPUT} h-auto py-2.5`}
          ></textarea>
          <p className={HINT}>
            A brief summary of the post (displayed in blog listings)
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="tags" className={`${ADMIN_LABEL} block`}>
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            onBlur={addTag}
            className={ADMIN_INPUT}
            placeholder="Add a tag and press Enter"
          />
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.tags.map((tag) => (
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
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className={ADMIN_H2}>Content *</h2>
        <div className="prose-editor">
          <ReactQuill
            value={formData.content}
            onChange={handleEditorChange}
            theme="snow"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean'],
                [{ 'color': [] }, { 'background': [] }],
                ['code-block']
              ],
            }}
            className="mb-12 h-64 bg-background text-foreground"
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/blogs')}
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
            <>Save post</>
          )}
        </button>
      </div>
    </form>
  );
}
