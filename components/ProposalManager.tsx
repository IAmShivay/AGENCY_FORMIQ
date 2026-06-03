'use client';

import { useState } from 'react';
import { Eye, Download, Trash2, FileText, Calendar, DollarSign } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import Modal from './Modal';
import { ConfirmModal } from './Modal';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

interface Proposal {
  id: string;
  title: string;
  content: string;
  pricing_breakdown: any;
  total_amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  created_at: string;
  sent_at?: string;
  viewed_at?: string;
}

interface ProposalManagerProps {
  leadId: string;
  proposals: Proposal[];
  onRefresh: () => void;
}

export default function ProposalManager({ leadId, proposals, onRefresh }: ProposalManagerProps) {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'sent': return 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary/70';
      case 'viewed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleView = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowPreview(true);
  };

  const handleDelete = async (proposalId: string) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalId);

      if (error) throw error;

      toast.success('Proposal deleted successfully');
      onRefresh();
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast.error('Failed to delete proposal');
    }
  };

  const handleDownloadPDF = async (proposal: Proposal) => {
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${proposal.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 40px; }
            .title { color: #8b5cf6; font-size: 28px; margin-bottom: 10px; }
            .subtitle { color: #666; font-size: 16px; }
            .content { margin: 30px 0; }
            .pricing { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .total { font-size: 20px; font-weight: bold; color: #8b5cf6; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">${proposal.title}</h1>
            <p class="subtitle">Generated on ${formatDate(proposal.created_at)}</p>
          </div>
          
          <div class="content">
            ${proposal.content}
          </div>
          
          <div class="pricing">
            <h3>Pricing Breakdown</h3>
            ${JSON.stringify(proposal.pricing_breakdown, null, 2)}
            <div class="total">Total: ${formatCurrency(proposal.total_amount)}</div>
          </div>
          
          <div class="footer">
            <p>FormiqStudio - Crafting Infinite Digital Experiences</p>
            <p>Email: hello@formiqstudio.com | Phone: +91 8918349445</p>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${proposal.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Proposal downloaded successfully');
    } catch (error) {
      console.error('Error downloading proposal:', error);
      toast.error('Failed to download proposal');
    }
  };

  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No proposals found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Proposals</h3>
        
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {proposal.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(proposal.status)}`}>
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created {formatDate(proposal.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{formatCurrency(proposal.total_amount)}</span>
                    </div>
                    {proposal.sent_at && (
                      <div className="flex items-center gap-1">
                        <span>Sent {formatDate(proposal.sent_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(proposal)}
                    className="p-2 text-primary hover:text-primary/90 transition-colors"
                    title="View Proposal"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDownloadPDF(proposal)}
                    className="p-2 text-green-600 hover:text-green-700 transition-colors"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setProposalToDelete(proposal.id);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    title="Delete Proposal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={selectedProposal?.title || 'Proposal Preview'}
        size="xl"
      >
        <div className="p-6">
          {selectedProposal && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedProposal.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status: <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedProposal.status)}`}>
                      {selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}
                    </span>
                  </p>
                </div>
                
                <button
                  onClick={() => handleDownloadPDF(selectedProposal)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:from-violet-700 hover:to-fuchsia-700 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
              
              <div className="prose max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedProposal.content) }} />
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pricing Breakdown</h4>
                <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(selectedProposal.pricing_breakdown, null, 2)}
                </pre>
                <div className="mt-4 text-xl font-bold text-violet-600 dark:text-violet-400">
                  Total: {formatCurrency(selectedProposal.total_amount)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => proposalToDelete && handleDelete(proposalToDelete)}
        title="Delete Proposal"
        message="Are you sure you want to delete this proposal? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </>
  );
}
