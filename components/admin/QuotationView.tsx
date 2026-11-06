'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import {
  Edit,
  Download,
  Share2,
  ArrowLeft,
  Mail,
  Phone,
  Check,
  Info,
  CreditCard,
  Loader2,
  Copy,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import Image from 'next/image';
import Wordmark from '@/components/studio/Wordmark';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import EmailQuotationDialog from './EmailQuotationDialog';
import {
  ADMIN_BADGE,
  ADMIN_BTN_ACCENT,
  ADMIN_BTN_GHOST,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_EMPTY,
  ADMIN_EYEBROW,
  ADMIN_ICON_BTN,
  ADMIN_TH,
  ADMIN_TONE,
  type AdminTone,
} from './admin-ui';

interface QuotationData {
  id: string;
  quotation_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string;
  project_title: string;
  project_description: string;
  items: any[];
  milestones: any[];
  key_features: string[];
  scope_of_work: string;
  revisions: number;
  maintenance_period: string;
  delivery_timeline: string;
  terms_conditions: string;
  signature_id?: string;
  signature_name?: string;
  signature_role?: string;
  signature_image_url?: string;
  subtotal: number;
  tax_percentage: number;
  tax_amount: number;
  total_amount: number;
  valid_until: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface QuotationViewProps {
  quotationId: string;
}

const STATUS_CONFIG: Record<QuotationData['status'], { label: string; tone: AdminTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  sent: { label: 'Sent', tone: 'accent' },
  approved: { label: 'Approved', tone: 'positive' },
  rejected: { label: 'Rejected', tone: 'negative' },
};

const PDF_BACKGROUND = '#ffffff';
const DOC_SECTION = 'border-t border-border pt-8';
const DOC_LABEL = `${ADMIN_EYEBROW} mb-4`;

export default function QuotationView({ quotationId }: QuotationViewProps) {
  const router = useRouter();
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingLink, setGeneratingLink] = useState(false);

  useEffect(() => {
    fetchQuotation();
  }, [quotationId]);

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', quotationId)
        .single();

      if (error) throw error;
      setQuotation(data);
    } catch (error) {
      console.error('Error fetching quotation:', error);
      toast.error('Failed to fetch quotation');
    } finally {
      setLoading(false);
    }
  };

  const generatePaymentLink = async () => {
    if (!quotation) return;
    setGeneratingLink(true);
    try {
      const res = await fetch('/api/payments/cashfree/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotation_id: quotation.id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payment link generated!');
        setQuotation((prev) => prev ? { ...prev, payment_link: data.payment_link } as any : null);
      } else {
        toast.error(data.error || 'Failed to generate payment link');
      }
    } catch {
      toast.error('Failed to generate payment link');
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyPaymentLink = () => {
    const link = (quotation as any)?.payment_link;
    if (link) {
      navigator.clipboard.writeText(link);
      toast.success('Payment link copied!');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
    return <span className={`${ADMIN_BADGE} ${ADMIN_TONE[config.tone]}`}>{config.label}</span>;
  };

  const downloadPDF = async () => {
    if (!quotation) {
      toast.error('Quotation data not available');
      return;
    }

    toast.info('Generating PDF...');

    const element = document.getElementById('quotation-content');
    if (!element) {
      toast.error('Quotation content not found');
      return;
    }

    try {
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      element.style.width = '794px';
      element.style.maxWidth = '794px';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: PDF_BACKGROUND,
        logging: false,
        width: 794,
        windowWidth: 794,
      });

      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = pdfHeight - margin * 2;

      const scale = contentWidth / canvas.width;
      const totalHeightMm = canvas.height * scale;

      const pixelsPerPage = Math.floor(contentHeight / scale);
      const pageCount = Math.ceil(canvas.height / pixelsPerPage);

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();

        const sourceY = i * pixelsPerPage;
        const sliceHeight = Math.min(pixelsPerPage, canvas.height - sourceY);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d');
        if (!ctx) continue;

        ctx.fillStyle = PDF_BACKGROUND;
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0, sourceY, canvas.width, sliceHeight,
          0, 0, canvas.width, sliceHeight
        );

        const imgData = pageCanvas.toDataURL('image/png');
        const sliceHeightMm = sliceHeight * scale;

        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, sliceHeightMm, undefined, 'FAST');
      }

      pdf.save(`${quotation.quotation_number}_${quotation.client_name.replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const shareQuotation = async () => {
    try {
      if (!quotation) {
        toast.error('Quotation data not available');
        return;
      }

      const publicUrl = `${window.location.origin}/quote/${quotation.id}`;

      const shareData = {
        title: `Quotation ${quotation.quotation_number}`,
        text: `Quotation for ${quotation.project_title} - ${quotation.client_name}`,
        url: publicUrl
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Quotation shared successfully');
      } else {
        await navigator.clipboard.writeText(publicUrl);
        toast.success('Public quotation link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing quotation:', error);
      try {
        const publicUrl = `${window.location.origin}/quote/${quotation?.id}`;
        await navigator.clipboard.writeText(publicUrl);
        toast.success('Public quotation link copied to clipboard');
      } catch (clipboardError) {
        toast.error('Failed to share quotation');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className={`${ADMIN_CARD} ${ADMIN_EMPTY}`}>
        <h2 className="mb-6 text-2xl font-semibold text-foreground">Quotation not found</h2>
        <button type="button" className={ADMIN_BTN_PRIMARY} onClick={() => router.push('/admin/quotations')}>
          Back to quotations
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 print:hidden lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <button type="button" className={`${ADMIN_BTN_GHOST} -ml-2`} onClick={() => router.push('/admin/quotations')}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="truncate font-mono text-sm text-foreground">{quotation.quotation_number}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className={`${ADMIN_ICON_BTN} h-8 w-8`} aria-label="Project title">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{quotation.project_title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {getStatusBadge(quotation.status)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={ADMIN_BTN_OUTLINE} onClick={() => router.push(`/admin/quotations/${quotation.id}/edit`)}>
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button type="button" className={ADMIN_BTN_OUTLINE} onClick={downloadPDF}>
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <EmailQuotationDialog
            quotationId={quotation.id}
            quotationNumber={quotation.quotation_number}
            clientName={quotation.client_name}
            clientEmail={quotation.client_email}
          />
          <button type="button" className={ADMIN_BTN_OUTLINE} onClick={shareQuotation}>
            <Share2 className="h-4 w-4" />
            Share link
          </button>
          {(quotation as any)?.payment_link ? (
            <button type="button" onClick={copyPaymentLink} className={`${ADMIN_BTN_OUTLINE} border-success/30 text-success hover:bg-success/10`}>
              <Copy className="h-4 w-4" />
              Copy payment link
            </button>
          ) : (
            <button type="button" onClick={generatePaymentLink} disabled={generatingLink} className={ADMIN_BTN_ACCENT}>
              {generatingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Generate payment link
            </button>
          )}
        </div>
      </div>

      <div id="quotation-content" className={`${ADMIN_CARD} space-y-10 px-5 py-8 sm:px-10 sm:py-12 print:rounded-none print:border-0 print:p-0`}>
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Wordmark className="text-[32px]" />
            <div>
              <p className="text-sm font-medium text-foreground">Digital Solutions & Marketing Agency</p>
              <p className="text-xs text-muted-foreground">hello@formiqstudio.in | +91 8918349445</p>
            </div>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 font-mono text-xs sm:text-right">
            <dt className={ADMIN_EYEBROW}>Quote no.</dt>
            <dd className="text-foreground">{quotation.quotation_number}</dd>
            <dt className={ADMIN_EYEBROW}>Date</dt>
            <dd className="tabular-nums text-foreground">{new Date(quotation.created_at).toLocaleDateString()}</dd>
            <dt className={ADMIN_EYEBROW}>Valid until</dt>
            <dd className="tabular-nums text-foreground">{new Date(quotation.valid_until).toLocaleDateString()}</dd>
            <dt className={ADMIN_EYEBROW}>Status</dt>
            <dd>{getStatusBadge(quotation.status)}</dd>
          </dl>
        </header>

        <div>
          <p className={ADMIN_EYEBROW}>Quotation</p>
          <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-4xl">{quotation.project_title}</h2>
        </div>

        <div className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${DOC_SECTION}`}>
          <div>
            <h3 className={DOC_LABEL}>Bill to</h3>
            <div className="space-y-1.5 text-sm">
              <p className="text-base font-semibold text-foreground">{quotation.client_name}</p>
              {quotation.client_company && <p className="text-foreground">{quotation.client_company}</p>}
              <p className="flex items-center gap-2 break-all text-muted-foreground">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                {quotation.client_email}
              </p>
              {quotation.client_phone && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  {quotation.client_phone}
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className={DOC_LABEL}>Project details</h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
              <dt className="text-muted-foreground">Timeline</dt>
              <dd className="text-foreground">{quotation.delivery_timeline}</dd>
              <dt className="text-muted-foreground">Revisions</dt>
              <dd className="text-foreground">{quotation.revisions} included</dd>
              <dt className="text-muted-foreground">Maintenance</dt>
              <dd className="text-foreground">{quotation.maintenance_period}</dd>
            </dl>
          </div>
        </div>

        {quotation.project_description && (
          <div className={DOC_SECTION}>
            <h3 className={DOC_LABEL}>Project description</h3>
            <p className="max-w-2xl text-[15px] leading-relaxed text-foreground">{quotation.project_description}</p>
          </div>
        )}

        {quotation.key_features && quotation.key_features.length > 0 && (
          <div className={DOC_SECTION}>
            <h3 className={DOC_LABEL}>Key features</h3>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {quotation.key_features.filter(feature => feature.trim()).map((feature, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {quotation.scope_of_work && (
          <div className={DOC_SECTION}>
            <h3 className={DOC_LABEL}>Scope of work</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{quotation.scope_of_work}</p>
          </div>
        )}

        <div className={DOC_SECTION}>
          <h3 className={DOC_LABEL}>Services & pricing</h3>
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-foreground">
                  <th className={`${ADMIN_TH} px-1`}>Description</th>
                  <th className={`${ADMIN_TH} px-1 text-center`}>Qty</th>
                  <th className={`${ADMIN_TH} px-1 text-right`}>Rate (₹)</th>
                  <th className={`${ADMIN_TH} px-1 text-right`}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="px-1 py-3.5 text-foreground">{item.description}</td>
                    <td className="px-1 py-3.5 text-center tabular-nums text-muted-foreground">{item.quantity}</td>
                    <td className="px-1 py-3.5 text-right tabular-nums text-muted-foreground">{item.rate.toLocaleString('en-IN')}</td>
                    <td className="px-1 py-3.5 text-right font-medium tabular-nums text-foreground">{item.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <dl className="w-full space-y-2 text-sm sm:w-80">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums text-foreground">₹{quotation.subtotal.toLocaleString('en-IN')}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Tax ({quotation.tax_percentage}%)</dt>
                <dd className="tabular-nums text-foreground">₹{quotation.tax_amount.toLocaleString('en-IN')}</dd>
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
                <dt className={ADMIN_EYEBROW}>Total amount</dt>
                <dd className="font-display text-3xl font-semibold tracking-[-0.04em] tabular-nums text-foreground">₹{quotation.total_amount.toLocaleString('en-IN')}</dd>
              </div>
            </dl>
          </div>
        </div>

        {quotation.milestones && quotation.milestones.length > 0 && (
          <div className={DOC_SECTION}>
            <h3 className={DOC_LABEL}>Payment milestones</h3>
            <ol className="divide-y divide-border border-y border-border">
              {quotation.milestones.map((milestone, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-3">
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                      <h4 className="text-sm font-semibold text-foreground">{milestone.title}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums text-foreground">{milestone.percentage}%</p>
                      <p className="text-sm tabular-nums text-muted-foreground">₹{milestone.amount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  {milestone.description && (
                    <p className="mt-1 pl-7 text-sm text-muted-foreground">{milestone.description}</p>
                  )}
                  {milestone.deliverables && milestone.deliverables.length > 0 && (
                    <div className="mt-3 pl-7">
                      <p className={`${ADMIN_EYEBROW} mb-2`}>Deliverables</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {milestone.deliverables.filter((d: string) => d.trim()).map((deliverable: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className={DOC_SECTION}>
          <h3 className={DOC_LABEL}>Terms & conditions</h3>
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">{quotation.terms_conditions}</p>
        </div>

        {quotation.signature_image_url && (
          <div className={`flex justify-end ${DOC_SECTION}`}>
            <div className="min-w-[220px]">
              <p className={`${ADMIN_EYEBROW} mb-3`}>Authorised signature</p>
              <Image
                src={quotation.signature_image_url}
                alt={`${quotation.signature_name} signature`}
                width={200}
                height={100}
                className="object-contain"
              />
              <div className="mt-3 border-t border-foreground pt-2">
                <p className="text-sm font-semibold text-foreground">{quotation.signature_name}</p>
                <p className="text-xs text-muted-foreground">{quotation.signature_role}</p>
                <p className="text-xs text-muted-foreground">FormiqStudio</p>
              </div>
            </div>
          </div>
        )}

        <footer className={`flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between ${DOC_SECTION}`}>
          <div>
            <p className="text-foreground">Thank you for considering FormiqStudio for your project.</p>
            <p>We look forward to working with you!</p>
          </div>
          <div className="space-y-0.5 font-mono text-[11px] sm:text-right">
            <p className="text-foreground">Digital Solutions & Marketing Agency</p>
            <p>Email: hello@formiqstudio.in</p>
            <p>Phone: +91 8918349445 | WhatsApp: +91 9832078313</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
