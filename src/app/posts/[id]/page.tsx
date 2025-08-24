'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import CommentForm from '@/src/components/CommentForm';
import { toast } from 'react-toastify';

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postRes, commentsRes] = await Promise.all([
        fetch(`/api/posts/${params.id}`),
        fetch(`/api/comments?postId=${params.id}`),
      ]);
      if (!postRes.ok || !commentsRes.ok) throw new Error('Failed to fetch');
      const postData = await postRes.json();
      const commentsData = await commentsRes.json();
      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      setError('Failed to load post or comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (error || !post)
    return (
      <div className="container mx-auto p-4 pt-20 text-red-500">
        {error || 'Post not found'}
      </div>
    );

  const isOwner = session?.user?.id === post.author._id;
  const isAdmin = session?.user?.role === 'admin';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      toast.success('Post deleted successfully');
      router.push('/');
    } catch {
      toast.error('Error deleting post');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <article className="bg-white rounded-lg shadow-lg p-8">
          {/* Post Header */}
          <header className="mb-6 border-b pb-4">
            <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
            <p className="text-sm text-gray-500 mt-2">
              By <span className="font-medium">{post.author.name}</span> ·{' '}
              {new Date(post.createdAt).toLocaleDateString()} · Updated{' '}
              {new Date(post.updatedAt).toLocaleDateString()}
            </p>
          </header>

          {/* Post Content */}
          <div
            className="prose max-w-none text-gray-700 mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Owner/Admin Actions */}
          {(isOwner || isAdmin) && (
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => router.push(`/posts/edit/${post._id}`)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Edit Post
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete Post
              </button>
            </div>
          )}

          {/* Comments Section */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <div
                    key={comment._id}
                    className="border p-4 rounded-md bg-gray-50"
                  >
                    <p className="text-gray-800">{comment.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      By <span className="font-medium">{comment.author.name}</span> ·{' '}
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}

            {/* Add Comment */}
            {session && (
              <CommentForm
                postId={params.id}
                onCommentAdded={async () => {
                  await fetchData(); // refresh after adding comment
                }}
              />
            )}
          </section>
        </article>
      </div>
    </div>
  );
}
