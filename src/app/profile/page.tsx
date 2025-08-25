'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BlogCard from '@/src/components/BlogCard';
import ProfileForm from '@/src/components/ProfileForm';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import Link from 'next/link';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      setLoading(true);
      fetch(`/api/posts?author=${session.user.id}&page=1&limit=6`)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load posts: ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then(data => setPosts(data.posts || []))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (status === 'loading' || loading) return <LoadingSpinner />;
  if (error) return <div className="container mx-auto p-4 pt-20 text-red-500">{error}</div>;

  const handleRefreshPosts = async () => {
    if (!session) return;
    setLoadingPosts(true);
    try {
      const res = await fetch(`/api/posts?author=${session.user.id}&page=1&limit=6`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-xl text-gray-600 mt-2">Manage your account and posts.</p>
        </header>

        {/* Account Details */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Account Details</h2>
          <ProfileForm />
        </section>

        {/* Posts */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Your Posts</h2>
            <div className="flex space-x-3">
              <Link
                href="/posts/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
              >
                + New Post
              </Link>
              <button
                onClick={handleRefreshPosts}
                disabled={loadingPosts}
                className={`px-4 py-2 rounded-lg shadow transition cursor-pointer ${
                  loadingPosts
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {loadingPosts ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <BlogCard
                  key={post._id}
                  post={post}
                  isOwner={true}
                  isAdmin={session?.user.role === 'admin'}
                />
              ))
            ) : (
              <div className="col-span-full text-center">
                <p className="text-gray-500 mb-4">You haven’t created any posts yet.</p>
                <Link
                  href="/posts/new"
                  className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
                >
                  Create Your First Post
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
