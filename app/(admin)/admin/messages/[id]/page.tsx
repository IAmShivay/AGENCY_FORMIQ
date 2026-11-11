'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  ArrowLeft,
  CheckCircle,
  Archive,
  Trash2,
  Send,
  Loader2
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
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
  ADMIN_LABEL,
  ADMIN_TONE,
  type AdminTone,
} from '@/components/admin/admin-ui';

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

const MESSAGE_STATUS: Record<ContactMessage['status'], { label: string; tone: AdminTone }> = {
  new: { label: 'New', tone: 'accent' },
  read: { label: 'Read', tone: 'neutral' },
  replied: { label: 'Replied', tone: 'positive' },
  archived: { label: 'Archived', tone: 'warning' },
};

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

      setReplyMessage(`Dear ${data.name},\n\nThank you for contacting formiqstudio. We appreciate your interest in our services.\n\n[Your response here]\n\nBest regards,\nThe formiqstudio Team`);

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
          replyTo: 'hello@formiqstudio.in'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
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

        router.push('/admin/messages');
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const config = MESSAGE_STATUS[status as ContactMessage['status']];
    if (!config) return null;
    return <span className={`${ADMIN_BADGE} ${ADMIN_TONE[config.tone]}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="space-y-8">
        <AdminPageHeader eyebrow="System" title="Message not found" />
        <div className={`${ADMIN_CARD} ${ADMIN_EMPTY}`}>
          <p>The message you're looking for doesn't exist or has been deleted.</p>
          <button
            type="button"
            className={`${ADMIN_BTN_OUTLINE} mt-6`}
            onClick={() => router.push('/admin/messages')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to messages
          </button>
        </div>
      </div>
    );
  }

  const contactRows = [
    { label: 'Name', value: message.name },
    { label: 'Email', value: message.email },
    ...(message.phone ? [{ label: 'Phone', value: message.phone }] : []),
    { label: 'Received', value: format(new Date(message.created_at), 'PPP p') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <button
          type="button"
          onClick={() => router.push('/admin/messages')}
          className={`${ADMIN_BTN_GHOST} -ml-3 mb-4 h-9 px-3`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <AdminPageHeader
          eyebrow="System"
          title={<span className="break-words">{message.subject || 'No subject'}</span>}
          description={
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="break-all">From {message.name} ({message.email})</span>
              {getStatusBadge(message.status)}
            </span>
          }
          actions={
            <>
              <button
                type="button"
                className={ADMIN_BTN_OUTLINE}
                onClick={() => updateMessageStatus('read')}
                disabled={message.status === 'read'}
              >
                <CheckCircle className="h-4 w-4" />
                Mark as read
              </button>
              <button
                type="button"
                className={ADMIN_BTN_OUTLINE}
                onClick={() => updateMessageStatus('archived')}
                disabled={message.status === 'archived'}
              >
                <Archive className="h-4 w-4" />
                Archive
              </button>
              <button type="button" className={ADMIN_BTN_DANGER} onClick={deleteMessage}>
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <article className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
              <p className="text-sm font-medium text-foreground">{message.name}</p>
              <p className={ADMIN_EYEBROW}>{format(new Date(message.created_at), 'PPP p')}</p>
            </div>
            <p className="mt-5 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground">{message.message}</p>
          </article>

          <section className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
            <h2 className={`${ADMIN_H2} mb-5`}>Reply to {message.name}</h2>

            {emailSuccess && (
              <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${ADMIN_TONE.positive}`}>
                Email sent successfully!
              </div>
            )}

            {emailError && (
              <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${ADMIN_TONE.negative}`}>
                {emailError}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className={`${ADMIN_LABEL} block`}>Subject</label>
                <Input
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Subject"
                />
              </div>
              <div className="space-y-2">
                <label className={`${ADMIN_LABEL} block`}>Message</label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Your reply..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
                  onClick={handleSendReply}
                  disabled={sendingReply}
                >
                  {sendingReply ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
            <h3 className={`${ADMIN_H2} mb-5`}>Contact information</h3>
            <dl className="space-y-4">
              {contactRows.map((row) => (
                <div key={row.label}>
                  <dt className={ADMIN_LABEL}>{row.label}</dt>
                  <dd className="mt-1 break-words text-sm text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
            <h3 className={`${ADMIN_H2} mb-5`}>Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add private notes about this contact..."
              className="mb-4 min-h-[150px]"
            />
            <button
              type="button"
              onClick={saveNotes}
              disabled={savingNotes}
              className={`${ADMIN_BTN_OUTLINE} w-full`}
            >
              {savingNotes ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save notes'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
