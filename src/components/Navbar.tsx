'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link href="/">Blog App</Link>
        <div>
          {session ? (
            <>
              <Link href="/profile" className="mr-4">Profile</Link>
              <Link href="/posts/new" className="mr-4">New Post</Link>
              <button onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="mr-4">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}