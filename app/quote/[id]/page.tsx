'use client';

import { use, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Mail,
  Phone,
  Target,
  CheckCircle,
  Settings,
  FileText,
} from 'lucide-react';
import Image from 'next/image';
import FLogo from '@/components/FLogo';

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quotation Not Found</h2>
          <p className="text-gray-600">{error || 'This quotation does not exist or has been removed.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white border rounded-lg shadow-sm p-8 space-y-6">
        {/* Company Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center">
              <FLogo size={48} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-900">Digital Solutions & Marketing Agency</p>
              <p className="text-xs text-gray-500">hello@formiqstudio.in | +91 8918349445</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold text-gray-900">{quotation.quotation_number}</p>
            <p className="text-gray-500">Date: {new Date(quotation.created_at).toLocaleDateString()}</p>
            <p className="text-gray-500">Valid: {new Date(quotation.valid_until).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Client Information */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-base font-semibold mb-3 text-gray-900">Bill To:</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-semibold">{quotation.client_name}</p>
              {quotation.client_company && <p>{quotation.client_company}</p>}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p>{quotation.client_email}</p>
              </div>
              {quotation.client_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p>{quotation.client_phone}</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-3 text-gray-900">Project Details:</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="text-gray-500">Timeline:</span> {quotation.delivery_timeline}</p>
              <p><span className="text-gray-500">Revisions:</span> {quotation.revisions} included</p>
              <p><span className="text-gray-500">Maintenance:</span> {quotation.maintenance_period}</p>
            </div>
          </div>
        </div>

        {/* Project Description */}
        {quotation.project_description && (
          <div>
            <h3 className="text-base font-semibold mb-3 text-gray-900">Project Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{quotation.project_description}</p>
          </div>
        )}

        {/* Key Features */}
        {quotation.key_features && quotation.key_features.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-900">
              <Target className="w-5 h-5" />
              Key Features
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {quotation.key_features.filter(f => f.trim()).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scope of Work */}
        {quotation.scope_of_work && (
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-gray-900">
              <Settings className="w-5 h-5" />
              Scope of Work
            </h3>
            <div className="bg-gray-50 p-4 rounded text-sm">
              <p className="whitespace-pre-wrap text-gray-700">{quotation.scope_of_work}</p>
            </div>
          </div>
        )}

        {/* Items Table */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-900">Services & Pricing</h3>
          <div className="border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Description</th>
                  <th className="text-center p-3 font-semibold text-gray-700">Qty</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Rate (&#8377;)</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Amount (&#8377;)</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 text-gray-700">{item.description}</td>
                    <td className="p-3 text-center text-gray-700">{item.quantity}</td>
                    <td className="p-3 text-right text-gray-700">{item.rate.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-semibold text-gray-900">{item.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t">
                <tr>
                  <td colSpan={3} className="p-3 text-right font-semibold text-gray-700">Subtotal:</td>
                  <td className="p-3 text-right font-semibold text-gray-900">&#8377;{quotation.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3 text-right font-semibold text-gray-700">Tax ({quotation.tax_percentage}%):</td>
                  <td className="p-3 text-right font-semibold text-gray-900">&#8377;{quotation.tax_amount.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-t-2">
                  <td colSpan={3} className="p-3 text-right text-base font-bold text-gray-900">Total Amount:</td>
                  <td className="p-3 text-right text-base font-bold text-blue-600">&#8377;{quotation.total_amount.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Milestones */}
        {quotation.milestones && quotation.milestones.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <CheckCircle className="w-5 h-5" />
              Payment Milestones
            </h3>
            <div className="space-y-4">
              {quotation.milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">{milestone.title}</h4>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-900">{milestone.percentage}%</p>
                      <p className="text-sm text-gray-500">&#8377;{milestone.amount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                  )}
                  {milestone.deliverables && milestone.deliverables.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2 text-gray-700">Deliverables:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
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
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <FileText className="w-5 h-5" />
            Terms & Conditions
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{quotation.terms_conditions}</p>
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
                <div className="border-t border-gray-300 pt-2 min-w-[200px]">
                  <p className="font-semibold text-sm text-gray-900">{quotation.signature_name}</p>
                  <p className="text-xs text-gray-500">{quotation.signature_role}</p>
                  <p className="text-xs text-gray-500">FormiqStudio</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <p>Thank you for considering FormiqStudio for your project.</p>
          <p>We look forward to working with you!</p>
          <div className="mt-4 space-y-1">
            <p className="font-medium text-gray-700">Digital Solutions & Marketing Agency</p>
            <p>Email: hello@formiqstudio.in</p>
            <p>Phone: +91 8918349445 | WhatsApp: +91 9832078313</p>
          </div>
        </div>
      </div>
    </div>
  );
}
