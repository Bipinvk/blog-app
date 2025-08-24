'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition"
        >
          BlogHub
        </Link>

        {/* Menu */}
        <div className="flex space-x-4">
          {session ? (
            <>
              <Link
                href="/profile"
                className={`px-3 py-2 rounded-md transition ${
                  pathname === '/profile'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profile
              </Link>
              <Link
                href="/posts/new"
                className={`px-3 py-2 rounded-md transition ${
                  pathname === '/posts/new'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                New Post
              </Link>
              {session.user.role === 'admin' && (
                <Link
                  href="/admin/users"
                  className={`px-3 py-2 rounded-md transition ${
                    pathname === '/admin/users'
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Manage Users
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`px-3 py-2 rounded-md transition ${
                  pathname === '/login'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`px-3 py-2 rounded-md transition ${
                  pathname === '/register'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
