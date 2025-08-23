'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface BlogFormProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (title: string, content: string) => Promise<void>;
}

export default function BlogForm({ initialTitle = '', initialContent = '', onSubmit }: BlogFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(title, content);
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="block mb-2 p-2 border w-full" required />
      <ReactQuill value={content} onChange={setContent} className="mb-2" />
      <button type="submit" className="bg-blue-500 text-white p-2">Save</button>
    </form>
  );
}