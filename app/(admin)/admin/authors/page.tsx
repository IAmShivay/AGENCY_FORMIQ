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
      // Get total count for pagination
      const { count } = await supabase
        .from('blog_authors')
        .select('*', { count: 'exact', head: true })
        .ilike('name', `%${searchTerm}%`);
      
      setTotalAuthors(count || 0);
      
      // Get authors for current page
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
      
      // Refresh authors after deletion
      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Failed to delete author. Please try again.');
    }
  };

  const totalPages = Math.ceil(totalAuthors / authorsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Authors</h1>
          <p className="mt-2 text-muted-foreground">Manage blog authors</p>
        </div>
        <Link
          href="/admin/authors/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Author
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="Search authors..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      {/* Authors Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : authors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <div key={author.id} className="bg-card rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-secondary mr-4">
                    {author.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <span className="text-xl font-bold">
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">{author.name}</h3>
                    <p className="text-sm text-muted-foreground">{author.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {author.bio}
                </p>
                <div className="flex justify-end space-x-2">
                  <Link
                    href={`/admin/authors/${author.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary bg-primary/10 hover:bg-primary/20"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow-md">
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No authors found matching your search.' : 'No authors yet.'}
          </p>
          {!searchTerm && (
            <Link
              href="/admin/authors/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create your first author
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'text-muted-foreground bg-secondary'
                  : 'text-foreground bg-card hover:bg-secondary/50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'text-muted-foreground bg-secondary'
                  : 'text-foreground bg-card hover:bg-secondary/50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-foreground">
                Showing <span className="font-medium">{Math.min(1 + (currentPage - 1) * authorsPerPage, totalAuthors)}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * authorsPerPage, totalAuthors)}</span> of{' '}
                <span className="font-medium">{totalAuthors}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium ${
                    currentPage === 1
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      page === currentPage
                        ? 'z-10 bg-primary border-primary text-white'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary/50'
                    } text-sm font-medium`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
