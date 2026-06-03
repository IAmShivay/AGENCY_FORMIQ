'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { X, Upload, Loader2, Plus } from 'lucide-react';
import { WebsiteProject } from '@/lib/portfolio';

// Import React Quill dynamically to avoid SSR issues
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

  // Website categories
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle rich text editor changes
  const handleRichTextChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // Handle main image upload
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

  // Handle case study screen uploads
  const handleScreensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files);
    setScreenFiles(prev => [...prev, ...newFiles]);
    
    // Create previews
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

  // Upload image to Supabase Storage
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image || null;
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `portfolio-websites/${fileName}`;
    
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

  // Upload case study screens to Supabase Storage
  const uploadScreens = async (): Promise<string[]> => {
    if (screenFiles.length === 0) return formData.case_study_screens || [];
    
    const uploadedUrls: string[] = [];
    
    for (const file of screenFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${uploadedUrls.length}.${fileExt}`;
      const filePath = `portfolio-websites/screens/${fileName}`;
      
      try {
        const { error: uploadError } = await supabase.storage
          .from('blog-images') // Reusing the same bucket for simplicity
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) throw uploadError;
        
        // Get public URL
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Upload images
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
        // Update existing website
        const { error } = await supabase
          .from('portfolio_websites')
          .update(websiteData)
          .eq('id', websiteId);
        
        if (error) throw error;
      } else {
        // Create new website
        const { error } = await supabase
          .from('portfolio_websites')
          .insert([{
            ...websiteData,
            created_at: new Date().toISOString(),
          }]);
        
        if (error) throw error;
      }
      
      // Redirect to websites list
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
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Completion Date */}
        <div>
          <label htmlFor="completion_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Completion Date
          </label>
          <input
            type="text"
            id="completion_date"
            name="completion_date"
            value={formData.completion_date}
            onChange={handleChange}
            placeholder="e.g., March 2024"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Live Link */}
        <div>
          <label htmlFor="live_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Website URL
          </label>
          <input
            type="url"
            id="live_link"
            name="live_link"
            value={formData.live_link}
            onChange={handleChange}
            placeholder="https://example.com"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Repository Link */}
        <div>
          <label htmlFor="repo_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Repository URL
          </label>
          <input
            type="url"
            id="repo_link"
            name="repo_link"
            value={formData.repo_link}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
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

        {/* Cover Image */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cover Image
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

        {/* Case Study Challenge */}
        <div className="col-span-2">
          <label htmlFor="case_study_challenge" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Case Study: The Challenge
          </label>
          <textarea
            id="case_study_challenge"
            name="case_study_challenge"
            value={formData.case_study_challenge}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Case Study Solution */}
        <div className="col-span-2">
          <label htmlFor="case_study_solution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Case Study: The Solution
          </label>
          <textarea
            id="case_study_solution"
            name="case_study_solution"
            value={formData.case_study_solution}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Case Study Results */}
        <div className="col-span-2">
          <label htmlFor="case_study_results" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Case Study: The Results
          </label>
          <textarea
            id="case_study_results"
            name="case_study_results"
            value={formData.case_study_results}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Case Study Testimonial */}
        <div className="col-span-2">
          <label htmlFor="case_study_testimonial" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Client Testimonial
          </label>
          <textarea
            id="case_study_testimonial"
            name="case_study_testimonial"
            value={formData.case_study_testimonial}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Case Study Screens */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Case Study Screenshots
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                {screenPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Screen ${index + 1}`}
                      className="h-32 w-auto object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeScreenPreview(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {formData.case_study_screens?.map((screen, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <img
                      src={screen}
                      alt={`Existing Screen ${index + 1}`}
                      className="h-32 w-auto object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="screens-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary hover:text-primary focus-within:outline-none"
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/websites')}
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
            <>
              {isEditing ? 'Update Website' : 'Create Website'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
