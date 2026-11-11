'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight
, Loader2 } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  ADMIN_BADGE,
  ADMIN_BTN_OUTLINE,
  ADMIN_BTN_PRIMARY,
  ADMIN_CARD,
  ADMIN_EMPTY,
  ADMIN_ICON_BTN,
  ADMIN_INPUT,
  ADMIN_ROW,
  ADMIN_TABLE,
  ADMIN_TABLE_WRAP,
  ADMIN_TD,
  ADMIN_TH,
  ADMIN_TONE,
} from '@/components/admin/admin-ui';

export default function BlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 10;

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .ilike('title', `%${searchTerm}%`);

      setTotalPosts(count || 0);

      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;

      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          created_at,
          updated_at,
          category,
          blog_authors(name)
        `)
        .ilike('title', `%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content"
        title="Blog posts"
        description="Write, edit and publish articles for the public blog."
        actions={
          <Link href="/admin/blogs/new" className={ADMIN_BTN_PRIMARY}>
            <Plus className="h-4 w-4" />
            New post
          </Link>
        }
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          className={`${ADMIN_INPUT} pl-10`}
          placeholder="Search posts..."
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
      ) : posts.length > 0 ? (
        <div className={ADMIN_TABLE_WRAP}>
          <table className={ADMIN_TABLE}>
            <thead>
              <tr>
                <th scope="col" className={ADMIN_TH}>Title</th>
                <th scope="col" className={ADMIN_TH}>Category</th>
                <th scope="col" className={ADMIN_TH}>Author</th>
                <th scope="col" className={ADMIN_TH}>Date</th>
                <th scope="col" className={`${ADMIN_TH} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className={ADMIN_ROW}>
                  <td className={`${ADMIN_TD} whitespace-nowrap font-medium`}>{post.title}</td>
                  <td className={`${ADMIN_TD} whitespace-nowrap`}>
                    <span className={`${ADMIN_BADGE} ${ADMIN_TONE.accent}`}>{post.category}</span>
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground`}>
                    {post.blog_authors?.name || 'Unknown'}
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap text-muted-foreground tabular-nums`}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className={`${ADMIN_TD} whitespace-nowrap text-right`}>
                    <div className="inline-flex items-center gap-1">
                      <Link href={`/admin/blogs/${post.id}/edit`} className={ADMIN_ICON_BTN} aria-label="Edit post">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Link href={`/blog/${post.slug}`} className={ADMIN_ICON_BTN} target="_blank" aria-label="View post">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className={`${ADMIN_ICON_BTN} hover:bg-destructive/10 hover:text-destructive`}
                        aria-label="Delete post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={ADMIN_CARD}>
          <div className={ADMIN_EMPTY}>
            <p className="mb-4">
              {searchTerm ? 'No posts found matching your search.' : 'No posts yet.'}
            </p>
            {!searchTerm && (
              <Link href="/admin/blogs/new" className={ADMIN_BTN_PRIMARY}>
                <Plus className="h-4 w-4" />
                Create your first post
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
              Showing <span className="font-medium text-foreground">{Math.min(1 + (currentPage - 1) * postsPerPage, totalPosts)}</span> to{' '}
              <span className="font-medium text-foreground">{Math.min(currentPage * postsPerPage, totalPosts)}</span> of{' '}
              <span className="font-medium text-foreground">{totalPosts}</span> results
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
