'use client';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Calendar, User } from 'lucide-react';

export default function BlogCard({
  post,
  isOwner,
  isAdmin,
}: {
  post: any;
  isOwner?: boolean;
  isAdmin?: boolean;
}) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });

      if (res.ok) {
        toast.success('Post deleted successfully');
        window.location.reload(); // Ideally, replace with router.refresh()
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col overflow-hidden border border-gray-100">
      {/* Post Content */}
      <Link href={`/posts/${post._id}`} className="flex-1 p-5 group">
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-3 text-gray-600 line-clamp-3 leading-relaxed">
          {post.content}
        </p>

        {/* Meta Info */}
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <User size={16} /> {post.author?.name || 'Unknown'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </Link>

      {/* Action Buttons */}
      {(isOwner || isAdmin) && (
        <div className="border-t border-gray-100 px-5 py-3 flex justify-end space-x-3 bg-gray-50">
          <Link
            href={`/posts/edit/${post._id}`}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
