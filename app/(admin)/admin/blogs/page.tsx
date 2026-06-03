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
      // Get total count for pagination
      const { count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .ilike('title', `%${searchTerm}%`);
      
      setTotalPosts(count || 0);
      
      // Get posts for current page
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
      
      // Refresh posts after deletion
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="mt-2 text-muted-foreground">Manage your blog content</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
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
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      {/* Posts Table */}
      <div className="bg-card shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        {post.blog_authors?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/blogs/${post.id}/edit`} 
                        className="text-primary hover:text-primary/80 mr-3"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="text-muted-foreground hover:text-foreground mr-3"
                        target="_blank"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No posts found matching your search.' : 'No posts yet.'}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create your first post
              </Link>
            )}
          </div>
        )}
      </div>

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
                Showing <span className="font-medium">{Math.min(1 + (currentPage - 1) * postsPerPage, totalPosts)}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * postsPerPage, totalPosts)}</span> of{' '}
                <span className="font-medium">{totalPosts}</span> results
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
