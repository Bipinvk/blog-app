'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/src/components/BlogForm';
import LoadingSpinner from '@/src/components/LoadingSpinner';
export default function EditPost({ params }: { params: { id: string } }) {
  const [initialTitle, setInitialTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/posts/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setInitialTitle(data.title);
        setInitialContent(data.content);
      })
      .catch(err => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (status === 'loading' || loading) return <LoadingSpinner />;
  if (error) return <div className="container mx-auto p-4 pt-20 text-red-500">{error}</div>;

  const handleSubmit = async (title: string, content: string) => {
    const res = await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) router.push(`/posts/${params.id}`);
    else {
      const error = await res.json();
      alert(error.error || 'Failed to update post');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-xl text-gray-600 mt-2">Refine your content.</p>
        </header>
        <BlogForm initialTitle={initialTitle} initialContent={initialContent} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}