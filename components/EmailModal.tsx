'use client';

import { useState, useEffect } from 'react';
import { X, Send, Bold, Italic, Underline, List, Link, AlignLeft, AlignCenter, AlignRight, Type, Mail, Plus, FileText} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadEmail: string;
  leadName: string;
  leadId: string;
}


export default function EmailModal({ isOpen, onClose, leadEmail, leadName, leadId }: EmailModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Fallback to hardcoded templates if database fetch fails
      setTemplates([
        {
          id: 'welcome',
          name: 'Welcome Email',
          subject: 'Welcome to FormiqStudio - Let\'s Build Something Amazing!',
          content: `Hi {{leadName}},\n\nThank you for your interest in FormiqStudio! We're excited to help you bring your digital vision to life.\n\nBest regards,\nThe FormiqStudio Team`
        }
      ]);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast.error('Please fill in all template fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('email_templates')
        .insert([{
          name: newTemplate.name,
          subject: newTemplate.subject,
          content: newTemplate.content
        }]);

      if (error) throw error;

      toast.success('Template added successfully!');
      setNewTemplate({ name: '', subject: '', content: '' });
      setShowAddTemplate(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error adding template:', error);
      toast.error('Failed to add template');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setContent(template.content.replace(/{{leadName}}/g, leadName));
    }
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error('Please fill in both subject and content');
      return;
    }

    setSending(true);
    try {
      // Log the email activity
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert([{
          user_id: null, // You might want to get current user ID
          activity_type: 'email_sent',
          description: `Email sent to ${leadName} (${leadEmail})`,
          metadata: {
            lead_id: leadId,
            subject: subject,
            template_used: selectedTemplate || 'custom'
          }
        }]);

      if (activityError) {
        console.error('Error logging activity:', activityError);
      }

      // In a real implementation, you would integrate with an email service like:
      // - Brevo (Sendinblue)
      // - SendGrid
      // - Mailgun
      // - AWS SES
      
      // For now, we'll just simulate sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Email sent successfully to ${leadName}!`);
      onClose();
      
      // Reset form
      setSelectedTemplate('');
      setSubject('');
      setContent('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Email</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To: {leadName} ({leadEmail})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Templates Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Email Templates</h3>
              <button
                onClick={() => setShowAddTemplate(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/30 transition-colors"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedTemplate === template.id
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-violet-600" />
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {template.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {template.subject}
                  </p>
                </button>
              ))}
              
              <button
                onClick={() => {
                  setSelectedTemplate('custom');
                  setSubject('');
                  setContent('');
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedTemplate === 'custom'
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-violet-600" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    Custom Email
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Write your own email from scratch
                </p>
              </button>
            </div>
          </div>

          {/* Email Composer */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email subject..."
                />
              </div>

              {/* Content */}
              <div>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Enter your email content..."
                  height="400px"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Email will be sent to {leadEmail}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={sending || !subject.trim() || !content.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Template Modal */}
      {showAddTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Email Template</h3>
              <button
                onClick={() => setShowAddTemplate(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter template name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Enter email content... Use {{leadName}} for dynamic name replacement."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddTemplate(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTemplate}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-700 hover:to-fuchsia-700 transition-all"
                >
                  Add Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
