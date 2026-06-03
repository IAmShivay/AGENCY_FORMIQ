'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Upload, X, Loader2 } from 'lucide-react';

interface AuthorFormProps {
  authorId?: string;
}

export default function AuthorForm({ authorId }: AuthorFormProps) {
  const router = useRouter();
  const isEditing = !!authorId;

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    avatar: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch author data if editing
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!authorId) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('blog_authors')
          .select('*')
          .eq('id', authorId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormData({
            name: data.name || '',
            role: data.role || '',
            bio: data.bio || '',
            avatar: data.avatar || '',
          });
          
          if (data.avatar) {
            setImagePreview(data.avatar);
          }
        }
      } catch (error) {
        console.error('Error fetching author:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!imageFile) return formData.avatar;
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `author-avatars/${fileName}`;
    
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
      let avatarUrl = formData.avatar;
      if (imageFile) {
        avatarUrl = await uploadImage() || avatarUrl;
      }
      
      const authorData = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        avatar: avatarUrl,
      };
      
      if (isEditing) {
        // Update existing author
        const { error } = await supabase
          .from('blog_authors')
          .update(authorData)
          .eq('id', authorId);
        
        if (error) throw error;
      } else {
        // Create new author
        const { error } = await supabase
          .from('blog_authors')
          .insert([authorData]);
        
        if (error) throw error;
      }
      
      // Redirect to authors list
      router.push('/admin/authors');
      router.refresh();
    } catch (error) {
      console.error('Error saving author:', error);
      alert('Failed to save author. Please try again.');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role *
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
            placeholder="e.g. Lead Developer, UX Designer"
          />
        </div>

        {/* Avatar */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Avatar *
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
                    PNG, JPG, GIF up to 5MB
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
              <div className="ml-4 relative h-32 w-32 border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                    if (!isEditing) {
                      setFormData(prev => ({ ...prev, avatar: '' }));
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

        {/* Bio */}
        <div className="col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio *
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          ></textarea>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            A brief biography of the author
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/authors')}
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
            <>Save Author</>
          )}
        </button>
      </div>
    </form>
  );
}
