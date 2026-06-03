'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Mail,
  Search,
  Filter,
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
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

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
      // Use direct Supabase client API call like other working tabs
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

      // Update local state
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

        // Update local state
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

        // Update local state
        setMessages(messages.map(message => 
          selectedMessages.includes(message.id) ? { ...message, status: action as any } : message
        ));
      }

      // Clear selection
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
      // Create lead from contact message
      const leadData = {
        name: message.name,
        email: message.email,
        phone: message.phone || '',
        company: '', // Will be empty, can be filled later
        project_type: message.subject || 'General Inquiry',
        budget: '', // Will be empty, can be filled later
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

      // Update message status to indicate it's been converted
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
    switch (status) {
      case 'new':
        return <Badge className="bg-primary">New</Badge>;
      case 'read':
        return <Badge className="bg-muted-foreground">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-500">Replied</Badge>;
      case 'archived':
        return <Badge className="bg-yellow-500">Archived</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Modern AI-Era Styling */}
      <div className="bg-card rounded-2xl shadow-md p-6 border border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
            <p className="text-muted-foreground mt-1">
              Manage and respond to customer inquiries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchMessages}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Link href="/admin/messages/compose">
              <Button size="sm" className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                <span>Compose Email</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card rounded-2xl shadow-md p-6 border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search messages..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <div className="bg-primary/10 rounded-2xl shadow-md p-4 border border-primary/20 flex items-center justify-between">
          <div className="text-sm text-primary">
            {selectedMessages.length} {selectedMessages.length === 1 ? 'message' : 'messages'} selected
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('read')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark as Read
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('archived')}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleBulkAction('delete')}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Messages Table */}
      <div className="bg-card rounded-2xl shadow-md border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-2 text-lg font-medium text-foreground">No messages found</h3>
            <p className="mt-1 text-muted-foreground">
              {searchQuery ? 'Try adjusting your search terms' : 'You haven\'t received any contact messages yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-border text-primary focus:ring-primary"
                        checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className={`hover:bg-muted/50 ${
                      message.status === 'new' ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-border text-primary focus:ring-primary"
                        checked={selectedMessages.includes(message.id)}
                        onChange={() => toggleMessageSelection(message.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-medium">
                          {message.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{message.name}</div>
                          <div className="text-sm text-muted-foreground">{message.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">{message.subject || 'No Subject'}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {message.message.substring(0, 60)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(message.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => convertToLead(message)}
                          disabled={convertingToLead === message.id}
                          className="text-primary border-primary hover:bg-primary/10"
                          title="Convert to Lead"
                        >
                          {convertingToLead === message.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserPlus className="h-4 w-4" />
                          )}
                        </Button>
                        <Link href={`/admin/messages/${message.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateMessageStatus(message.id, 'read')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateMessageStatus(message.id, 'archived')}>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => convertToLead(message)}
                              disabled={convertingToLead === message.id}
                              className="text-primary"
                            >
                              {convertingToLead === message.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <UserPlus className="h-4 w-4 mr-2" />
                              )}
                              Convert to Lead
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
