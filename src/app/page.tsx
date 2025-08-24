'use client';
import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  setLoading(true);
  fetch(`/api/posts?search=${search}&page=${page}&limit=6`)
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
}, [search, page]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container mx-auto p-4 pt-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center py-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">BlogHub</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explore a world of ideas and insights.</p>
        </header>
        <div className="mb-8 max-w-lg mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post: any) => <BlogCard key={post._id} post={post} />)
          ) : (
            <p className="text-center text-gray-500 col-span-full">No posts found.</p>
          )}
        </div>
        <div className="flex justify-center mt-10 space-x-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700 self-center">{page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * 6 >= total}
            className="btn-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}