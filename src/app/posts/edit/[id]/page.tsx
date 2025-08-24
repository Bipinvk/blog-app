'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/src/components/BlogForm';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { toast } from 'react-toastify';

export default function EditPost({ params }: { params: { id: string } }) {
  const [initialTitle, setInitialTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Fetch post data
  useEffect(() => {
    setLoading(true);
    fetch(`/api/posts/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch post');
        return res.json();
      })
      .then(data => {
        setInitialTitle(data.title);
        setInitialContent(data.content);
        setAuthorId(data.author._id);
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (status === 'loading' || loading) return <LoadingSpinner />;
  if (error) return <div className="container mx-auto p-4 pt-20 text-red-500">{error}</div>;

  // Prevent unauthorized editing
  if (session?.user?.id !== authorId && session?.user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-4 pt-20 text-red-500">
        You do not have permission to edit this post.
      </div>
    );
  }

  const handleSubmit = async (title: string, content: string) => {
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        toast.success('Post updated successfully!');
        router.push(`/posts/${params.id}`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to update post');
      }
    } catch {
      toast.error('Something went wrong while updating');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-xl text-gray-600 mt-2">Refine your content.</p>
        </header>
        <BlogForm
          initialTitle={initialTitle}
          initialContent={initialContent}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
