'use client';
import { useEffect, useState } from 'react';
import BlogForm from '@/components/BlogForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EditPost({ params }: { params: { id: string } }) {
  const [initialTitle, setInitialTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${params.id}`);
      const data = await res.json();
      setInitialTitle(data.title);
      setInitialContent(data.content);
    };
    fetchPost();
  }, [params.id]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (title: string, content: string) => {
    await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl mb-4">Edit Post</h1>
      <BlogForm initialTitle={initialTitle} initialContent={initialContent} onSubmit={handleSubmit} />
    </div>
  );
}