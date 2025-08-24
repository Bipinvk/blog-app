'use client';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function BlogCard({ post, isOwner, isAdmin }: { post: any; isOwner?: boolean; isAdmin?: boolean }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });

      if (res.ok) {
        toast.success('Post deleted successfully');
        window.location.reload(); // or use router.refresh()
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <Link href={`/posts/${post._id}`} className="block cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
        <p className="text-sm text-gray-500">
          By {post.author?.name || 'Unknown'} · {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </Link>

      {(isOwner || isAdmin) && (
        <div className="mt-4 flex space-x-2">
          <Link
            href={`/posts/edit/${post._id}`}
            className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
