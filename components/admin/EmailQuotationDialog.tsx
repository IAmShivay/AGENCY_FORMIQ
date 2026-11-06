'use client';

import { useState } from 'react';
import {
  Mail,
  Send,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_EYEBROW,
  ADMIN_LABEL,
} from './admin-ui';

interface EmailQuotationDialogProps {
  quotationId: string;
  quotationNumber: string;
  clientName: string;
  clientEmail: string;
  trigger?: React.ReactNode;
}

export default function EmailQuotationDialog({
  quotationId,
  quotationNumber,
  clientName,
  clientEmail,
  trigger
}: EmailQuotationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    recipientEmail: clientEmail || '',
    recipientName: clientName || '',
    subject: `Quotation ${quotationNumber} - FormiqStudio`,
    customMessage: `Dear ${clientName || 'Valued Client'},

Thank you for your interest in our services. We are pleased to provide you with the attached quotation for your project.

Please review the details and let us know if you have any questions or need any modifications. We look forward to working with you!

Best regards,
FormiqStudio Team`,
    includePDF: true
  });

  const sendEmail = async () => {
    try {
      if (!formData.recipientEmail.trim() || !formData.recipientName.trim()) {
        toast.error('Please fill in recipient email and name');
        return;
      }

      setSending(true);

      const response = await fetch('/api/send-quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quotationId,
          recipientEmail: formData.recipientEmail,
          recipientName: formData.recipientName,
          customMessage: formData.customMessage,
          includePDF: formData.includePDF
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Quotation sent successfully!');
        setIsOpen(false);
        setFormData(prev => ({
          ...prev,
          customMessage: `Dear ${clientName || 'Valued Client'},

Thank you for your interest in our services. We are pleased to provide you with the attached quotation for your project.

Please review the details and let us know if you have any questions or need any modifications. We look forward to working with you!

Best regards,
FormiqStudio Team`
        }));
      } else {
        toast.error(result.error || 'Failed to send quotation');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send quotation');
    } finally {
      setSending(false);
    }
  };

  const defaultTrigger = (
    <button type="button" className={ADMIN_BTN_PRIMARY}>
      <Mail className="h-4 w-4" />
      Send email
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <p className={ADMIN_EYEBROW}>Quotation {quotationNumber}</p>
          <DialogTitle className="font-display text-2xl font-semibold tracking-[-0.03em]">
            Send quotation via email
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <div className={`${ADMIN_CARD} grid grid-cols-2 gap-4 bg-muted/40 p-4`}>
            <div className="min-w-0">
              <p className={ADMIN_LABEL}>Number</p>
              <p className="mt-1 truncate font-mono text-sm text-foreground">{quotationNumber}</p>
            </div>
            <div className="min-w-0">
              <p className={ADMIN_LABEL}>Client</p>
              <p className="mt-1 truncate text-sm text-foreground">{clientName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className={ADMIN_LABEL}>Recipient name *</Label>
              <Input
                value={formData.recipientName}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                placeholder="Client name"
              />
            </div>
            <div className="space-y-2">
              <Label className={ADMIN_LABEL}>Recipient email *</Label>
              <Input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                placeholder="client@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className={ADMIN_LABEL}>Email subject</Label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label className={ADMIN_LABEL}>Custom message</Label>
            <Textarea
              value={formData.customMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
              rows={8}
              placeholder="Add a personal message to the client..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              This message will be included in the email along with the quotation PDF.
            </p>
          </div>

          <label htmlFor="includePDF" className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              id="includePDF"
              checked={formData.includePDF}
              onChange={(e) => setFormData(prev => ({ ...prev, includePDF: e.target.checked }))}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Include PDF attachment
          </label>

          <div className="rounded-xl border border-border p-4">
            <p className={`${ADMIN_LABEL} mb-3`}>Email preview</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-muted-foreground">To</dt>
              <dd className="min-w-0 break-all text-foreground">{formData.recipientEmail}</dd>
              <dt className="text-muted-foreground">Subject</dt>
              <dd className="min-w-0 break-words text-foreground">{formData.subject}</dd>
              <dt className="text-muted-foreground">Attachment</dt>
              <dd className="min-w-0 break-all font-mono text-xs text-foreground">{formData.includePDF ? `${quotationNumber}_Quotation.pdf` : 'None'}</dd>
            </dl>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button type="button" className={ADMIN_BTN_OUTLINE} onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button type="button" className={ADMIN_BTN_PRIMARY} onClick={sendEmail} disabled={sending}>
              <Send className="h-4 w-4" />
              {sending ? 'Sending...' : 'Send quotation'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
