'use client';
import BlogForm from '@/components/BlogForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewPost() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (title: string, content: string) => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl mb-4">Create New Post</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}