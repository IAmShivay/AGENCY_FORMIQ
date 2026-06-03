'use client';

import { useState, useRef } from 'react';
import { X, Send, Bold, Italic, Underline, List, Link, AlignLeft, AlignCenter, AlignRight, Type, Palette } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface SimpleEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadEmail: string;
  leadName: string;
  leadId: string;
}

export default function SimpleEmailModal({ isOpen, onClose, leadEmail, leadName, leadId }: SimpleEmailModalProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSendEmail = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error('Please fill in both subject and content');
      return;
    }

    setSending(true);
    try {
      // Log activity
      const { error: activityError } = await supabase.from('activities').insert([{
        type: 'email_sent',
        description: `Email sent to ${leadName} (${leadEmail})`,
        metadata: {
          lead_id: leadId,
          subject: subject,
          content_preview: content.substring(0, 100) + (content.length > 100 ? '...' : '')
        }
      }]);

      if (activityError) {
        console.error('Error logging activity:', activityError);
      }

      // In a real implementation, you would integrate with an email service
      toast.success('Email sent successfully!');
      onClose();
      setSubject('');
      setContent('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const changeTextColor = () => {
    const color = prompt('Enter color (e.g., #ff0000 or red):');
    if (color) {
      execCommand('foreColor', color);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Send Email to {leadName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Email Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* To Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <input
              type="email"
              value={leadEmail}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter email subject..."
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            
            {/* Toolbar */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-t-lg bg-gray-50 dark:bg-gray-700 p-2 flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => execCommand('bold')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('italic')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('underline')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Underline"
              >
                <Underline className="h-4 w-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              
              <button
                type="button"
                onClick={() => execCommand('insertUnorderedList')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Insert Link"
              >
                <Link className="h-4 w-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              
              <button
                type="button"
                onClick={() => execCommand('justifyLeft')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('justifyCenter')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('justifyRight')}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              
              <button
                type="button"
                onClick={changeTextColor}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Text Color"
              >
                <Palette className="h-4 w-4" />
              </button>
            </div>

            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              className="w-full min-h-[300px] p-4 border border-t-0 border-gray-300 dark:border-gray-600 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              placeholder="Type your message here..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={sending}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-700 hover:to-fuchsia-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}
