'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight
, Loader2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BTN_DANGER,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_CARD_PAD,
  ADMIN_EMPTY,
  ADMIN_EYEBROW,
  ADMIN_H2,
  ADMIN_ICON_BTN,
  ADMIN_INPUT,
} from '@/components/admin/admin-ui';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const authorsPerPage = 10;

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const { count } = await supabase
        .from('blog_authors')
        .select('*', { count: 'exact', head: true })
        .ilike('name', `%${searchTerm}%`);

      setTotalAuthors(count || 0);

      const from = (currentPage - 1) * authorsPerPage;
      const to = from + authorsPerPage - 1;

      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name')
        .range(from, to);

      if (error) throw error;
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [currentPage, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author? This will affect all posts by this author.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_authors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Failed to delete author. Please try again.');
    }
  };

  const totalPages = Math.ceil(totalAuthors / authorsPerPage);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content"
        title="Authors"
        description="Manage the people credited on blog posts."
        actions={
          <Link href="/admin/authors/new" className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            New author
          </Link>
        }
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          className={`${ADMIN_INPUT} pl-10`}
          placeholder="Search authors..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : authors.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <div key={author.id} className={`${ADMIN_CARD} ${ADMIN_CARD_PAD} flex flex-col`}>
              <div className="mb-4 flex items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <span className="font-display text-xl font-semibold">
                        {author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className={`${ADMIN_H2} truncate`}>{author.name}</h3>
                  {author.role && <p className={`${ADMIN_EYEBROW} mt-1 truncate`}>{author.role}</p>}
                </div>
              </div>
              <p className="mb-5 line-clamp-3 text-sm text-muted-foreground">
                {author.bio}
              </p>
              <div className="mt-auto flex flex-wrap justify-end gap-2">
                <Link href={`/admin/authors/${author.id}/edit`} className={`${ADMIN_BTN_OUTLINE} h-9 px-3.5`}>
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <button onClick={() => handleDelete(author.id)} className={`${ADMIN_BTN_DANGER} h-9 px-3.5`}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={ADMIN_CARD}>
          <div className={ADMIN_EMPTY}>
            <p className="mb-4">
              {searchTerm ? 'No authors found matching your search.' : 'No authors yet.'}
            </p>
            {!searchTerm && (
              <Link href="/admin/authors/new" className={ADMIN_BTN_PRIMARY}>
                <Plus className="h-4 w-4" />
                Create your first author
              </Link>
            )}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 justify-between gap-3 sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={ADMIN_BTN_OUTLINE}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={ADMIN_BTN_OUTLINE}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground tabular-nums">
              Showing <span className="font-medium text-foreground">{Math.min(1 + (currentPage - 1) * authorsPerPage, totalAuthors)}</span> to{' '}
              <span className="font-medium text-foreground">{Math.min(currentPage * authorsPerPage, totalAuthors)}</span> of{' '}
              <span className="font-medium text-foreground">{totalAuthors}</span> results
            </p>
            <nav className="inline-flex flex-wrap items-center gap-1" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`${ADMIN_ICON_BTN} disabled:opacity-50 disabled:pointer-events-none`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${ADMIN_ICON_BTN} text-sm tabular-nums ${
                    page === currentPage ? 'bg-foreground text-background hover:bg-foreground/85 hover:text-background' : ''
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`${ADMIN_ICON_BTN} disabled:opacity-50 disabled:pointer-events-none`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
