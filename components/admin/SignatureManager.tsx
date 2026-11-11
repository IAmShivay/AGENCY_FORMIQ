'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Upload, 
  Trash2, 
  Save, 
  X,
  User,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  ADMIN_BADGE,
  ADMIN_BTN_DANGER,
  ADMIN_BTN_GHOST,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EMPTY,
  ADMIN_EYEBROW,
  ADMIN_H2,
  ADMIN_TONE,
} from '@/components/admin/admin-ui';

interface Signature {
  id: string;
  name: string;
  role: string;
  image_url: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const CHECKBOX_CLASS = 'h-4 w-4 shrink-0 cursor-pointer border-input accent-primary';

interface SignatureManagerProps {
  selectedSignatureId?: string;
  onSignatureSelect?: (signatureId: string, signature: Signature) => void;
  showSelector?: boolean;
}

export default function SignatureManager({ 
  selectedSignatureId, 
  onSignatureSelect, 
  showSelector = false 
}: SignatureManagerProps) {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSignature, setEditingSignature] = useState<Signature | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    is_default: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSignatures();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl('');
    }
  }, [selectedFile]);

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('signatures')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignatures(data || []);
    } catch (error) {
      console.error('Error fetching signatures:', error);
      toast.error('Failed to fetch signatures');
    } finally {
      setLoading(false);
    }
  };

  const uploadSignature = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `signature_${Date.now()}.${fileExt}`;
    const filePath = `signatures/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('formiqstudio')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('formiqstudio')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const saveSignature = async () => {
    try {
      if (!formData.name.trim() || !formData.role.trim()) {
        toast.error('Please fill in all fields');
        return;
      }

      if (!editingSignature && !selectedFile) {
        toast.error('Please select a signature image');
        return;
      }

      setUploading(true);

      let imageUrl = editingSignature?.image_url || '';

      if (selectedFile) {
        imageUrl = await uploadSignature(selectedFile);
      }

      if (formData.is_default) {
        const { error: updateError } = await supabase
          .from('signatures')
          .update({ is_default: false })
          .neq('id', editingSignature?.id || 'new');

        if (updateError) throw updateError;
      }

      const signatureData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        image_url: imageUrl,
        is_default: formData.is_default,
        updated_at: new Date().toISOString()
      };

      if (editingSignature) {
        const { error } = await supabase
          .from('signatures')
          .update(signatureData)
          .eq('id', editingSignature.id);

        if (error) throw error;
        toast.success('Signature updated successfully');
      } else {
        const { error } = await supabase
          .from('signatures')
          .insert([{
            ...signatureData,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Signature created successfully');
      }

      resetForm();
      fetchSignatures();
    } catch (error) {
      console.error('Error saving signature:', error);
      toast.error('Failed to save signature');
    } finally {
      setUploading(false);
    }
  };

  const deleteSignature = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this signature?')) return;

    try {
      const { error } = await supabase
        .from('signatures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const filePath = imageUrl.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('formiqstudio')
          .remove([`signatures/${filePath}`]);
      }

      toast.success('Signature deleted successfully');
      fetchSignatures();
    } catch (error) {
      console.error('Error deleting signature:', error);
      toast.error('Failed to delete signature');
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      await supabase
        .from('signatures')
        .update({ is_default: false });

      const { error } = await supabase
        .from('signatures')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      toast.success('Default signature updated');
      fetchSignatures();
    } catch (error) {
      console.error('Error setting default signature:', error);
      toast.error('Failed to set default signature');
    }
  };

  const startEditing = (signature: Signature) => {
    setEditingSignature(signature);
    setFormData({
      name: signature.name,
      role: signature.role,
      is_default: signature.is_default
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const startCreating = () => {
    setEditingSignature(null);
    setFormData({
      name: '',
      role: '',
      is_default: false
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSignature(null);
    setIsDialogOpen(false);
    setFormData({
      name: '',
      role: '',
      is_default: false
    });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground"></div>
      </div>
    );
  }

  if (showSelector) {
    return (
      <div className="space-y-4">
        <Label>Digital signature</Label>
        <Select
          value={selectedSignatureId || "none"}
          onValueChange={(value) => {
            if (value === "none") {
              if (onSignatureSelect) {
                onSignatureSelect("", {} as any);
              }
            } else {
              const signature = signatures.find(s => s.id === value);
              if (signature && onSignatureSelect) {
                onSignatureSelect(signature.id, signature);
              }
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select signature" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No signature</SelectItem>
            {signatures.map(signature => (
              <SelectItem key={signature.id} value={signature.id}>
                {signature.name} - {signature.role} {signature.is_default && '(Default)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedSignatureId && selectedSignatureId !== "none" && (
          <div className="mt-2">
            {(() => {
              const signature = signatures.find(s => s.id === selectedSignatureId);
              return signature ? (
                <div className="flex items-center gap-3 rounded-xl border border-border p-2">
                  <Image
                    src={signature.image_url}
                    alt={signature.name}
                    width={60}
                    height={30}
                    className="object-contain"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{signature.name}</p>
                    <p className="text-muted-foreground">{signature.role}</p>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button type="button" onClick={startCreating} className={ADMIN_BTN_PRIMARY}>
          <Upload className="h-4 w-4" />
          Add signature
        </button>
      </div>

      {signatures.length === 0 && !loading && (
        <div className={`${ADMIN_CARD} ${ADMIN_EMPTY}`}>
          <p className="font-medium text-foreground">No signatures found</p>
          <p className="mt-1">Add your first digital signature</p>
          <button type="button" onClick={startCreating} className={`${ADMIN_BTN_OUTLINE} mt-6`}>
            <Upload className="h-4 w-4" />
            Add signature
          </button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSignature ? 'Edit signature' : 'Add new signature'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., CEO, Project Manager"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Signature image *</Label>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className={ADMIN_BTN_OUTLINE}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    {selectedFile ? 'Change image' : 'Upload image'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className={ADMIN_EYEBROW}>
                    PNG, JPG up to 5MB
                  </span>
                </div>

                {(previewUrl || editingSignature?.image_url) && (
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className={`${ADMIN_EYEBROW} mb-3`}>Preview</p>
                    <Image
                      src={previewUrl || editingSignature?.image_url || ''}
                      alt="Signature preview"
                      width={200}
                      height={100}
                      className="rounded-xl border border-border bg-card object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default_signature"
                checked={formData.is_default}
                onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                className={CHECKBOX_CLASS}
              />
              <Label htmlFor="is_default_signature">Set as default signature</Label>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border pt-5">
              <button type="button" className={ADMIN_BTN_PRIMARY} onClick={saveSignature} disabled={uploading}>
                <Save className="h-4 w-4" />
                {uploading ? 'Saving...' : editingSignature ? 'Update' : 'Add'} signature
              </button>
              <button type="button" className={ADMIN_BTN_GHOST} onClick={resetForm}>
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {signatures.map(signature => (
          <div key={signature.id} className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} flex min-w-0 flex-col gap-5`}>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`${ADMIN_H2} min-w-0 truncate text-lg`}>{signature.name}</h3>
                {signature.is_default && (
                  <span className={`${ADMIN_BADGE} ${ADMIN_TONE.accent}`}>
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{signature.role}</p>
              <p className={`${ADMIN_EYEBROW} mt-2`}>
                Added {new Date(signature.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex min-h-[80px] items-center justify-center rounded-xl border border-border bg-background p-4">
              <Image
                src={signature.image_url}
                alt={signature.name}
                width={150}
                height={75}
                className="max-h-[75px] object-contain"
              />
            </div>

            <div className="mt-auto flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{signature.name} - {signature.role}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 text-center">
                    <div className="inline-block rounded-xl border border-border bg-background p-8">
                      <Image
                        src={signature.image_url}
                        alt={signature.name}
                        width={300}
                        height={150}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" onClick={() => startEditing(signature)}>
                <User className="h-4 w-4" />
                Edit
              </Button>

              {!signature.is_default && (
                <Button variant="outline" size="sm" onClick={() => setAsDefault(signature.id)}>
                  Set default
                </Button>
              )}

              <button
                type="button"
                onClick={() => deleteSignature(signature.id, signature.image_url)}
                className={`${ADMIN_BTN_DANGER} h-9 px-4 text-[13px]`}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
