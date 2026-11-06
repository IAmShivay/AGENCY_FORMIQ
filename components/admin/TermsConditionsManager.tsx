'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Star,
  StarOff,
  Eye,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface TermsTemplate {
  id: string;
  name: string;
  content: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const CHECKBOX_CLASS = 'h-4 w-4 shrink-0 cursor-pointer border-input accent-primary';

interface TermsConditionsManagerProps {
  selectedTermsId?: string;
  onTermsSelect?: (termsId: string, content: string) => void;
  showSelector?: boolean;
}

export default function TermsConditionsManager({
  selectedTermsId,
  onTermsSelect,
  showSelector = false
}: TermsConditionsManagerProps) {
  const [templates, setTemplates] = useState<TermsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TermsTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<TermsTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    is_default: false
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('terms_templates')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching terms templates:', error);
      toast.error('Failed to fetch terms templates');
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    try {
      if (!formData.name.trim() || !formData.content.trim()) {
        toast.error('Please fill in all fields');
        return;
      }

      setSaving(true);

      if (formData.is_default) {
        const { error: updateError } = await supabase
          .from('terms_templates')
          .update({ is_default: false })
          .neq('id', editingTemplate?.id || 'new');

        if (updateError) throw updateError;
      }

      const templateData = {
        name: formData.name.trim(),
        content: formData.content.trim(),
        is_default: formData.is_default,
        updated_at: new Date().toISOString()
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('terms_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        toast.success('Template updated successfully');
      } else {
        const { error } = await supabase
          .from('terms_templates')
          .insert([{
            ...templateData,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Template created successfully');
      }

      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('terms_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      await supabase
        .from('terms_templates')
        .update({ is_default: false });

      const { error } = await supabase
        .from('terms_templates')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      toast.success('Default template updated');
      fetchTemplates();
    } catch (error) {
      console.error('Error setting default template:', error);
      toast.error('Failed to set default template');
    }
  };

  const startEditing = (template: TermsTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      is_default: template.is_default
    });
    setIsDialogOpen(true);
  };

  const startCreating = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      content: '',
      is_default: false
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setIsDialogOpen(false);
    setFormData({
      name: '',
      content: '',
      is_default: false
    });
  };

  const duplicateTemplate = (template: TermsTemplate) => {
    setEditingTemplate(null);
    setFormData({
      name: `${template.name} (Copy)`,
      content: template.content,
      is_default: false
    });
    setIsDialogOpen(true);
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
        <Label>Terms and conditions template</Label>
        <Select 
          value={selectedTermsId} 
          onValueChange={(value) => {
            const template = templates.find(t => t.id === value);
            if (template && onTermsSelect) {
              onTermsSelect(template.id, template.content);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select terms template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.name} {template.is_default && '(Default)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button type="button" onClick={startCreating} className={ADMIN_BTN_PRIMARY}>
          <Plus className="h-4 w-4" />
          New template
        </button>
      </div>

      {templates.length === 0 && !loading && (
        <div className={`${ADMIN_CARD} ${ADMIN_EMPTY}`}>
          <p className="font-medium text-foreground">No templates found</p>
          <p className="mt-1">Create your first terms and conditions template</p>
          <button type="button" onClick={startCreating} className={`${ADMIN_BTN_OUTLINE} mt-6`}>
            <Plus className="h-4 w-4" />
            Create template
          </button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit template' : 'Create new template'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-5">
            <div className="space-y-2">
              <Label>Template name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Standard Terms, Custom Project Terms"
              />
            </div>
            <div className="space-y-2">
              <Label>Terms and conditions content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={15}
                placeholder="Enter your terms and conditions..."
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                className={CHECKBOX_CLASS}
              />
              <Label htmlFor="is_default">Set as default template</Label>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border pt-5">
              <button type="button" className={ADMIN_BTN_PRIMARY} onClick={saveTemplate} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : editingTemplate ? 'Update' : 'Create'} template
              </button>
              <button type="button" className={ADMIN_BTN_GHOST} onClick={resetForm}>
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {templates.map(template => (
          <div key={template.id} className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} flex min-w-0 flex-col gap-5`}>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`${ADMIN_H2} min-w-0 truncate text-lg`}>{template.name}</h3>
                {template.is_default && (
                  <span className={`${ADMIN_BADGE} ${ADMIN_TONE.accent}`}>
                    <Star className="h-3 w-3" />
                    Default
                  </span>
                )}
              </div>
              <p className={`${ADMIN_EYEBROW} mt-2`}>
                Created {new Date(template.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="max-h-24 overflow-y-auto rounded-xl border border-border bg-background p-3 text-sm text-muted-foreground">
              <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed">
                {template.content.length > 200
                  ? `${template.content.substring(0, 200)}...`
                  : template.content
                }
              </pre>
            </div>

            <div className="mt-auto flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{template.name}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="max-h-96 overflow-y-auto rounded-xl border border-border bg-background p-4">
                      <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
                        {template.content}
                      </pre>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" onClick={() => startEditing(template)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>

              <Button variant="outline" size="sm" onClick={() => duplicateTemplate(template)}>
                <Copy className="h-4 w-4" />
                Copy
              </Button>

              {!template.is_default ? (
                <Button variant="outline" size="sm" onClick={() => setAsDefault(template.id)}>
                  <Star className="h-4 w-4" />
                  Set default
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <StarOff className="h-4 w-4" />
                  Is default
                </Button>
              )}

              <button
                type="button"
                onClick={() => deleteTemplate(template.id)}
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
