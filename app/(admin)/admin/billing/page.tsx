'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  CreditCard,
  Search,
  Filter,
  ExternalLink,
  Loader2,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

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

  const statusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {statusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all payment links and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground flex items-center gap-1">
            <IndianRupee className="w-5 h-5" />
            {stats.totalRevenue.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Payments</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, quotation, email, or transaction ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary text-foreground text-sm outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No payments found</h3>
          <p className="text-sm text-muted-foreground">
            {payments.length === 0
              ? 'Generate payment links from your quotations to see them here.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Quotation</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Transaction</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment) => (
                  <tr key={payment.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-foreground">{payment.client_name}</p>
                        <p className="text-xs text-muted-foreground">{payment.client_email}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      {payment.quotation_id ? (
                        <Link
                          href={`/admin/quotations/${payment.quotation_id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {payment.quotation_number}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{payment.quotation_number}</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-semibold text-foreground">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">{statusBadge(payment.status)}</td>
                    <td className="p-3 text-xs text-muted-foreground font-mono">
                      {payment.transaction_id || '—'}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString('en-IN')
                        : new Date(payment.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {payment.payment_link && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(payment.payment_link);
                              toast.success('Payment link copied!');
                            }}
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                            title="Copy payment link"
                          >
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        )}
                        {payment.quotation_id && (
                          <Link
                            href={`/quote/${payment.quotation_id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                            title="View quotation"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
