import Link from 'next/link';

export default function BlogCard({ post, isOwner, isAdmin }: { post: any; isOwner?: boolean; isAdmin?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <Link href={`/posts/${post._id}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
        <p className="text-sm text-gray-500">By {post.author.name} · {new Date(post.createdAt).toLocaleDateString()}</p>
      </Link>
      {(isOwner || isAdmin) && (
        <div className="mt-4 flex space-x-2">
          <Link href={`/posts/edit/${post._id}`} className="btn-primary text-sm">Edit</Link>
          <button onClick={async () => { if (confirm('Are you sure?')) { await fetch(`/api/posts/${post._id}`, { method: 'DELETE' }); window.location.reload(); } }} className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 text-sm">Delete</button>
        </div>
      )}
    </div>
  );
}