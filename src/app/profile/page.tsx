'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BlogCard from '@/components/BlogCard';
import ProfileForm from '@/components/ProfileForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    setLoading(true);
    if (session) {
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

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-xl text-gray-600 mt-2">Manage your account and posts.</p>
        </header>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Account Details</h2>
          <ProfileForm />
        </section>
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Your Posts</h2>
            <Link href="/" className="text-blue-600 hover:text-blue-800">View All Posts</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <BlogCard key={post._id} post={post} isOwner={true} isAdmin={session?.user.role === 'admin'} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">You haven’t created any posts yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}