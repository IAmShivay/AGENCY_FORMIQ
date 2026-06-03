'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileText,
  Settings,
  Star,
  StarOff,
  Eye,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface TermsTemplate {
  id: string;
  name: string;
  content: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

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

      // If this is set as default, first remove default from all other templates
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
        // Update existing template
        const { error } = await supabase
          .from('terms_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        toast.success('Template updated successfully');
      } else {
        // Create new template
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
      // Remove default from all templates
      await supabase
        .from('terms_templates')
        .update({ is_default: false });

      // Set this template as default
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If this is just a selector component
  if (showSelector) {
    return (
      <div className="space-y-4">
        <Label>Terms & Conditions Template</Label>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Terms & Conditions Templates</h2>
          <p className="text-muted-foreground">Manage your quotation terms and conditions</p>
        </div>
        <Button onClick={startCreating}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {templates.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">Create your first terms & conditions template</p>
            <Button onClick={startCreating}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Template Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Standard Terms, Custom Project Terms"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Terms & Conditions Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={15}
                placeholder="Enter your terms and conditions..."
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="is_default">Set as default template</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={saveTemplate} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : editingTemplate ? 'Update' : 'Create'} Template
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Templates List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.is_default && (
                      <Badge variant="default" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(template.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground max-h-24 overflow-y-auto bg-gray-50 p-3 rounded border">
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {template.content.length > 200
                    ? `${template.content.substring(0, 200)}...`
                    : template.content
                  }
                </pre>
              </div>

              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{template.name}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {template.content}
                        </pre>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" onClick={() => startEditing(template)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                <Button variant="outline" size="sm" onClick={() => duplicateTemplate(template)}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>

                {!template.is_default ? (
                  <Button variant="outline" size="sm" onClick={() => setAsDefault(template.id)}>
                    <Star className="w-4 h-4 mr-1" />
                    Set Default
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    <StarOff className="w-4 h-4 mr-1" />
                    Is Default
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteTemplate(template.id)}
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
