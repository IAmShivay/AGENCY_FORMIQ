'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { X, Upload, Loader2, Plus } from 'lucide-react';
import { AppProject } from '@/lib/portfolio';

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

  // Platform options
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // Handle feature input
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

  // Handle platform selection
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
    if (!imageFile) return formData.image || null;
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `portfolio-apps/${fileName}`;
    
    try {
      const { error: uploadError, data } = await supabase.storage
        .from('blog-images') // Reusing the same bucket for simplicity
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
        // Update existing app
        const { error } = await supabase
          .from('portfolio_apps')
          .update(appData)
          .eq('id', appId);
        
        if (error) throw error;
      } else {
        // Create new app
        const { error } = await supabase
          .from('portfolio_apps')
          .insert([{
            ...appData,
            created_at: new Date().toISOString(),
          }]);
        
        if (error) throw error;
      }
      
      // Redirect to apps list
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

        {/* Description */}
        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Link */}
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            App Link
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com or app store link"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Platforms */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Platforms *
          </label>
          <div className="flex flex-wrap gap-2">
            {platformOptions.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => togglePlatform(platform)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  formData.platforms?.includes(platform)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
          {formData.platforms?.length === 0 && (
            <p className="mt-1 text-sm text-red-500">Please select at least one platform</p>
          )}
        </div>

        {/* Tags */}
        <div className="col-span-2">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Technologies/Tags
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag and press Enter"
              className="flex-1 min-w-0 block w-full border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary/70"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary/70 dark:text-primary hover:bg-primary/20 dark:hover:bg-primary/20"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="col-span-2">
          <label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Key Features
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="featureInput"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={handleFeatureInputKeyDown}
              placeholder="Add a feature and press Enter"
              className="flex-1 min-w-0 block w-full border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.features?.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 dark:text-green-500 hover:bg-green-200 dark:hover:bg-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* App Image */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            App Screenshot/Image *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-64 w-auto object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-primary focus-within:outline-none"
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/apps')}
          className="mr-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || formData.platforms?.length === 0}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {isEditing ? 'Update App' : 'Create App'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
