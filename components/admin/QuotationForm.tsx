'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Share2, 
  User, 
  Building, 
  Mail, 
  Phone,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Target,
  CheckCircle,
  Clock,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import TermsConditionsManager from './TermsConditionsManager';
import SignatureManager from './SignatureManager';

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
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month with leading zero
    const random = Math.floor(Math.random() * 90) + 10; // Random 2-digit number (10-99)
    return `QT-${year}${month}${random}`;
  };

  const [quotationData, setQuotationData] = useState<QuotationData>({
    quotation_number: quotationId ? '' : generateQuotationNumber(), // Only generate for new quotations
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

        // Redirect to view the newly created quotation
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {quotationId ? 'Edit Quotation' : 'Create New Quotation'}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/quotations')}>
            Cancel
          </Button>
          <Button onClick={saveQuotation} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Quotation'}
          </Button>
        </div>
      </div>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Select from Leads (Optional)</Label>
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
            </div>
            <div>
              <Label>Quotation Number</Label>
              <Input
                value={quotationData.quotation_number}
                onChange={(e) => setQuotationData(prev => ({ ...prev, quotation_number: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Client Name *</Label>
              <Input
                value={quotationData.client_name}
                onChange={(e) => setQuotationData(prev => ({ ...prev, client_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={quotationData.client_company}
                onChange={(e) => setQuotationData(prev => ({ ...prev, client_company: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={quotationData.client_email}
                onChange={(e) => setQuotationData(prev => ({ ...prev, client_email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={quotationData.client_phone}
                onChange={(e) => setQuotationData(prev => ({ ...prev, client_phone: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Project Title *</Label>
            <Input
              value={quotationData.project_title}
              onChange={(e) => setQuotationData(prev => ({ ...prev, project_title: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Project Description</Label>
            <Textarea
              value={quotationData.project_description}
              onChange={(e) => setQuotationData(prev => ({ ...prev, project_description: e.target.value }))}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Delivery Timeline</Label>
              <Input
                value={quotationData.delivery_timeline}
                onChange={(e) => setQuotationData(prev => ({ ...prev, delivery_timeline: e.target.value }))}
                placeholder="e.g., 8-12 weeks"
              />
            </div>
            <div>
              <Label>Revisions Included</Label>
              <Input
                type="number"
                value={quotationData.revisions}
                onChange={(e) => setQuotationData(prev => ({ ...prev, revisions: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label>Maintenance Period</Label>
              <Input
                value={quotationData.maintenance_period}
                onChange={(e) => setQuotationData(prev => ({ ...prev, maintenance_period: e.target.value }))}
                placeholder="e.g., 6 months"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quotationData.key_features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateKeyFeature(index, e.target.value)}
                  placeholder="Enter key feature"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeKeyFeature(index)}
                  disabled={quotationData.key_features.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addKeyFeature}>
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scope of Work */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Scope of Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={quotationData.scope_of_work}
            onChange={(e) => setQuotationData(prev => ({ ...prev, scope_of_work: e.target.value }))}
            rows={6}
            placeholder="Detailed description of work to be performed..."
          />
        </CardContent>
      </Card>

      {/* Items/Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Items & Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 font-semibold text-sm">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate (₹)</div>
              <div className="col-span-2">Amount (₹)</div>
              <div className="col-span-1">Action</div>
            </div>

            {quotationData.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Service description"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    value={item.amount.toLocaleString('en-IN')}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={quotationData.items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{quotationData.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax ({quotationData.tax_percentage}%):</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={quotationData.tax_percentage}
                    onChange={(e) => setQuotationData(prev => ({ ...prev, tax_percentage: parseFloat(e.target.value) || 0 }))}
                    className="w-20"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="font-semibold">₹{quotationData.tax_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{quotationData.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Payment Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotationData.milestones.map((milestone) => (
              <div key={milestone.id} className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Milestone Title</Label>
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      placeholder="e.g., Project Initiation"
                    />
                  </div>
                  <div>
                    <Label>Percentage (%)</Label>
                    <Input
                      type="number"
                      value={milestone.percentage}
                      onChange={(e) => updateMilestone(milestone.id, 'percentage', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      value={milestone.amount.toLocaleString('en-IN')}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={milestone.description}
                    onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                    rows={2}
                    placeholder="Milestone description and requirements"
                  />
                </div>
                <div>
                  <Label>Deliverables</Label>
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDeliverables = milestone.deliverables.filter((_, i) => i !== index);
                            updateMilestone(milestone.id, 'deliverables', newDeliverables);
                          }}
                          disabled={milestone.deliverables.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDeliverables = [...milestone.deliverables, ''];
                        updateMilestone(milestone.id, 'deliverables', newDeliverables);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Deliverable
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMilestone(milestone.id)}
                    disabled={quotationData.milestones.length === 1}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Milestone
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addMilestone}>
              <Plus className="w-4 h-4 mr-2" />
              Add Milestone
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={quotationData.valid_until}
                onChange={(e) => setQuotationData(prev => ({ ...prev, valid_until: e.target.value }))}
              />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      // Clear signature
                      setQuotationData(prev => ({
                        ...prev,
                        signature_id: undefined,
                        signature_name: undefined,
                        signature_role: undefined,
                        signature_image_url: undefined
                      }));
                    } else {
                      // Set signature
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
              <div>
                <Label>Terms & Conditions</Label>
                <Textarea
                  value={quotationData.terms_conditions}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, terms_conditions: e.target.value }))}
                  rows={8}
                  placeholder="Enter terms and conditions..."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline" onClick={() => router.push('/admin/quotations')}>
          Cancel
        </Button>
        <Button onClick={saveQuotation} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Quotation'}
        </Button>
      </div>
    </div>
  );
}
