'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Upload, X, Loader2 } from 'lucide-react';
import { ADMIN_BTN_OUTLINE, ADMIN_BTN_PRIMARY, ADMIN_H2, ADMIN_ICON_BTN, ADMIN_INPUT, ADMIN_LABEL } from './admin-ui';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        const { error } = await supabase
          .from('blog_authors')
          .update(authorData)
          .eq('id', authorId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_authors')
          .insert([authorData]);

        if (error) throw error;
      }

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
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-5">
        <h2 className={ADMIN_H2}>Profile</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className={`${ADMIN_LABEL} block`}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={ADMIN_INPUT}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className={`${ADMIN_LABEL} block`}>
              Role *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className={ADMIN_INPUT}
              placeholder="e.g. Lead Developer, UX Designer"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h2 className={ADMIN_H2}>Avatar *</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="flex flex-1 cursor-pointer justify-center rounded-2xl border border-dashed border-input px-6 py-8 transition-colors hover:border-foreground/40 hover:bg-muted/40">
            <div className="space-y-2 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Upload a file</span> or drag and drop
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
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
          {imagePreview && (
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border border-border">
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
                className={`${ADMIN_ICON_BTN} absolute right-1 top-1 h-7 w-7 bg-foreground text-background hover:bg-destructive hover:text-destructive-foreground`}
                aria-label="Remove avatar"
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
        <h2 className={ADMIN_H2}>Biography</h2>
        <div className="space-y-2">
          <label htmlFor="bio" className={`${ADMIN_LABEL} block`}>
            Bio *
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            required
            className={`${ADMIN_INPUT} h-auto py-2.5`}
          ></textarea>
          <p className="text-sm text-muted-foreground">
            A brief biography of the author
          </p>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin/authors')}
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
            <>Save author</>
          )}
        </button>
      </div>
    </form>
  );
}
