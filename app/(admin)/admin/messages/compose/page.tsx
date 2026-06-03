'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

    // Validate form
    if (!to || !subject || !message) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      setError('Please enter a valid email address');
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      // Call the API route to send the email
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          message,
          replyTo: 'contact@formiqstudio.com'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        // Reset form after successful send
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
              <h1 className="text-2xl font-bold text-foreground">Compose Email</h1>
              <p className="text-muted-foreground mt-1">
                Send a personalized email to a customer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Composition Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
            Email sent successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSendEmail} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
            <Input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              className="min-h-[300px]"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={sending}
              className="px-6"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
