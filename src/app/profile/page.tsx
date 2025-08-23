'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BlogCard from '@/components/BlogCard';
import ProfileForm from '@/components/ProfileForm';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    const fetchPosts = async () => {
      const res = await fetch(`/api/posts?author=${session?.user.id}`);
      const data = await res.json();
      setPosts(data.posts);
    };
    if (session) fetchPosts();
  }, [session, status, router]);

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Profile</h1>
      <ProfileForm />
      <h2 className="text-xl mt-8 mb-4">My Posts</h2>
      {posts.map((post: any) => (
        <BlogCard key={post._id} post={post} isOwner={true} isAdmin={session?.user.role === 'admin'} />
      ))}
    </div>
  );
}