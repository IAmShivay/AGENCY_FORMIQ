'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  Archive,
  Trash2,
  RefreshCw,
  Send,
  UserPlus,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_BTN_DANGER,
  ADMIN_BTN_GHOST,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_EMPTY,
  ADMIN_EYEBROW,
  ADMIN_FOCUS,
  ADMIN_ICON_BTN,
  ADMIN_TONE,
  type AdminTone,
} from '@/components/admin/admin-ui';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const MESSAGE_STATUS: Record<ContactMessage['status'], { label: string; tone: AdminTone }> = {
  new: { label: 'New', tone: 'accent' },
  read: { label: 'Read', tone: 'neutral' },
  replied: { label: 'Replied', tone: 'positive' },
  archived: { label: 'Archived', tone: 'warning' },
};

const CHECKBOX_CLASS = 'h-4 w-4 shrink-0 cursor-pointer border-input accent-primary';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [convertingToLead, setConvertingToLead] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching contact messages:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return;
      }

      console.log('Contact messages fetched successfully:', data?.length || 0, 'messages');
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating message status:', error);
        return;
      }

      setMessages(messages.map(message =>
        message.id === id ? { ...message, status: status as any } : message
      ));
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedMessages.length === 0) return;

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .in('id', selectedMessages);

        if (error) {
          console.error('Error deleting messages:', error);
          return;
        }

        setMessages(messages.filter(message => !selectedMessages.includes(message.id)));
      } else {
        const { error } = await supabase
          .from('contact_messages')
          .update({ status: action })
          .in('id', selectedMessages);

        if (error) {
          console.error('Error updating messages:', error);
          return;
        }

        setMessages(messages.map(message =>
          selectedMessages.includes(message.id) ? { ...message, status: action as any } : message
        ));
      }

      setSelectedMessages([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const toggleMessageSelection = (id: string) => {
    setSelectedMessages(prev =>
      prev.includes(id)
        ? prev.filter(messageId => messageId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(message => message.id));
    }
  };

  const filteredMessages = messages.filter(message => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      message.name.toLowerCase().includes(searchTerms) ||
      message.email.toLowerCase().includes(searchTerms) ||
      message.subject?.toLowerCase().includes(searchTerms) ||
      message.message.toLowerCase().includes(searchTerms)
    );
  });

  const convertToLead = async (message: ContactMessage) => {
    setConvertingToLead(message.id);
    try {
      const leadData = {
        name: message.name,
        email: message.email,
        phone: message.phone || '',
        company: '',
        project_type: message.subject || 'General Inquiry',
        budget: '',
        description: message.message,
        status: 'new'
      };

      const { data: lead, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        alert('Failed to convert to lead. Please try again.');
        return;
      }

      await updateMessageStatus(message.id, 'read');

      alert(`Successfully converted "${message.name}" to a lead! You can find it in the Leads section.`);
    } catch (error) {
      console.error('Error converting to lead:', error);
      alert('Failed to convert to lead. Please try again.');
    } finally {
      setConvertingToLead(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = MESSAGE_STATUS[status as ContactMessage['status']];
    if (!config) return null;
    return <span className={`${ADMIN_BADGE} ${ADMIN_TONE[config.tone]}`}>{config.label}</span>;
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="System"
        title="Contact messages"
        description="Manage and respond to customer inquiries."
        actions={
          <>
            <button type="button" onClick={fetchMessages} className={ADMIN_BTN_OUTLINE}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link href="/admin/messages/compose" className={ADMIN_BTN_PRIMARY}>
              <Send className="h-4 w-4" />
              Compose email
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All messages</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedMessages.length > 0 && (
        <div className={`${ADMIN_CARD} flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between`}>
          <p className={ADMIN_EYEBROW}>
            {selectedMessages.length} {selectedMessages.length === 1 ? 'message' : 'messages'} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={ADMIN_BTN_OUTLINE} onClick={() => handleBulkAction('read')}>
              <CheckCircle className="h-4 w-4" />
              Mark as read
            </button>
            <button type="button" className={ADMIN_BTN_OUTLINE} onClick={() => handleBulkAction('archived')}>
              <Archive className="h-4 w-4" />
              Archive
            </button>
            <button type="button" className={ADMIN_BTN_DANGER} onClick={() => handleBulkAction('delete')}>
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      <div className={`${ADMIN_CARD} overflow-hidden`}>
        {loading ? (
          <div className={ADMIN_EMPTY}>
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
            <p className="mt-3">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className={ADMIN_EMPTY}>
            <p className="font-medium text-foreground">No messages found</p>
            <p className="mt-1">
              {searchQuery ? 'Try adjusting your search terms' : 'You haven\'t received any contact messages yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
              <input
                type="checkbox"
                aria-label="Select all messages"
                className={CHECKBOX_CLASS}
                checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                onChange={toggleSelectAll}
              />
              <span className={ADMIN_EYEBROW}>{filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'}</span>
            </div>
            <ul className="divide-y divide-border">
              {filteredMessages.map((message) => {
                const unread = message.status === 'new';
                return (
                  <li
                    key={message.id}
                    className="flex gap-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-5"
                  >
                    <input
                      type="checkbox"
                      aria-label={`Select message from ${message.name}`}
                      className={`${CHECKBOX_CLASS} mt-1`}
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => toggleMessageSelection(message.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                          <span className={`truncate text-sm text-foreground ${unread ? 'font-medium' : ''}`}>{message.name}</span>
                          <span className="hidden truncate text-sm text-muted-foreground md:inline">{message.email}</span>
                        </div>
                        <span className={`${ADMIN_EYEBROW} shrink-0 whitespace-nowrap`}>
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <Link href={`/admin/messages/${message.id}`} className={`mt-1 block min-w-0 rounded-xl ${ADMIN_FOCUS}`}>
                        <p className={`truncate text-sm text-foreground ${unread ? 'font-medium' : ''}`}>{message.subject || 'No subject'}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {message.message.substring(0, 60)}...
                        </p>
                      </Link>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {getStatusBadge(message.status)}
                        <div className="ml-auto flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => convertToLead(message)}
                            disabled={convertingToLead === message.id}
                            className={`${ADMIN_ICON_BTN} disabled:opacity-50`}
                            title="Convert to lead"
                            aria-label="Convert to lead"
                          >
                            {convertingToLead === message.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <UserPlus className="h-4 w-4" />
                            )}
                          </button>
                          <Link href={`/admin/messages/${message.id}`} className={`${ADMIN_BTN_GHOST} h-9 px-3`}>
                            View
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button type="button" className={ADMIN_ICON_BTN} aria-label="More actions">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => updateMessageStatus(message.id, 'read')}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as read
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateMessageStatus(message.id, 'archived')}>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => convertToLead(message)}
                                disabled={convertingToLead === message.id}
                              >
                                {convertingToLead === message.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <UserPlus className="h-4 w-4 mr-2" />
                                )}
                                Convert to lead
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={async () => {
                                  if (confirm('Are you sure you want to delete this message?')) {
                                    try {
                                      const { error } = await supabase
                                        .from('contact_messages')
                                        .delete()
                                        .eq('id', message.id);

                                      if (error) {
                                        console.error('Error deleting message:', error);
                                        return;
                                      }

                                      setMessages(messages.filter(m => m.id !== message.id));
                                    } catch (error) {
                                      console.error('Error deleting message:', error);
                                    }
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
