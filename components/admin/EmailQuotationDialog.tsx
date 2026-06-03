'use client';

import { useState } from 'react';
import { 
  Mail, 
  Send, 
  X,
  FileText,
  User,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        // Reset form
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
    <Button variant="default">
      <Mail className="w-4 h-4 mr-2" />
      Send Email
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Quotation via Email
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Quotation Info */}
          <div className="bg-primary/10 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary">Quotation Details</span>
            </div>
            <p className="text-sm text-primary">
              <strong>Number:</strong> {quotationNumber}<br/>
              <strong>Client:</strong> {clientName}
            </p>
          </div>

          {/* Recipient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Recipient Name *
              </Label>
              <Input
                value={formData.recipientName}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                placeholder="Client name"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Recipient Email *
              </Label>
              <Input
                type="email"
                value={formData.recipientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                placeholder="client@example.com"
                className="mt-1"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label>Email Subject</Label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* Custom Message */}
          <div>
            <Label className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Custom Message
            </Label>
            <Textarea
              value={formData.customMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
              rows={8}
              placeholder="Add a personal message to the client..."
              className="mt-1 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This message will be included in the email along with the quotation PDF.
            </p>
          </div>

          {/* Options */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includePDF"
              checked={formData.includePDF}
              onChange={(e) => setFormData(prev => ({ ...prev, includePDF: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="includePDF" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Include PDF attachment
            </Label>
          </div>

          {/* Email Preview */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Email Preview:</h4>
            <div className="text-sm space-y-1">
              <p><strong>To:</strong> {formData.recipientEmail}</p>
              <p><strong>Subject:</strong> {formData.subject}</p>
              <p><strong>Attachment:</strong> {formData.includePDF ? `${quotationNumber}_Quotation.pdf` : 'None'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={sendEmail} disabled={sending} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Sending...' : 'Send Quotation'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
