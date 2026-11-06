'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  FileText,
  User,
  Mail,
  Phone,
  DollarSign,
  Eye,
  TrendingUp,
  Users as UsersIcon,
  Paperclip,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import SimpleEmailModal from '@/components/SimpleEmailModal';
import Modal, { ConfirmModal } from '@/components/Modal';
import AttachmentViewer, { FileUploadPreview } from '@/components/AttachmentViewer';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_BTN_GHOST,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EMPTY,
  ADMIN_EYEBROW,
  ADMIN_H2,
  ADMIN_ICON_BTN,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_ROW,
  ADMIN_STAT_VALUE,
  ADMIN_TABLE,
  ADMIN_TABLE_WRAP,
  ADMIN_TD,
  ADMIN_TH,
  ADMIN_TONE,
  type AdminTone,
} from '@/components/admin/admin-ui';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  project_type: string;
  budget: string;
  status: 'new' | 'contacted' | 'proposal_sent' | 'negotiating' | 'won' | 'lost';
  description: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
    uploaded_at: string;
  }>;
  assigned_user?: {
    id: string;
    full_name: string;
    email: string;
  };
}

const LEAD_STATUS_TONE: Record<Lead['status'], AdminTone> = {
  new: 'accent',
  contacted: 'neutral',
  proposal_sent: 'neutral',
  negotiating: 'warning',
  won: 'positive',
  lost: 'negative',
};

const HIGH_CONVERSION_RATE = 50;
const MID_CONVERSION_RATE = 25;

type PerformanceTier = 'high' | 'mid' | 'low';

const PERFORMANCE_TONE: Record<PerformanceTier, AdminTone> = {
  high: 'positive',
  mid: 'warning',
  low: 'negative',
};

const PERFORMANCE_LABEL: Record<PerformanceTier, string> = {
  high: 'Strong',
  mid: 'Steady',
  low: 'Low',
};

const PERFORMANCE_BAR: Record<PerformanceTier, string> = {
  high: 'bg-success',
  mid: 'bg-warning',
  low: 'bg-destructive',
};

const PERFORMANCE_TEXT: Record<PerformanceTier, string> = {
  high: 'text-success',
  mid: 'text-warning',
  low: 'text-destructive',
};

const getPerformanceTier = (rate: number): PerformanceTier =>
  rate >= HIGH_CONVERSION_RATE ? 'high' : rate >= MID_CONVERSION_RATE ? 'mid' : 'low';

const FIELD_LABEL = `${ADMIN_LABEL} mb-2 block`;
const TEXTAREA = `${ADMIN_INPUT} h-auto py-2.5`;
const FILE_INPUT = `${ADMIN_INPUT} h-auto py-2 file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:text-foreground`;

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailLead, setEmailLead] = useState<Lead | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    budget: '',
    description: '',
    assigned_to: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [performanceFilter, setPerformanceFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');

  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_admin', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          assigned_user:assigned_to(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) =>
    `${ADMIN_BADGE} ${ADMIN_TONE[LEAD_STATUS_TONE[status as Lead['status']] || LEAD_STATUS_TONE.new]}`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <User className="h-3 w-3" />;
      case 'contacted': return <Phone className="h-3 w-3" />;
      case 'proposal_sent': return <FileText className="h-3 w-3" />;
      case 'negotiating': return <DollarSign className="h-3 w-3" />;
      case 'won': return <TrendingUp className="h-3 w-3" />;
      case 'lost': return <Eye className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;

      fetchLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      fetchLeads();
      toast.success('Lead deleted successfully!');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const confirmDeleteLead = (leadId: string) => {
    setLeadToDelete(leadId);
    setShowDeleteConfirm(true);
  };

  const handleEditLead = (lead: Lead) => {
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      project_type: lead.project_type,
      budget: lead.budget,
      description: lead.description,
      assigned_to: lead.assigned_to || ''
    });
    setSelectedLead(lead);
    setShowAddModal(true);
  };

  const handleSendEmail = (lead: Lead) => {
    setEmailLead(lead);
    setShowEmailModal(true);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLeadDetails(lead);
    setShowDetailsModal(true);
  };

  const uploadAttachments = async (leadId: string) => {
    if (attachments.length === 0) return [];

    const uploadedFiles = [];
    setUploading(true);

    for (const file of attachments) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${leadId}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('formiqstudio')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading file:', error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('formiqstudio')
        .getPublicUrl(fileName);

      uploadedFiles.push({
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString()
      });
    }

    setUploading(false);
    return uploadedFiles;
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedLead) {
        const { error } = await supabase
          .from('leads')
          .update(formData)
          .eq('id', selectedLead.id);

        if (error) throw error;
        toast.success('Lead updated successfully!');
      } else {
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .insert([formData])
          .select()
          .single();

        if (leadError) throw leadError;

        const uploadedAttachments = await uploadAttachments(leadData.id);

        if (uploadedAttachments.length > 0) {
          const { error: updateError } = await supabase
            .from('leads')
            .update({ attachments: uploadedAttachments })
            .eq('id', leadData.id);

          if (updateError) throw updateError;
        }
        toast.success('Lead added successfully!');
      }

      setShowAddModal(false);
      setSelectedLead(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        project_type: '',
        budget: '',
        description: '',
        assigned_to: ''
      });
      setAttachments([]);
      fetchLeads();
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Clients"
        title="Leads"
        description="Track leads, assign owners and send proposals."
        actions={
          <button onClick={() => setShowAddModal(true)} className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            Add lead
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${ADMIN_INPUT} pl-10`}
          />
        </div>
        <div className="relative sm:w-56">
          <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${ADMIN_INPUT} pl-10 pr-8`}
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="proposal_sent">Proposal sent</option>
            <option value="negotiating">Negotiating</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total leads',
            value: leads.length,
            icon: <User className="h-4 w-4 text-muted-foreground" />
          },
          {
            label: 'New leads',
            value: leads.filter(l => l.status === 'new').length,
            icon: <Plus className="h-4 w-4 text-muted-foreground" />
          },
          {
            label: 'Proposals sent',
            value: leads.filter(l => l.status === 'proposal_sent').length,
            icon: <FileText className="h-4 w-4 text-muted-foreground" />
          },
          {
            label: 'Won deals',
            value: leads.filter(l => l.status === 'won').length,
            icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
          }
        ].map((stat, index) => (
          <div key={index} className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
            <div className="flex items-center justify-between gap-3">
              <p className={ADMIN_EYEBROW}>{stat.label}</p>
              {stat.icon}
            </div>
            <p className={`mt-4 ${ADMIN_STAT_VALUE}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className={ADMIN_H2}>Employee performance</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className={`${ADMIN_INPUT} sm:w-48`}
            >
              <option value="all">All employees</option>
              <option value="top_performers">Top performers</option>
              <option value="needs_attention">Needs attention</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={`${ADMIN_INPUT} sm:w-44`}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees
            .filter(employee => {
              if (performanceFilter === 'all') return true;

              const employeeLeads = leads.filter(l => l.assigned_to === employee.id);
              const wonDeals = employeeLeads.filter(l => l.status === 'won').length;
              const conversionRate = employeeLeads.length > 0 ? (wonDeals / employeeLeads.length) * 100 : 0;

              if (performanceFilter === 'top_performers') return conversionRate >= 50 || wonDeals >= 3;
              if (performanceFilter === 'needs_attention') return conversionRate < 25 && employeeLeads.length > 0;

              return true;
            })
            .map((employee) => {
            const employeeLeads = leads.filter(l => l.assigned_to === employee.id);
            const wonDeals = employeeLeads.filter(l => l.status === 'won').length;
            const proposalsSent = employeeLeads.filter(l => l.status === 'proposal_sent').length;
            const contactedLeads = employeeLeads.filter(l => l.status === 'contacted').length;
            const conversionRate = employeeLeads.length > 0 ? ((wonDeals / employeeLeads.length) * 100).toFixed(1) : '0';
            const responseRate = employeeLeads.length > 0 ? (((contactedLeads + proposalsSent + wonDeals) / employeeLeads.length) * 100).toFixed(1) : '0';
            const tier = getPerformanceTier(parseFloat(conversionRate));

            return (
              <div key={employee.id} className="rounded-xl border border-border p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground">
                    {(employee.full_name || employee.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-medium text-foreground">
                      {employee.full_name || employee.email}
                    </h3>
                    <p className="text-sm capitalize text-muted-foreground">{employee.role}</p>
                    {employee.department && (
                      <p className="text-xs text-muted-foreground">{employee.department}</p>
                    )}
                  </div>
                  <span className={`${ADMIN_BADGE} ${ADMIN_TONE[PERFORMANCE_TONE[tier]]}`}>
                    {PERFORMANCE_LABEL[tier]}
                  </span>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {[
                    { label: 'Assigned', value: employeeLeads.length },
                    { label: 'Proposals', value: proposalsSent },
                    { label: 'Won', value: wonDeals },
                    { label: 'Response', value: `${responseRate}%` },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-xl bg-muted/50 p-2.5 text-center">
                      <div className="text-lg font-semibold tabular-nums text-foreground">{metric.value}</div>
                      <div className={ADMIN_EYEBROW}>{metric.label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conversion rate</span>
                    <span className={`text-sm font-medium tabular-nums ${PERFORMANCE_TEXT[tier]}`}>
                      {conversionRate}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${PERFORMANCE_BAR[tier]}`}
                      style={{ width: `${Math.min(parseFloat(conversionRate), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}

          {employees.length === 0 && (
            <div className={`col-span-full ${ADMIN_EMPTY}`}>
              <UsersIcon className="mx-auto mb-4 h-5 w-5 text-muted-foreground" />
              <p className="font-medium text-foreground">No employees found</p>
              <p className="mt-1">Add employees to see performance analytics.</p>
            </div>
          )}
        </div>
      </div>

      <div className={ADMIN_TABLE_WRAP}>
        <table className={ADMIN_TABLE}>
          <thead>
            <tr>
              <th className={ADMIN_TH}>Lead</th>
              <th className={ADMIN_TH}>Contact</th>
              <th className={ADMIN_TH}>Project</th>
              <th className={ADMIN_TH}>Assigned to</th>
              <th className={ADMIN_TH}>Status</th>
              <th className={ADMIN_TH}>Budget</th>
              <th className={ADMIN_TH}>Date</th>
              <th className={`${ADMIN_TH} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className={ADMIN_ROW}>
                <td className={ADMIN_TD}>
                  <div className="font-medium text-foreground">{lead.name}</div>
                  <div className="text-muted-foreground">{lead.company}</div>
                </td>
                <td className={ADMIN_TD}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 whitespace-nowrap text-foreground">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {lead.email}
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                  </div>
                </td>
                <td className={ADMIN_TD}>{lead.project_type}</td>
                <td className={ADMIN_TD}>
                  {lead.assigned_user ? (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                        {(lead.assigned_user.full_name || lead.assigned_user.email).charAt(0).toUpperCase()}
                      </div>
                      <span>{lead.assigned_user.full_name || lead.assigned_user.email}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </td>
                <td className={ADMIN_TD}>
                  <span className={getStatusBadge(lead.status)}>
                    {getStatusIcon(lead.status)}
                    {lead.status.replace('_', ' ')}
                  </span>
                </td>
                <td className={`${ADMIN_TD} whitespace-nowrap font-medium`}>{lead.budget}</td>
                <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground`}>
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className={`${ADMIN_TD} text-right`}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleViewDetails(lead)}
                      className={ADMIN_ICON_BTN}
                      title="View details"
                      aria-label="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSendEmail(lead)}
                      className={ADMIN_ICON_BTN}
                      title="Send email"
                      aria-label="Send email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditLead(lead)}
                      className={ADMIN_ICON_BTN}
                      title="Edit lead"
                      aria-label="Edit lead"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => confirmDeleteLead(lead.id)}
                      className={`${ADMIN_ICON_BTN} hover:bg-destructive/10 hover:text-destructive`}
                      title="Delete lead"
                      aria-label="Delete lead"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeads.length === 0 && (
          <div className={`${ADMIN_EMPTY} border-t border-border`}>
            <User className="mx-auto mb-4 h-5 w-5 text-muted-foreground" />
            <p className="font-medium text-foreground">No leads found</p>
            <p className="mt-1">Get started by adding your first lead.</p>
            <button onClick={() => setShowAddModal(true)} className={`mt-6 ${ADMIN_BTN_PRIMARY}`}>
              <Plus className="h-4 w-4" />
              Add lead
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4">
          <div className={`${ADMIN_CARD} max-h-[90vh] w-full max-w-2xl overflow-y-auto`}>
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className={ADMIN_H2}>
                {selectedLead ? 'Edit lead' : 'Add new lead'}
              </h2>
            </div>
            <form onSubmit={handleAddLead} className={`${ADMIN_CARD_PAD} space-y-5`}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={FIELD_LABEL}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={ADMIN_INPUT}
                    placeholder="Enter lead name"
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={ADMIN_INPUT}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={ADMIN_INPUT}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={ADMIN_INPUT}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Project type *</label>
                  <select
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleInputChange}
                    required
                    className={ADMIN_INPUT}
                  >
                    <option value="">Select project type</option>
                    <option value="Web Development">Web development</option>
                    <option value="Mobile App Development">Mobile app development</option>
                    <option value="E-commerce Development">E-commerce development</option>
                    <option value="UI/UX Design">UI/UX design</option>
                    <option value="Digital Marketing">Digital marketing</option>
                    <option value="SEO Services">SEO services</option>
                    <option value="Custom Software">Custom software</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={FIELD_LABEL}>Budget range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={ADMIN_INPUT}
                  >
                    <option value="">Select budget range</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                    <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                    <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                    <option value="$100,000+">$100,000+</option>
                    <option value="To be discussed">To be discussed</option>
                  </select>
                </div>
                <div>
                  <label className={FIELD_LABEL}>Assign to employee</label>
                  <select
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleInputChange}
                    className={ADMIN_INPUT}
                  >
                    <option value="">Select employee (optional)</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.full_name || employee.email} ({employee.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={FIELD_LABEL}>Project description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={TEXTAREA}
                  placeholder="Describe the project requirements..."
                ></textarea>
              </div>

              <div>
                <label className={`${FIELD_LABEL} flex items-center gap-1.5`}>
                  <Paperclip className="h-3 w-3" />
                  Attachments
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className={FILE_INPUT}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                  <FileUploadPreview files={attachments} onRemove={removeAttachment} />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={ADMIN_BTN_GHOST}
                >
                  Cancel
                </button>
                <button type="submit" className={ADMIN_BTN_PRIMARY}>
                  Add lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEmailModal && emailLead && (
        <SimpleEmailModal
          isOpen={showEmailModal}
          onClose={() => {
            setShowEmailModal(false);
            setEmailLead(null);
          }}
          leadEmail={emailLead.email}
          leadName={emailLead.name}
          leadId={emailLead.id}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => leadToDelete && handleDeleteLead(leadToDelete)}
        title="Delete lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Lead details - ${selectedLeadDetails?.name}`}
        size="xl"
      >
        <div className={`${ADMIN_CARD_PAD} space-y-8`}>
          {selectedLeadDetails && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Contact information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className={ADMIN_LABEL}>Name</dt>
                      <dd className="mt-1 text-foreground">{selectedLeadDetails.name}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Email</dt>
                      <dd className="mt-1 break-all text-foreground">{selectedLeadDetails.email}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Phone</dt>
                      <dd className="mt-1 text-foreground">{selectedLeadDetails.phone || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Company</dt>
                      <dd className="mt-1 text-foreground">{selectedLeadDetails.company || 'Not provided'}</dd>
                    </div>
                  </dl>
                </div>

                <div className={`${ADMIN_CARD} ${ADMIN_CARD_PAD}`}>
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Project information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className={ADMIN_LABEL}>Project type</dt>
                      <dd className="mt-1 text-foreground">{selectedLeadDetails.project_type}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Budget</dt>
                      <dd className="mt-1 text-foreground">{selectedLeadDetails.budget || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Status</dt>
                      <dd className="mt-1">
                        <span className={getStatusBadge(selectedLeadDetails.status)}>
                          {selectedLeadDetails.status.replace('_', ' ')}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className={ADMIN_LABEL}>Assigned to</dt>
                      <dd className="mt-1 text-foreground">
                        {selectedLeadDetails.assigned_user?.full_name || 'Unassigned'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {selectedLeadDetails.description && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">Project description</h3>
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="whitespace-pre-wrap text-foreground">{selectedLeadDetails.description}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">Attachments</h3>
                {selectedLeadDetails.attachments && selectedLeadDetails.attachments.length > 0 ? (
                  <AttachmentViewer
                    attachments={selectedLeadDetails.attachments}
                    title=""
                  />
                ) : (
                  <div className={`${ADMIN_EMPTY} rounded-xl border border-dashed border-border`}>
                    <Paperclip className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
                    <p>No attachments found for this lead.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
