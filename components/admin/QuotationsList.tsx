'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Share2,
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Mail,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import EmailQuotationDialog from './EmailQuotationDialog';

interface Quotation {
  id: string;
  quotation_number: string;
  client_name: string;
  client_email: string;
  client_company: string;
  project_title: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export default function QuotationsList() {
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchQuotations();
  }, [sortBy, sortOrder]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('quotations')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast.error('Failed to fetch quotations');
    } finally {
      setLoading(false);
    }
  };

  const deleteQuotation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;

    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Quotation deleted successfully');
      fetchQuotations();
    } catch (error) {
      console.error('Error deleting quotation:', error);
      toast.error('Failed to delete quotation');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status updated successfully');
      fetchQuotations();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
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

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = 
      quotation.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.client_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.project_title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const downloadPDF = async (quotation: Quotation) => {
    // This would integrate with a PDF generation service
    toast.info('PDF download feature will be implemented');
  };

  const shareQuotation = async (quotation: Quotation) => {
    // This would generate a shareable link or send email
    toast.info('Share feature will be implemented');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground">Manage your project quotations and proposals</p>
        </div>
        <Button onClick={() => router.push('/admin/quotations/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Quotation
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search quotations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="created_at-asc">Oldest First</SelectItem>
                <SelectItem value="total_amount-desc">Highest Amount</SelectItem>
                <SelectItem value="total_amount-asc">Lowest Amount</SelectItem>
                <SelectItem value="client_name-asc">Client Name A-Z</SelectItem>
                <SelectItem value="client_name-desc">Client Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotations.map((quotation) => (
          <Card key={quotation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{quotation.quotation_number}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {quotation.project_title}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/quotations/${quotation.id}`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/quotations/${quotation.id}/edit`)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadPDF(quotation)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <EmailQuotationDialog
                        quotationId={quotation.id}
                        quotationNumber={quotation.quotation_number}
                        clientName={quotation.client_name}
                        clientEmail={quotation.client_email}
                        trigger={
                          <div className="flex items-center w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </div>
                        }
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareQuotation(quotation)}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Link
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteQuotation(quotation.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{quotation.client_name}</span>
              </div>
              
              {quotation.client_company && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{quotation.client_company}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  ₹{quotation.total_amount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Valid until: {new Date(quotation.valid_until).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                {getStatusBadge(quotation.status)}
                <span className="text-xs text-muted-foreground">
                  {new Date(quotation.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Status Update Buttons */}
              {quotation.status === 'draft' && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateStatus(quotation.id, 'sent')}
                  >
                    Mark as Sent
                  </Button>
                </div>
              )}

              {quotation.status === 'sent' && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => updateStatus(quotation.id, 'approved')}
                  >
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => updateStatus(quotation.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuotations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quotations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first quotation to get started'
              }
            </p>
            <Button onClick={() => router.push('/admin/quotations/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Quotation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
