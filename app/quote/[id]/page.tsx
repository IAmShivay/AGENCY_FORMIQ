'use client';

import { use, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Mail,
  Phone,
  Check,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
import Image from 'next/image';
import Wordmark from '@/components/studio/Wordmark';
import { STUDIO_FONT_VARS } from '@/lib/studio-fonts';
import {
  ADMIN_BADGE,
  ADMIN_BTN_ACCENT,
  ADMIN_CARD,
  ADMIN_EYEBROW,
  ADMIN_TH,
  ADMIN_TONE,
  type AdminTone,
} from '@/components/admin/admin-ui';

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
}

const STATUS_CONFIG: Record<QuotationData['status'], { label: string; tone: AdminTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  sent: { label: 'Sent', tone: 'accent' },
  approved: { label: 'Approved', tone: 'positive' },
  rejected: { label: 'Rejected', tone: 'negative' },
};

const PAGE_ROOT = `studio ${STUDIO_FONT_VARS} min-h-screen bg-background`;
const DOC_SECTION = 'border-t border-border pt-8';
const DOC_LABEL = `${ADMIN_EYEBROW} mb-4`;

export default function PublicQuotationPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [quotation, setQuotation] = useState<QuotationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const { data, error } = await supabase
          .from('quotations')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setQuotation(data);
      } catch (err) {
        console.error('Error fetching quotation:', err);
        setError('Quotation not found or is no longer available.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [params.id]);

  if (loading) {
    return (
      <div className={`${PAGE_ROOT} flex flex-col items-center justify-center gap-6`}>
        <Wordmark className="text-[40px]" />
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className={`${PAGE_ROOT} flex items-center justify-center px-4`}>
        <div className="max-w-md text-center">
          <Wordmark className="text-[32px]" />
          <h2 className="mt-10 text-3xl font-semibold tracking-[-0.04em] text-foreground">Quotation not found</h2>
          <p className="mt-2 text-muted-foreground">{error || 'This quotation does not exist or has been removed.'}</p>
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[quotation.status] || STATUS_CONFIG.draft;
  const statusBadge = <span className={`${ADMIN_BADGE} ${ADMIN_TONE[config.tone]}`}>{config.label}</span>;

  return (
    <div className={`${PAGE_ROOT} px-4 py-8 sm:py-14 print:bg-transparent print:p-0`}>
      <div className={`${ADMIN_CARD} mx-auto max-w-4xl space-y-10 px-5 py-8 sm:px-12 sm:py-14 print:max-w-none print:rounded-none print:border-0 print:p-0`}>
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
            <dd>{statusBadge}</dd>
          </dl>
        </header>

        <div>
          <p className={ADMIN_EYEBROW}>Quotation</p>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-5xl">{quotation.project_title}</h1>
        </div>

        <div className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${DOC_SECTION}`}>
          <div>
            <h3 className={DOC_LABEL}>Prepared for</h3>
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
              {quotation.key_features.filter(f => f.trim()).map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
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
                  <th className={`${ADMIN_TH} px-1 text-right`}>Rate (&#8377;)</th>
                  <th className={`${ADMIN_TH} px-1 text-right`}>Amount (&#8377;)</th>
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
                <dd className="tabular-nums text-foreground">&#8377;{quotation.subtotal.toLocaleString('en-IN')}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Tax ({quotation.tax_percentage}%)</dt>
                <dd className="tabular-nums text-foreground">&#8377;{quotation.tax_amount.toLocaleString('en-IN')}</dd>
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
                <dt className={ADMIN_EYEBROW}>Total amount</dt>
                <dd className="font-display text-3xl font-semibold tracking-[-0.04em] tabular-nums text-foreground sm:text-4xl">&#8377;{quotation.total_amount.toLocaleString('en-IN')}</dd>
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
                      <p className="text-sm tabular-nums text-muted-foreground">&#8377;{milestone.amount.toLocaleString('en-IN')}</p>
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

        {(quotation as any).payment_link && (quotation as any).payment_status !== 'paid' && (
          <div className="rounded-2xl border border-border bg-muted/50 px-5 py-8 text-center print:hidden sm:px-8">
            <p className={ADMIN_EYEBROW}>Next step</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-foreground">Ready to proceed?</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Make a secure payment to get started with your project.</p>
            <a
              href={(quotation as any).payment_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ADMIN_BTN_ACCENT} mt-6 h-12 px-7 tabular-nums`}
            >
              Pay &#8377;{quotation.total_amount.toLocaleString('en-IN')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-4 font-mono text-[11px] text-muted-foreground">Powered by Cashfree | Secure payment</p>
          </div>
        )}

        {(quotation as any).payment_status === 'paid' && (
          <div className="rounded-2xl border border-success/30 bg-success/10 px-5 py-8 text-center sm:px-8">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-success/30">
              <Check className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Payment received</h3>
            <p className="mt-1 text-sm text-success">Thank you! Your payment has been confirmed.</p>
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
