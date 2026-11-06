'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Search,
  ExternalLink,
  Loader2,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EMPTY,
  ADMIN_EYEBROW,
  ADMIN_ICON_BTN,
  ADMIN_INPUT,
  ADMIN_ROW,
  ADMIN_STAT_VALUE,
  ADMIN_TABLE,
  ADMIN_TABLE_WRAP,
  ADMIN_TD,
  ADMIN_TH,
  ADMIN_TONE,
  type AdminTone,
} from '@/components/admin/admin-ui';

interface Payment {
  id: string;
  quotation_id: string;
  quotation_number: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  payment_link: string;
  transaction_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  paid_at: string | null;
  created_at: string;
}

const PAYMENT_STATUS_TONE: Record<string, AdminTone> = {
  paid: 'positive',
  pending: 'warning',
  failed: 'negative',
  refunded: 'neutral',
};

export default function BillingPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPayments(data);
    }
    setLoading(false);
  };

  const filtered = payments.filter((p) => {
    const matchSearch =
      !search ||
      p.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.quotation_number?.toLowerCase().includes(search.toLowerCase()) ||
      p.client_email?.toLowerCase().includes(search.toLowerCase()) ||
      p.transaction_id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === 'paid').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    totalRevenue: payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const statusBadge = (status: string) => {
    const tone = PAYMENT_STATUS_TONE[status] || PAYMENT_STATUS_TONE.pending;
    return (
      <span className={`${ADMIN_BADGE} ${ADMIN_TONE[tone]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const statTiles = [
    { label: 'Total revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}` },
    { label: 'Total payments', value: stats.total },
    { label: 'Paid', value: stats.paid },
    { label: 'Pending', value: stats.pending },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Clients"
        title="Billing and payments"
        description="Track all payment links and transactions."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statTiles.map((tile) => (
          <div key={tile.label} className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} min-w-0`}>
            <p className={ADMIN_EYEBROW}>{tile.label}</p>
            <p className={`${ADMIN_STAT_VALUE} mt-3 break-all`}>{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, quotation, email, or transaction ID..."
            className={`${ADMIN_INPUT} pl-10`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className={`${ADMIN_INPUT} sm:w-48`}
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={`${ADMIN_CARD} ${ADMIN_EMPTY}`}>
          <p className="font-medium text-foreground">No payments found</p>
          <p className="mt-1">
            {payments.length === 0
              ? 'Generate payment links from your quotations to see them here.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <div className={ADMIN_TABLE_WRAP}>
          <table className={ADMIN_TABLE}>
            <thead>
              <tr>
                <th className={ADMIN_TH}>Client</th>
                <th className={ADMIN_TH}>Quotation</th>
                <th className={`${ADMIN_TH} text-right`}>Amount</th>
                <th className={ADMIN_TH}>Status</th>
                <th className={ADMIN_TH}>Transaction</th>
                <th className={ADMIN_TH}>Date</th>
                <th className={`${ADMIN_TH} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment.id} className={ADMIN_ROW}>
                  <td className={ADMIN_TD}>
                    <p className="font-medium text-foreground">{payment.client_name}</p>
                    <p className="text-xs text-muted-foreground">{payment.client_email}</p>
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap`}>
                    {payment.quotation_id ? (
                      <Link
                        href={`/admin/quotations/${payment.quotation_id}`}
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        {payment.quotation_number}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">{payment.quotation_number}</span>
                    )}
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap text-right font-medium tabular-nums`}>
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </td>
                  <td className={ADMIN_TD}>{statusBadge(payment.status)}</td>
                  <td className={`${ADMIN_TD} whitespace-nowrap font-mono text-xs text-muted-foreground`}>
                    {payment.transaction_id || '—'}
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap`}>
                    <span className={ADMIN_EYEBROW}>
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString('en-IN')
                        : new Date(payment.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td className={`${ADMIN_TD} text-right`}>
                    <div className="flex items-center justify-end gap-1">
                      {payment.payment_link && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(payment.payment_link);
                            toast.success('Payment link copied!');
                          }}
                          className={ADMIN_ICON_BTN}
                          title="Copy payment link"
                          aria-label="Copy payment link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                      {payment.quotation_id && (
                        <Link
                          href={`/quote/${payment.quotation_id}`}
                          target="_blank"
                          className={ADMIN_ICON_BTN}
                          title="View quotation"
                          aria-label="View quotation"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
