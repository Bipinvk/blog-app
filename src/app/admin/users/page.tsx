'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'loading' && (!session || session.user.role !== 'admin')) {
      router.push('/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    setLoading(true);
    if (session && session.user.role === 'admin') {
      fetch('/api/users')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => setError('Failed to load users'))
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container mx-auto p-4 pt-20 text-red-500">{error}</div>;

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) setUsers(users.filter((user: any) => user._id !== id));
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-xl text-gray-600 mt-2">Admin panel for user management.</p>
        </header>
        <ul className="space-y-4">
          {users?.map((user: any) => (
            <li key={user._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <p>{user.name} ({user.email}) - Role: {user.role}</p>
              <button onClick={() => handleDelete(user._id)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}