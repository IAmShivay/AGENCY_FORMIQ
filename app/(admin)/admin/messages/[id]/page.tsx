'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Archive,
  Trash2,
  Send,
  Loader2,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);

  useEffect(() => {
    fetchMessage();
  }, []);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching message:', error);
        return;
      }

      setMessage(data);
      setNotes(data.notes || '');
      setReplySubject(`Re: ${data.subject || 'Your inquiry'}`);

      // Set default reply template
      setReplyMessage(`Dear ${data.name},\n\nThank you for contacting formiqstudio. We appreciate your interest in our services.\n\n[Your response here]\n\nBest regards,\nThe formiqstudio Team`);

      // If message is new, mark as read
      if (data.status === 'new') {
        updateMessageStatus('read');
      }
    } catch (error) {
      console.error('Error fetching message:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', params.id);

      if (error) {
        console.error('Error updating message status:', error);
        return;
      }

      // Update local state
      if (message) {
        setMessage({ ...message, status: status as any });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const saveNotes = async () => {
    if (!message) return;

    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ notes })
        .eq('id', message.id);

      if (error) {
        console.error('Error saving notes:', error);
        return;
      }

      // Update local state
      setMessage({ ...message, notes });
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSendReply = async () => {
    if (!message) return;

    setSendingReply(true);
    setEmailError(null);
    setEmailSuccess(false);

    try {
      // Call the API route to send the email
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: message.email,
          subject: replySubject,
          message: replyMessage,
          messageId: message.id,
          replyTo: 'contact@formiqstudio.com'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update local state
        setMessage({ ...message, status: 'replied' });
        setEmailSuccess(true);
      } else {
        setEmailError(result.error || 'Failed to send email');
      }
    } catch (error: any) {
      console.error('Error sending reply:', error);
      setEmailError(error.message || 'An error occurred while sending the email');
    } finally {
      setSendingReply(false);
    }
  };

  const deleteMessage = async () => {
    if (!message) return;

    if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', message.id);

        if (error) {
          console.error('Error deleting message:', error);
          return;
        }

        // Navigate back to messages list
        router.push('/admin/messages');
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-primary">New</Badge>;
      case 'read':
        return <Badge className="bg-muted-foreground">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-500">Replied</Badge>;
      case 'archived':
        return <Badge className="bg-yellow-500">Archived</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Message not found</h2>
        <p className="mt-2 text-muted-foreground">The message you're looking for doesn't exist or has been deleted.</p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push('/admin/messages')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Messages
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Modern AI-Era Styling */}
      <div className="bg-card rounded-2xl shadow-md p-6 border border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/messages')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                {message.subject || 'No Subject'}
                <span className="ml-3">{getStatusBadge(message.status)}</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                From: {message.name} ({message.email})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateMessageStatus('read')}
              disabled={message.status === 'read'}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark as Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateMessageStatus('archived')}
              disabled={message.status === 'archived'}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteMessage}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Message Content and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Content */}
          <div className="bg-card rounded-2xl shadow-md p-6 border border-border">
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          {/* Reply Section */}
          <div className="bg-card rounded-2xl shadow-md p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Reply to {message.name}</h2>

            {emailSuccess && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
                Email sent successfully!
              </div>
            )}

            {emailError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                {emailError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                <Input
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Your reply..."
                  className="min-h-[200px]"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSendReply}
                disabled={sendingReply}
              >
                {sendingReply ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-card rounded-2xl shadow-md p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-foreground">Name</p>
                  <p className="text-sm text-foreground">{message.name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-foreground">{message.email}</p>
                </div>
              </div>
              {message.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-sm text-foreground">{message.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-foreground">Received</p>
                  <p className="text-sm text-foreground">
                    {format(new Date(message.created_at), 'PPP p')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card rounded-2xl shadow-md p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add private notes about this contact..."
              className="min-h-[150px] mb-4"
            />
            <Button
              onClick={saveNotes}
              disabled={savingNotes}
              className="w-full"
            >
              {savingNotes ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Notes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
