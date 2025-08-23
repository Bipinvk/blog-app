'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${params.id}`);
      const data = await res.json();
      setPost(data);
    };
    fetchPost();
  }, [params.id]);

  if (!post) return <div>Loading...</div>;

  const isOwner = session?.user.id === post.author._id;
  const isAdmin = session?.user.role === 'admin';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">{post.title}</h1>
      <p className="text-gray-600">By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      {(isOwner || isAdmin) && (
        <>
          <Link href={`/posts/edit/${post._id}`} className="text-green-500 mr-4">Edit</Link>
          <button onClick={async () => {
            await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
            window.location.href = '/';
          }} className="text-red-500">Delete</button>
        </>
      )}
    </div>
  );
}