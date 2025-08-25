'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

export default function CommentForm({ postId, onCommentAdded }: { postId: string; onCommentAdded: () => void }) {
  const [content, setContent] = useState('');
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setLoading(true);
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content }),
      credentials: 'include', // Ensure session cookie is sent
    });
    setLoading(false);
    if (res.ok) {
      setContent('');
      toast.success('Comment added');
      onCommentAdded();
    } else {
      toast.error('Failed to add comment');
    }
  };

  if (!session) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Write a comment..."
        disabled={loading}
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}