'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/src/components/LoadingSpinner';

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>('user');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'loading' && (!session || session.user.role !== 'admin')) {
      router.push('/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        if (session && session.user.role === 'admin') {
          const res = await fetch('/api/users', { credentials: 'include' });
          console.log('Fetch /api/users - Response Status:', res.status);
          if (!res.ok) throw new Error(`Failed to load users: ${res.status}`);
          const data = await res.json();
          console.log('Fetch /api/users - Data:', data);
          setUsers(data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      setActionLoading(id);
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      console.log('Fetch /api/users/[id] - Response Status:', res.status);
      if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`);
      const data = await res.json();
      console.log('Fetch /api/users/[id] - Data:', data);
      setUsers(users.filter((user: any) => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      router.push('/');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (id: string, currentRole: string) => {
    setEditingUserId(id);
    setNewRole(currentRole);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });
      console.log('Fetch /api/users/[id] - Response Status:', res.status);
      if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);
      const data = await res.json();
      console.log('Fetch /api/users/[id] - Data:', data);
      setUsers(users.map((user: any) => (user._id === id ? data : user)));
      setEditingUserId(null);
    } catch (err) {
      console.error('Error updating user:', err);
      router.push('/');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewRole('user');
  };

  if (status === 'loading' || loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-br from-gray-100 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Admin User Management</h1>
          <p className="text-lg text-gray-600 mt-2">Manage and update user roles efficiently.</p>
        </header>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users?.map((user: any) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingUserId === user._id ? (
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUserId === user._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(user._id)}
                          disabled={actionLoading === user._id}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                          {actionLoading === user._id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user._id, user.role)}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={actionLoading === user._id}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                        >
                          {actionLoading === user._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-4">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}