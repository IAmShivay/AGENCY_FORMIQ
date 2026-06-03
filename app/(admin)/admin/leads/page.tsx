'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  FileText,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Eye,
  Download,
  TrendingUp,
  Users as UsersIcon,
  Paperclip,
  Upload,
  X
, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import SimpleEmailModal from '@/components/SimpleEmailModal';
import Modal, { ConfirmModal } from '@/components/Modal';
import AttachmentViewer, { FileUploadPreview } from '@/components/AttachmentViewer';

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
      // Use EXACT same pattern as working portfolio requests
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
      // Fetch leads with assigned user information
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

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-primary/10 text-primary border-primary/20',
      contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      proposal_sent: 'bg-purple-100 text-purple-800 border-purple-200',
      negotiating: 'bg-orange-100 text-orange-800 border-orange-200',
      won: 'bg-green-100 text-green-800 border-green-200',
      lost: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <User className="w-4 h-4" />;
      case 'contacted': return <Phone className="w-4 h-4" />;
      case 'proposal_sent': return <FileText className="w-4 h-4" />;
      case 'negotiating': return <DollarSign className="w-4 h-4" />;
      case 'won': return <TrendingUp className="w-4 h-4" />;
      case 'lost': return <Eye className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
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
      // Use EXACT same pattern as working portfolio requests
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;

      // Refresh leads
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
        // Update existing lead
        const { error } = await supabase
          .from('leads')
          .update(formData)
          .eq('id', selectedLead.id);

        if (error) throw error;
        toast.success('Lead updated successfully!');
      } else {
        // Create new lead
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .insert([formData])
          .select()
          .single();

        if (leadError) throw leadError;

        // Upload attachments if any
        const uploadedAttachments = await uploadAttachments(leadData.id);

        // Update lead with attachments
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
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground">Manage leads and generate AI-powered proposals</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="negotiating">Negotiating</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Leads',
            value: leads.length,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            icon: <User className="w-5 h-5" />
          },
          {
            label: 'New Leads',
            value: leads.filter(l => l.status === 'new').length,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            icon: <Plus className="w-5 h-5" />
          },
          {
            label: 'Proposals Sent',
            value: leads.filter(l => l.status === 'proposal_sent').length,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            icon: <FileText className="w-5 h-5" />
          },
          {
            label: 'Won Deals',
            value: leads.filter(l => l.status === 'won').length,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            icon: <TrendingUp className="w-5 h-5" />
          }
        ].map((stat, index) => (
          <div key={index} className={`${stat.bgColor} p-6 rounded-xl border border-border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-card`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Analytics */}
      <div className="bg-card rounded-xl border border-border p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-foreground">Employee Performance</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              <option value="all">All Employees</option>
              <option value="top_performers">Top Performers</option>
              <option value="needs_attention">Needs Attention</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            return (
              <div key={employee.id} className="bg-secondary/50 p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                    {(employee.full_name || employee.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {employee.full_name || employee.email}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">{employee.role}</p>
                    {employee.department && (
                      <p className="text-xs text-muted-foreground">{employee.department}</p>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    parseFloat(conversionRate) >= 50 ? 'bg-green-100 text-green-800' :
                    parseFloat(conversionRate) >= 25 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {parseFloat(conversionRate) >= 50 ? '🏆' : parseFloat(conversionRate) >= 25 ? '📈' : '⚠️'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center p-2 bg-card rounded-lg">
                    <div className="text-lg font-bold text-foreground">{employeeLeads.length}</div>
                    <div className="text-xs text-muted-foreground">Assigned</div>
                  </div>
                  <div className="text-center p-2 bg-card rounded-lg">
                    <div className="text-lg font-bold text-primary">{proposalsSent}</div>
                    <div className="text-xs text-muted-foreground">Proposals</div>
                  </div>
                  <div className="text-center p-2 bg-card rounded-lg">
                    <div className="text-lg font-bold text-green-600">{wonDeals}</div>
                    <div className="text-xs text-muted-foreground">Won</div>
                  </div>
                  <div className="text-center p-2 bg-card rounded-lg">
                    <div className="text-lg font-bold text-primary">{responseRate}%</div>
                    <div className="text-xs text-muted-foreground">Response</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className={`text-sm font-medium ${
                      parseFloat(conversionRate) >= 50 ? 'text-green-600' :
                      parseFloat(conversionRate) >= 25 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {conversionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        parseFloat(conversionRate) >= 50 ? 'bg-green-500' :
                        parseFloat(conversionRate) >= 25 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(parseFloat(conversionRate), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}

          {employees.length === 0 && (
            <div className="col-span-full text-center py-8">
              <UsersIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No employees found</h3>
              <p className="text-muted-foreground">Add employees to see performance analytics</p>
            </div>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Lead</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Budget</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.company}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">{lead.project_type}</div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.assigned_user ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
                          {(lead.assigned_user.full_name || lead.assigned_user.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm text-foreground">
                          {lead.assigned_user.full_name || lead.assigned_user.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                      {getStatusIcon(lead.status)}
                      {lead.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{lead.budget}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(lead)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSendEmail(lead)}
                        className="p-2 text-muted-foreground hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="p-2 text-muted-foreground hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                        title="Edit Lead"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteLead(lead.id)}
                        className="p-2 text-muted-foreground hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No leads found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first lead</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {selectedLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter lead name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Type *
                  </label>
                  <select
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select project type</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="E-commerce Development">E-commerce Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="SEO Services">SEO Services</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Assign to Employee
                  </label>
                  <select
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Describe the project requirements..."
                ></textarea>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Attachments
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                  <FileUploadPreview files={attachments} onRemove={removeAttachment} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => leadToDelete && handleDeleteLead(leadToDelete)}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      {/* Lead Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Lead Details - ${selectedLeadDetails?.name}`}
        size="xl"
      >
        <div className="p-6 space-y-6">
          {selectedLeadDetails && (
            <>
              {/* Lead Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-foreground">{selectedLeadDetails.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground">{selectedLeadDetails.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-foreground">{selectedLeadDetails.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Company</label>
                      <p className="text-foreground">{selectedLeadDetails.company || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Project Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Project Type</label>
                      <p className="text-foreground">{selectedLeadDetails.project_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Budget</label>
                      <p className="text-foreground">{selectedLeadDetails.budget || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(selectedLeadDetails.status)}`}>
                        {selectedLeadDetails.status.charAt(0).toUpperCase() + selectedLeadDetails.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                      <p className="text-foreground">
                        {selectedLeadDetails.assigned_user?.full_name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedLeadDetails.description && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Project Description</h3>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-foreground whitespace-pre-wrap">{selectedLeadDetails.description}</p>
                  </div>
                </div>
              )}

              {/* Attachments */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Attachments</h3>
                {selectedLeadDetails.attachments && selectedLeadDetails.attachments.length > 0 ? (
                  <AttachmentViewer
                    attachments={selectedLeadDetails.attachments}
                    title=""
                  />
                ) : (
                  <div className="text-center py-8 bg-secondary/50 rounded-lg">
                    <div className="text-muted-foreground">
                      <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <p>No attachments found for this lead</p>
                    </div>
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
