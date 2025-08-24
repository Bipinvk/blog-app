'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BlogForm from '@/src/components/BlogForm';
import LoadingSpinner from '@/src/components/LoadingSpinner';
export default function NewPost() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('NewPost useEffect - Session:', session, 'Status:', status);
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') return <LoadingSpinner />;

  const handleSubmit = async (title: string, content: string) => {
    console.log('NewPost handleSubmit - Session:', session, 'Submitting:', { title, content });
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) router.push('/');
    else {
      const error = await res.json();
      console.error('NewPost handleSubmit - Error response:', error);
      alert(error.error || 'Failed to create post');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-xl text-gray-600 mt-2">Share your story.</p>
        </header>
        <BlogForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}