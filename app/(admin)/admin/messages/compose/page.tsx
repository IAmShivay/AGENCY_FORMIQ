'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BTN_GHOST,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_LABEL,
  ADMIN_TONE,
} from '@/components/admin/admin-ui';

export default function ComposeEmailPage() {
  const router = useRouter();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!to || !subject || !message) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      setError('Please enter a valid email address');
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          message,
          replyTo: 'hello@formiqstudio.in'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setTo('');
        setSubject('');
        setMessage('');
      } else {
        setError(result.error || 'Failed to send email');
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      setError(error.message || 'An error occurred while sending the email');
    } finally {
      setSending(false);
    }
  };

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
          title="Compose email"
          description="Send a personalised email to a customer."
        />
      </div>

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} max-w-3xl`}>
        {success && (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${ADMIN_TONE.positive}`}>
            Email sent successfully!
          </div>
        )}

        {error && (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${ADMIN_TONE.negative}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSendEmail} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="compose-to" className={`${ADMIN_LABEL} block`}>To</label>
            <Input
              id="compose-to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="compose-subject" className={`${ADMIN_LABEL} block`}>Subject</label>
            <Input
              id="compose-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="compose-message" className={`${ADMIN_LABEL} block`}>Message</label>
            <Textarea
              id="compose-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              className="min-h-[300px]"
              required
            />
          </div>

          <div className="flex justify-end border-t border-border pt-6">
            <button
              type="submit"
              disabled={sending}
              className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
