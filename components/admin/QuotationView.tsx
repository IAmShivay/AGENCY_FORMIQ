'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import {
  Edit,
  Download,
  Share2,
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText,
  Target,
  CheckCircle,
  Settings,
  Clock,
  Wrench,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import Image from 'next/image';
import FLogo from '@/components/FLogo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import EmailQuotationDialog from './EmailQuotationDialog';

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

export default function QuotationView({ quotationId }: QuotationViewProps) {
  const router = useRouter();
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      sent: { label: 'Sent', variant: 'default' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
    // Fix width to A4 proportions (794px at 96dpi = 210mm) to prevent horizontal clipping
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    element.style.width = '794px';
    element.style.maxWidth = '794px';

    // Capture entire content as one canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794,
      windowWidth: 794,
    });

    // Restore original styles
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

    // Scale factor: how many mm per canvas pixel
    const scale = contentWidth / canvas.width;
    const totalHeightMm = canvas.height * scale;

    // How many canvas pixels fit on one page
    const pixelsPerPage = Math.floor(contentHeight / scale);
    const pageCount = Math.ceil(canvas.height / pixelsPerPage);

    for (let i = 0; i < pageCount; i++) {
      if (i > 0) pdf.addPage();

      const sourceY = i * pixelsPerPage;
      const sliceHeight = Math.min(pixelsPerPage, canvas.height - sourceY);

      // Create page-sized canvas slice
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) continue;

      ctx.fillStyle = '#ffffff';
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

      // Use public URL instead of admin URL
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Quotation not found</h2>
        <Button onClick={() => router.push('/admin/quotations')}>
          Back to Quotations
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/quotations')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{quotation.quotation_number}</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 rounded-full hover:bg-secondary transition-colors">
                      <Info className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{quotation.project_title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(quotation.status)}
          <Button variant="outline" onClick={() => router.push(`/admin/quotations/${quotation.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={downloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <EmailQuotationDialog
            quotationId={quotation.id}
            quotationNumber={quotation.quotation_number}
            clientName={quotation.client_name}
            clientEmail={quotation.client_email}
          />
          <Button variant="outline" onClick={shareQuotation}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
        </div>
      </div>

      {/* Quotation Content */}
      <div id="quotation-content" className="bg-white border rounded-lg p-8 space-y-6">
        {/* Company Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center">
              <FLogo size={48} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium">Digital Solutions & Marketing Agency</p>
              <p className="text-xs text-muted-foreground">hello@formiqstudio.in | +91 8918349445</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Date: {new Date(quotation.created_at).toLocaleDateString()}</p>
            <p className="text-muted-foreground">Valid: {new Date(quotation.valid_until).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-base font-semibold mb-3">Bill To:</h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{quotation.client_name}</p>
              {quotation.client_company && <p>{quotation.client_company}</p>}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p>{quotation.client_email}</p>
              </div>
              {quotation.client_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p>{quotation.client_phone}</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-3">Project Details:</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Timeline:</span> {quotation.delivery_timeline}</p>
              <p><span className="text-muted-foreground">Revisions:</span> {quotation.revisions} included</p>
              <p><span className="text-muted-foreground">Maintenance:</span> {quotation.maintenance_period}</p>
            </div>
          </div>
        </div>

        {/* Project Description */}
        {quotation.project_description && (
          <div>
            <h3 className="text-base font-semibold mb-3">Project Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{quotation.project_description}</p>
          </div>
        )}

        {/* Key Features */}
        {quotation.key_features && quotation.key_features.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Key Features
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {quotation.key_features.filter(feature => feature.trim()).map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scope of Work */}
        {quotation.scope_of_work && (
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Scope of Work
            </h3>
            <div className="bg-secondary/50 p-4 rounded text-sm">
              <p className="whitespace-pre-wrap">{quotation.scope_of_work}</p>
            </div>
          </div>
        )}

        {/* Items Table */}
        <div>
          <h3 className="text-base font-semibold mb-3">Services & Pricing</h3>
          <div className="border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-3 font-semibold">Description</th>
                  <th className="text-center p-3 font-semibold">Qty</th>
                  <th className="text-right p-3 font-semibold">Rate (₹)</th>
                  <th className="text-right p-3 font-semibold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">{item.rate.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-semibold">{item.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-secondary/50 border-t">
                <tr>
                  <td colSpan={3} className="p-3 text-right font-semibold">Subtotal:</td>
                  <td className="p-3 text-right font-semibold">₹{quotation.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3 text-right font-semibold">Tax ({quotation.tax_percentage}%):</td>
                  <td className="p-3 text-right font-semibold">₹{quotation.tax_amount.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-t-2">
                  <td colSpan={3} className="p-3 text-right text-base font-bold">Total Amount:</td>
                  <td className="p-3 text-right text-base font-bold text-primary">₹{quotation.total_amount.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Milestones */}
        {quotation.milestones && quotation.milestones.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Payment Milestones
            </h3>
            <div className="space-y-4">
              {quotation.milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{milestone.title}</h4>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{milestone.percentage}%</p>
                      <p className="text-sm text-muted-foreground">₹{milestone.amount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                  )}
                  {milestone.deliverables && milestone.deliverables.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Deliverables:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {milestone.deliverables.filter((d: string) => d.trim()).map((deliverable: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        <div>
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Terms & Conditions
          </h3>
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{quotation.terms_conditions}</p>
          </div>
        </div>

        {/* Signature Section */}
        {quotation.signature_image_url && (
          <div className="border-t pt-8">
            <div className="flex justify-end">
              <div className="text-center">
                <div className="mb-4">
                  <Image
                    src={quotation.signature_image_url}
                    alt={`${quotation.signature_name} signature`}
                    width={200}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <div className="border-t border-border pt-2 min-w-[200px]">
                  <p className="font-semibold text-sm">{quotation.signature_name}</p>
                  <p className="text-xs text-muted-foreground">{quotation.signature_role}</p>
                  <p className="text-xs text-muted-foreground">FormiqStudio</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>Thank you for considering FormiqStudio for your project.</p>
          <p>We look forward to working with you!</p>
          <div className="mt-4 space-y-1">
            <p className="font-medium">Digital Solutions & Marketing Agency</p>
            <p>Email: hello@formiqstudio.in</p>
            <p>Phone: +91 8918349445 | WhatsApp: +1 555-341-9743</p>
          </div>
        </div>
      </div>
    </div>
  );
}