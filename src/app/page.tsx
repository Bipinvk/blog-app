'use client';
import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // 👈 new state for debounce
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce effect for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when new search
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fetch posts based on debounced search
  useEffect(() => {
    setLoading(true);
    fetch(`/api/posts?search=${debouncedSearch}&page=${page}&limit=6`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data) => {
        setPosts(data.posts || []);
        setTotal(data.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch, page]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="container mx-auto p-4 pt-20 text-red-500">{error}</div>
    );

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="text-center py-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Blog<span className="text-indigo-600">Hub</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover fresh perspectives, insightful articles, and trending
            stories written by our community.
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-10 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by title..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post: any) => <BlogCard key={post._id} post={post} />)
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No posts found. Try another search.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12 space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-medium self-center">
            Page {page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * 6 >= total}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
