'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { X, Upload, Loader2 } from 'lucide-react';

// Import React Quill dynamically to avoid SSR issues
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

  // Fetch authors and post data if editing
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
      
      // Set default author if available and not editing
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

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  // Handle rich text editor changes
  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    
    // Estimate reading time (rough calculation: average reading speed is ~200-250 words per minute)
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    setFormData(prev => ({ ...prev, readingTime }));
  };

  // Handle tag input
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

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload image to Supabase Storage
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
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Upload image if selected
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
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId);
        
        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([{
            ...postData,
            created_at: new Date().toISOString(),
          }]);
        
        if (error) throw error;
      }
      
      // Redirect to blog posts list
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            URL-friendly name (auto-generated from title)
          </p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select a category</option>
            <option value="Web Development">Web Development</option>
            <option value="Design">Design</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Author *
          </label>
          <select
            id="author_id"
            name="author_id"
            value={formData.author_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select an author</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reading Time */}
        <div>
          <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Reading Time (minutes)
          </label>
          <input
            type="number"
            id="readingTime"
            name="readingTime"
            value={formData.readingTime}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Auto-calculated based on content length
          </p>
        </div>

        {/* Cover Image */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cover Image *
          </label>
          <div className="mt-1 flex items-center">
            <div className="flex-grow">
              <label className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md cursor-pointer hover:border-primary">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <span className="relative rounded-md font-medium text-primary hover:text-primary">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
            </div>
            {imagePreview && (
              <div className="ml-4 relative h-32 w-32 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
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
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div className="col-span-2">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          ></textarea>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            A brief summary of the post (displayed in blog listings)
          </p>
        </div>

        {/* Tags */}
        <div className="col-span-2">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              onBlur={addTag}
              className="flex-1 min-w-0 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              placeholder="Add a tag and press Enter"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary/70"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary/70 hover:text-primary focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content *
          </label>
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
              className="h-64 mb-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/blogs')}
          className="mr-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>Save Post</>
          )}
        </button>
      </div>
    </form>
  );
}
