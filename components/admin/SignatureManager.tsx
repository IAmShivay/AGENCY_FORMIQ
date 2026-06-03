'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Upload, 
  Trash2, 
  Save, 
  X,
  PenTool,
  Image as ImageIcon,
  User,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Image from 'next/image';

interface Signature {
  id: string;
  name: string;
  role: string;
  image_url: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

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

      // Upload new image if selected
      if (selectedFile) {
        imageUrl = await uploadSignature(selectedFile);
      }

      // If this is set as default, first remove default from all other signatures
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
        // Update existing signature
        const { error } = await supabase
          .from('signatures')
          .update(signatureData)
          .eq('id', editingSignature.id);

        if (error) throw error;
        toast.success('Signature updated successfully');
      } else {
        // Create new signature
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
      // Delete from database
      const { error } = await supabase
        .from('signatures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete image from storage
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
      // Remove default from all signatures
      await supabase
        .from('signatures')
        .update({ is_default: false });

      // Set this signature as default
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If this is just a selector component
  if (showSelector) {
    return (
      <div className="space-y-4">
        <Label>Digital Signature</Label>
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
                <div className="flex items-center gap-2 p-2 border rounded">
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Digital Signatures</h2>
          <p className="text-muted-foreground">Manage digital signatures for quotations</p>
        </div>
        <Button onClick={startCreating}>
          <Upload className="w-4 h-4 mr-2" />
          Add Signature
        </Button>
      </div>

      {signatures.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <PenTool className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No signatures found</h3>
            <p className="text-muted-foreground mb-4">Add your first digital signature</p>
            <Button onClick={startCreating}>
              <Upload className="w-4 h-4 mr-2" />
              Add Signature
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              {editingSignature ? 'Edit Signature' : 'Add New Signature'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., John Doe"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Role *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., CEO, Project Manager"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Signature Image *</Label>
              <div className="mt-1 space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {selectedFile ? 'Change Image' : 'Upload Image'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">
                    PNG, JPG up to 5MB
                  </span>
                </div>

                {/* Preview */}
                {(previewUrl || editingSignature?.image_url) && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <Image
                      src={previewUrl || editingSignature?.image_url || ''}
                      alt="Signature preview"
                      width={200}
                      height={100}
                      className="object-contain border rounded bg-white"
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
                className="rounded"
              />
              <Label htmlFor="is_default_signature">Set as default signature</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={saveSignature} disabled={uploading}>
                <Save className="w-4 h-4 mr-2" />
                {uploading ? 'Saving...' : editingSignature ? 'Update' : 'Add'} Signature
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signatures List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signatures.map(signature => (
          <Card key={signature.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{signature.name}</CardTitle>
                    {signature.is_default && (
                      <Badge variant="default" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{signature.role}</p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(signature.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded border flex items-center justify-center min-h-[80px]">
                <Image
                  src={signature.image_url}
                  alt={signature.name}
                  width={150}
                  height={75}
                  className="object-contain max-h-[75px]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{signature.name} - {signature.role}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 text-center">
                      <div className="bg-gray-50 p-8 rounded border inline-block">
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
                  <User className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                {!signature.is_default && (
                  <Button variant="outline" size="sm" onClick={() => setAsDefault(signature.id)}>
                    Set Default
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSignature(signature.id, signature.image_url)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
