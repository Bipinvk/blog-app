'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import BlogCard from '@/components/BlogCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/posts?search=${search}`);
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, [search]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Blog Posts</h1>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="mb-4 p-2 border" />
      {posts.map((post: any) => (
        <BlogCard 
          key={post._id} 
          post={post} 
          isOwner={session?.user.id === post.author._id} 
          isAdmin={session?.user.role === 'admin'} 
        />
      ))}
    </div>
  );
}