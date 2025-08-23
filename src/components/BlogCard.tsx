import Link from 'next/link';

interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    author: { name: string };
    createdAt: string;
  };
  isOwner?: boolean;
  isAdmin?: boolean;
}

export default function BlogCard({ post, isOwner, isAdmin }: BlogCardProps) {
  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl">{post.title}</h2>
      <p className="text-gray-600">By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }} />
      <Link href={`/posts/${post._id}`} className="text-blue-500">Read More</Link>
      {(isOwner || isAdmin) && (
        <>
          <Link href={`/posts/edit/${post._id}`} className="ml-4 text-green-500">Edit</Link>
          <button onClick={() => {/* Add delete logic */}} className="ml-4 text-red-500">Delete</button>
        </>
      )}
    </div>
  );
}