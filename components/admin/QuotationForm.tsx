'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import TermsConditionsManager from './TermsConditionsManager';
import SignatureManager from './SignatureManager';
import {
  ADMIN_BTN_DANGER,
  ADMIN_BTN_GHOST,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EYEBROW,
  ADMIN_H2,
  ADMIN_ICON_BTN,
  ADMIN_LABEL,
} from './admin-ui';

function FormSection({ step, title, children }: { step: string; title: string; children: ReactNode }) {
  return (
    <section className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
      <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-4">
        <span className={ADMIN_EYEBROW}>{step}</span>
        <h2 className={ADMIN_H2}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className={ADMIN_LABEL}>{label}</Label>
      {children}
    </div>
  );
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  project_type: string;
  budget: string;
}

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  percentage: number;
  amount: number;
  deliverables: string[];
}

interface QuotationData {
  id?: string;
  quotation_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string;
  project_title: string;
  project_description: string;
  items: QuotationItem[];
  milestones: Milestone[];
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
  created_at?: string;
  updated_at?: string;
}

interface QuotationFormProps {
  quotationId?: string;
  onClose?: () => void;
}

export default function QuotationForm({ quotationId, onClose }: QuotationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<string>('');
  const [selectedTermsId, setSelectedTermsId] = useState<string>('');
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>('');

  const generateQuotationNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 90) + 10;
    return `QT-${year}${month}${random}`;
  };

  const [quotationData, setQuotationData] = useState<QuotationData>({
    quotation_number: quotationId ? '' : generateQuotationNumber(),
    client_name: '',
    client_email: '',
    client_phone: '',
    client_company: '',
    project_title: '',
    project_description: '',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
    milestones: [{
      id: '1',
      title: 'Project Initiation',
      description: '',
      percentage: 30,
      amount: 0,
      deliverables: ['']
    }],
    key_features: [''],
    scope_of_work: '',
    revisions: 3,
    maintenance_period: '6 months',
    delivery_timeline: '',
    terms_conditions: `1. Payment terms: 30% advance, 40% on milestone completion, 30% on delivery
2. All prices are in Indian Rupees (INR)
3. Additional revisions beyond agreed limit will be charged separately
4. Project timeline may vary based on client feedback and approvals
5. Source code and assets will be delivered upon full payment`,
    subtotal: 0,
    tax_percentage: 18,
    tax_amount: 0,
    total_amount: 0,
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft'
  });

  useEffect(() => {
    fetchLeads();
    if (quotationId) {
      fetchQuotation(quotationId);
    }
  }, [quotationId]);

  useEffect(() => {
    calculateTotals();
  }, [quotationData.items, quotationData.tax_percentage]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, email, phone, company, project_type, budget')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    }
  };

  const fetchQuotation = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setQuotationData(data);
      }
    } catch (error) {
      console.error('Error fetching quotation:', error);
      toast.error('Failed to fetch quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelect = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setQuotationData(prev => ({
        ...prev,
        client_name: lead.name,
        client_email: lead.email,
        client_phone: lead.phone,
        client_company: lead.company,
        project_title: `${lead.project_type} Project for ${lead.company}`,
      }));
      setSelectedLead(leadId);
    }
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setQuotationData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    setQuotationData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId: string, field: keyof QuotationItem, value: any) => {
    setQuotationData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: '',
      description: '',
      percentage: 0,
      amount: 0,
      deliverables: ['']
    };
    setQuotationData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const removeMilestone = (milestoneId: string) => {
    setQuotationData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== milestoneId)
    }));
  };

  const updateMilestone = (milestoneId: string, field: keyof Milestone, value: any) => {
    setQuotationData(prev => ({
      ...prev,
      milestones: prev.milestones.map(milestone => {
        if (milestone.id === milestoneId) {
          const updatedMilestone = { ...milestone, [field]: value };
          if (field === 'percentage') {
            updatedMilestone.amount = (prev.subtotal * value) / 100;
          }
          return updatedMilestone;
        }
        return milestone;
      })
    }));
  };

  const addKeyFeature = () => {
    setQuotationData(prev => ({
      ...prev,
      key_features: [...prev.key_features, '']
    }));
  };

  const removeKeyFeature = (index: number) => {
    setQuotationData(prev => ({
      ...prev,
      key_features: prev.key_features.filter((_, i) => i !== index)
    }));
  };

  const updateKeyFeature = (index: number, value: string) => {
    setQuotationData(prev => ({
      ...prev,
      key_features: prev.key_features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const calculateTotals = () => {
    const subtotal = quotationData.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * quotationData.tax_percentage) / 100;
    const totalAmount = subtotal + taxAmount;

    setQuotationData(prev => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      milestones: prev.milestones.map(milestone => ({
        ...milestone,
        amount: (subtotal * milestone.percentage) / 100
      }))
    }));
  };

  const saveQuotation = async () => {
    try {
      setLoading(true);

      const quotationPayload = {
        ...quotationData,
        updated_at: new Date().toISOString()
      };

      if (quotationId) {
        const { error } = await supabase
          .from('quotations')
          .update(quotationPayload)
          .eq('id', quotationId);

        if (error) throw error;
        toast.success('Quotation updated successfully');
      } else {
        const { data, error } = await supabase
          .from('quotations')
          .insert([{
            ...quotationPayload,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        toast.success('Quotation created successfully');

        if (onClose) onClose();
        router.push(`/admin/quotations/${data.id}`);
        return;
      }

      if (onClose) onClose();
      router.push(`/admin/quotations/${quotationId}`);
    } catch (error) {
      console.error('Error saving quotation:', error);
      toast.error('Failed to save quotation');
    } finally {
      setLoading(false);
    }
  };

  if (loading && quotationId) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <FormSection step="01" title="Client information">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Select from leads (optional)">
            <Select value={selectedLead} onValueChange={handleLeadSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose existing lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map(lead => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name} - {lead.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Quotation number">
            <Input
              value={quotationData.quotation_number}
              onChange={(e) => setQuotationData(prev => ({ ...prev, quotation_number: e.target.value }))}
              className="font-mono"
            />
          </Field>
          <Field label="Client name *">
            <Input
              value={quotationData.client_name}
              onChange={(e) => setQuotationData(prev => ({ ...prev, client_name: e.target.value }))}
              required
            />
          </Field>
          <Field label="Company">
            <Input
              value={quotationData.client_company}
              onChange={(e) => setQuotationData(prev => ({ ...prev, client_company: e.target.value }))}
            />
          </Field>
          <Field label="Email *">
            <Input
              type="email"
              value={quotationData.client_email}
              onChange={(e) => setQuotationData(prev => ({ ...prev, client_email: e.target.value }))}
              required
            />
          </Field>
          <Field label="Phone">
            <Input
              value={quotationData.client_phone}
              onChange={(e) => setQuotationData(prev => ({ ...prev, client_phone: e.target.value }))}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection step="02" title="Project details">
        <div className="space-y-4">
          <Field label="Project title *">
            <Input
              value={quotationData.project_title}
              onChange={(e) => setQuotationData(prev => ({ ...prev, project_title: e.target.value }))}
              required
            />
          </Field>
          <Field label="Project description">
            <Textarea
              value={quotationData.project_description}
              onChange={(e) => setQuotationData(prev => ({ ...prev, project_description: e.target.value }))}
              rows={4}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Delivery timeline">
              <Input
                value={quotationData.delivery_timeline}
                onChange={(e) => setQuotationData(prev => ({ ...prev, delivery_timeline: e.target.value }))}
                placeholder="e.g., 8-12 weeks"
              />
            </Field>
            <Field label="Revisions included">
              <Input
                type="number"
                value={quotationData.revisions}
                onChange={(e) => setQuotationData(prev => ({ ...prev, revisions: parseInt(e.target.value) || 0 }))}
                className="tabular-nums"
              />
            </Field>
            <Field label="Maintenance period">
              <Input
                value={quotationData.maintenance_period}
                onChange={(e) => setQuotationData(prev => ({ ...prev, maintenance_period: e.target.value }))}
                placeholder="e.g., 6 months"
              />
            </Field>
          </div>
        </div>
      </FormSection>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FormSection step="03" title="Key features">
          <div className="space-y-3">
            {quotationData.key_features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateKeyFeature(index, e.target.value)}
                  placeholder="Enter key feature"
                  className="flex-1"
                />
                <button
                  type="button"
                  className={`${ADMIN_ICON_BTN} h-10 w-10 flex-shrink-0 disabled:opacity-40`}
                  onClick={() => removeKeyFeature(index)}
                  disabled={quotationData.key_features.length === 1}
                  aria-label="Remove feature"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" className={ADMIN_BTN_OUTLINE} onClick={addKeyFeature}>
              <Plus className="h-4 w-4" />
              Add feature
            </button>
          </div>
        </FormSection>

        <FormSection step="04" title="Scope of work">
          <Textarea
            value={quotationData.scope_of_work}
            onChange={(e) => setQuotationData(prev => ({ ...prev, scope_of_work: e.target.value }))}
            rows={6}
            placeholder="Detailed description of work to be performed..."
          />
        </FormSection>
      </div>

      <FormSection step="05" title="Items & services">
        <div className="space-y-4">
          <div className="hidden grid-cols-12 gap-2 border-b border-border pb-2 md:grid">
            <div className={`${ADMIN_LABEL} col-span-5`}>Description</div>
            <div className={`${ADMIN_LABEL} col-span-2`}>Quantity</div>
            <div className={`${ADMIN_LABEL} col-span-2`}>Rate (₹)</div>
            <div className={`${ADMIN_LABEL} col-span-2`}>Amount (₹)</div>
            <div className={`${ADMIN_LABEL} col-span-1 text-right`}>Action</div>
          </div>

          {quotationData.items.map((item) => (
            <div key={item.id} className="grid grid-cols-6 items-end gap-2 border-b border-border pb-4 md:grid-cols-12 md:items-center md:border-0 md:pb-0">
              <div className="col-span-6 md:col-span-5">
                <span className={`${ADMIN_LABEL} mb-1.5 block md:hidden`}>Description</span>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Service description"
                />
              </div>
              <div className="col-span-3 md:col-span-2">
                <span className={`${ADMIN_LABEL} mb-1.5 block md:hidden`}>Quantity</span>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  min="1"
                  className="tabular-nums"
                />
              </div>
              <div className="col-span-3 md:col-span-2">
                <span className={`${ADMIN_LABEL} mb-1.5 block md:hidden`}>Rate (₹)</span>
                <Input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="tabular-nums"
                />
              </div>
              <div className="col-span-5 md:col-span-2">
                <span className={`${ADMIN_LABEL} mb-1.5 block md:hidden`}>Amount (₹)</span>
                <Input
                  value={item.amount.toLocaleString('en-IN')}
                  readOnly
                  className="bg-muted/50 tabular-nums"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  className={`${ADMIN_ICON_BTN} h-10 w-10 disabled:opacity-40`}
                  onClick={() => removeItem(item.id)}
                  disabled={quotationData.items.length === 1}
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <button type="button" className={ADMIN_BTN_OUTLINE} onClick={addItem}>
            <Plus className="h-4 w-4" />
            Add item
          </button>

          <div className="flex justify-end border-t border-border pt-5">
            <dl className="w-full space-y-3 text-sm sm:w-96">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium tabular-nums text-foreground">₹{quotationData.subtotal.toLocaleString('en-IN')}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Tax ({quotationData.tax_percentage}%)</dt>
                <dd className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={quotationData.tax_percentage}
                    onChange={(e) => setQuotationData(prev => ({ ...prev, tax_percentage: parseFloat(e.target.value) || 0 }))}
                    className="h-9 w-20 tabular-nums"
                    min="0"
                    max="100"
                    step="0.1"
                    aria-label="Tax percentage"
                  />
                  <span className="font-medium tabular-nums text-foreground">₹{quotationData.tax_amount.toLocaleString('en-IN')}</span>
                </dd>
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
                <dt className={ADMIN_LABEL}>Total amount</dt>
                <dd className="font-display text-3xl font-semibold tracking-[-0.04em] tabular-nums text-foreground">₹{quotationData.total_amount.toLocaleString('en-IN')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </FormSection>

      <FormSection step="06" title="Payment milestones">
        <div className="space-y-4">
          {quotationData.milestones.map((milestone) => (
            <div key={milestone.id} className="space-y-4 rounded-xl border border-border p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Milestone title">
                  <Input
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                    placeholder="e.g., Project Initiation"
                  />
                </Field>
                <Field label="Percentage (%)">
                  <Input
                    type="number"
                    value={milestone.percentage}
                    onChange={(e) => updateMilestone(milestone.id, 'percentage', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="tabular-nums"
                  />
                </Field>
                <Field label="Amount (₹)">
                  <Input
                    value={milestone.amount.toLocaleString('en-IN')}
                    readOnly
                    className="bg-muted/50 tabular-nums"
                  />
                </Field>
              </div>
              <Field label="Description">
                <Textarea
                  value={milestone.description}
                  onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                  rows={2}
                  placeholder="Milestone description and requirements"
                />
              </Field>
              <Field label="Deliverables">
                <div className="space-y-2">
                  {milestone.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={deliverable}
                        onChange={(e) => {
                          const newDeliverables = [...milestone.deliverables];
                          newDeliverables[index] = e.target.value;
                          updateMilestone(milestone.id, 'deliverables', newDeliverables);
                        }}
                        placeholder="Deliverable item"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        className={`${ADMIN_ICON_BTN} h-10 w-10 flex-shrink-0 disabled:opacity-40`}
                        onClick={() => {
                          const newDeliverables = milestone.deliverables.filter((_, i) => i !== index);
                          updateMilestone(milestone.id, 'deliverables', newDeliverables);
                        }}
                        disabled={milestone.deliverables.length === 1}
                        aria-label="Remove deliverable"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={`${ADMIN_BTN_GHOST} -ml-2 h-9`}
                    onClick={() => {
                      const newDeliverables = [...milestone.deliverables, ''];
                      updateMilestone(milestone.id, 'deliverables', newDeliverables);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add deliverable
                  </button>
                </div>
              </Field>
              <div className="flex justify-end border-t border-border pt-4">
                <button
                  type="button"
                  className={`${ADMIN_BTN_DANGER} h-9`}
                  onClick={() => removeMilestone(milestone.id)}
                  disabled={quotationData.milestones.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove milestone
                </button>
              </div>
            </div>
          ))}
          <button type="button" className={ADMIN_BTN_OUTLINE} onClick={addMilestone}>
            <Plus className="h-4 w-4" />
            Add milestone
          </button>
        </div>
      </FormSection>

      <FormSection step="07" title="Terms & conditions">
        <div className="space-y-4">
          <div className="max-w-xs">
            <Field label="Valid until">
              <Input
                type="date"
                value={quotationData.valid_until}
                onChange={(e) => setQuotationData(prev => ({ ...prev, valid_until: e.target.value }))}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TermsConditionsManager
              selectedTermsId={selectedTermsId}
              onTermsSelect={(termsId, content) => {
                setSelectedTermsId(termsId);
                setQuotationData(prev => ({ ...prev, terms_conditions: content }));
              }}
              showSelector={true}
            />
            <SignatureManager
              selectedSignatureId={selectedSignatureId}
              onSignatureSelect={(signatureId, signature) => {
                setSelectedSignatureId(signatureId);
                if (signatureId === "" || signatureId === "none") {
                  setQuotationData(prev => ({
                    ...prev,
                    signature_id: undefined,
                    signature_name: undefined,
                    signature_role: undefined,
                    signature_image_url: undefined
                  }));
                } else {
                  setQuotationData(prev => ({
                    ...prev,
                    signature_id: signatureId,
                    signature_name: signature.name,
                    signature_role: signature.role,
                    signature_image_url: signature.image_url
                  }));
                }
              }}
              showSelector={true}
            />
          </div>
          <Field label="Terms & conditions">
            <Textarea
              value={quotationData.terms_conditions}
              onChange={(e) => setQuotationData(prev => ({ ...prev, terms_conditions: e.target.value }))}
              rows={8}
              placeholder="Enter terms and conditions..."
            />
          </Field>
        </div>
      </FormSection>

      <div className="sticky bottom-4 z-20 flex flex-col-reverse gap-2 rounded-2xl border border-border bg-card/90 p-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-end">
        <button type="button" className={ADMIN_BTN_OUTLINE} onClick={() => router.push('/admin/quotations')}>
          Cancel
        </button>
        <button type="button" className={ADMIN_BTN_PRIMARY} onClick={saveQuotation} disabled={loading}>
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : 'Save quotation'}
        </button>
      </div>
    </div>
  );
}
