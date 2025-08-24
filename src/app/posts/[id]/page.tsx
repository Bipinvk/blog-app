'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import CommentForm from '@/components/CommentForm';

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/posts/${params.id}`).then(res => res.json()),
      fetch(`/api/comments?postId=${params.id}`).then(res => res.json()),
    ])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setComments(commentsData);
      })
      .catch(err => setError('Failed to load post or comments'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <LoadingSpinner />;
  if (error || !post) return <div className="container mx-auto p-4 pt-20 text-red-500">{error || 'Post not found'}</div>;

  const isOwner = session?.user?.id === post.author._id;
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <article className="bg-white rounded-lg shadow-lg p-8">
          <header className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
            <p className="text-sm text-gray-500 mt-2">By {post.author.name} · {new Date(post.createdAt).toLocaleDateString()} · Updated {new Date(post.updatedAt).toLocaleDateString()}</p>
          </header>
          <div className="prose max-w-none text-gray-700 mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
          {(isOwner || isAdmin) && (
            <div className="flex space-x-4 mb-6">
              <button onClick={() => router.push(`/posts/edit/${post._id}`)} className="btn-primary">Edit Post</button>
              <button onClick={async () => { if (confirm('Are you sure?')) { await fetch(`/api/posts/${post._id}`, { method: 'DELETE' }); router.push('/'); } }} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">Delete Post</button>
            </div>
          )}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            {comments.length > 0 ? (
              comments.map((comment: any) => (
                <div key={comment._id} className="border p-4 mb-4 rounded-md">
                  <p>{comment.content}</p>
                  <p className="text-sm text-gray-500">By {comment.author.name} · {new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
            {session && <CommentForm postId={params.id} onCommentAdded={() => setComments([...comments])} />}
          </section>
        </article>
      </div>
    </div>
  );
}