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
  MoreHorizontal,
  FileText,
  Loader2,
  Mail,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import EmailQuotationDialog from './EmailQuotationDialog';
import {
  ADMIN_BADGE,
  ADMIN_BTN_DANGER,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_EMPTY,
  ADMIN_ICON_BTN,
  ADMIN_ROW,
  ADMIN_TABLE,
  ADMIN_TABLE_WRAP,
  ADMIN_TD,
  ADMIN_TH,
  ADMIN_TONE,
  type AdminTone,
} from './admin-ui';

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

const STATUS_CONFIG: Record<Quotation['status'], { label: string; tone: AdminTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  sent: { label: 'Sent', tone: 'accent' },
  approved: { label: 'Approved', tone: 'positive' },
  rejected: { label: 'Rejected', tone: 'negative' },
};

const SMALL_BTN = 'h-8 px-3 text-xs';

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
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
    return <span className={`${ADMIN_BADGE} ${ADMIN_TONE[config.tone]}`}>{config.label}</span>;
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
    toast.info('PDF download feature will be implemented');
  };

  const shareQuotation = async (quotation: Quotation) => {
    toast.info('Share feature will be implemented');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${ADMIN_CARD} p-4`}>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
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
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest first</SelectItem>
              <SelectItem value="created_at-asc">Oldest first</SelectItem>
              <SelectItem value="total_amount-desc">Highest amount</SelectItem>
              <SelectItem value="total_amount-asc">Lowest amount</SelectItem>
              <SelectItem value="client_name-asc">Client name A-Z</SelectItem>
              <SelectItem value="client_name-desc">Client name Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredQuotations.length > 0 ? (
        <div className={ADMIN_TABLE_WRAP}>
          <table className={ADMIN_TABLE}>
            <thead>
              <tr>
                <th className={ADMIN_TH}>Quotation</th>
                <th className={ADMIN_TH}>Client</th>
                <th className={`${ADMIN_TH} text-right`}>Amount</th>
                <th className={ADMIN_TH}>Valid until</th>
                <th className={ADMIN_TH}>Status</th>
                <th className={ADMIN_TH}>Created</th>
                <th className={`${ADMIN_TH} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.id} className={ADMIN_ROW}>
                  <td className={ADMIN_TD}>
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/quotations/${quotation.id}`)}
                      className="text-left"
                    >
                      <span className="block font-mono text-xs text-foreground hover:text-primary">{quotation.quotation_number}</span>
                      <span className="mt-0.5 block max-w-[240px] truncate text-muted-foreground">{quotation.project_title}</span>
                    </button>
                  </td>
                  <td className={ADMIN_TD}>
                    <span className="block whitespace-nowrap font-medium">{quotation.client_name}</span>
                    {quotation.client_company && (
                      <span className="block whitespace-nowrap text-xs text-muted-foreground">{quotation.client_company}</span>
                    )}
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap text-right font-medium tabular-nums`}>
                    ₹{quotation.total_amount.toLocaleString('en-IN')}
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground`}>
                    {new Date(quotation.valid_until).toLocaleDateString()}
                  </td>
                  <td className={ADMIN_TD}>{getStatusBadge(quotation.status)}</td>
                  <td className={`${ADMIN_TD} whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground`}>
                    {new Date(quotation.created_at).toLocaleDateString()}
                  </td>
                  <td className={ADMIN_TD}>
                    <div className="flex items-center justify-end gap-2">
                      {quotation.status === 'draft' && (
                        <button
                          type="button"
                          className={`${ADMIN_BTN_OUTLINE} ${SMALL_BTN}`}
                          onClick={() => updateStatus(quotation.id, 'sent')}
                        >
                          Mark as sent
                        </button>
                      )}

                      {quotation.status === 'sent' && (
                        <>
                          <button
                            type="button"
                            className={`${ADMIN_BTN_PRIMARY} ${SMALL_BTN}`}
                            onClick={() => updateStatus(quotation.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className={`${ADMIN_BTN_DANGER} ${SMALL_BTN}`}
                            onClick={() => updateStatus(quotation.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" className={ADMIN_ICON_BTN} aria-label="More actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/quotations/${quotation.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/quotations/${quotation.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadPDF(quotation)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <EmailQuotationDialog
                              quotationId={quotation.id}
                              quotationNumber={quotation.quotation_number}
                              clientName={quotation.client_name}
                              clientEmail={quotation.client_email}
                              trigger={
                                <div className="flex w-full cursor-pointer items-center rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send email
                                </div>
                              }
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareQuotation(quotation)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteQuotation(quotation.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`${ADMIN_CARD} ${ADMIN_EMPTY}`}>
          <FileText className="mx-auto mb-4 h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          <h3 className="text-lg font-semibold text-foreground">No quotations found</h3>
          <p className="mx-auto mb-6 mt-1 max-w-sm">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first quotation to get started'
            }
          </p>
          <button type="button" className={ADMIN_BTN_PRIMARY} onClick={() => router.push('/admin/quotations/new')}>
            <Plus className="h-4 w-4" />
            Create quotation
          </button>
        </div>
      )}
    </div>
  );
}
