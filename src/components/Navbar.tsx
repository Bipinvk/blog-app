'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="bg-red shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition">BlogHub</Link>
        <div className="flex space-x-6">
          {session ? (
            <>
              <Link href="/profile" className={`text-gray-700 hover:text-blue-600 ${pathname === '/profile' ? 'font-semibold' : ''}`}>Profile</Link>
              <Link href="/posts/new" className={`text-gray-700 hover:text-blue-600 ${pathname === '/posts/new' ? 'font-semibold' : ''}`}>New Post</Link>
              {session.user.role === 'admin' && (
                <Link href="/admin/users" className={`text-gray-700 hover:text-blue-600 ${pathname === '/admin/users' ? 'font-semibold' : ''}`}>Manage Users</Link>
              )}
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-700 hover:text-blue-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className={`text-gray-700 hover:text-blue-600 ${pathname === '/login' ? 'font-semibold' : ''}`}>Login</Link>
              <Link href="/register" className={`text-gray-700 hover:text-blue-600 ${pathname === '/register' ? 'font-semibold' : ''}`}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}