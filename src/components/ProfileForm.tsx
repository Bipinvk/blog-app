'use client';
import { useState, useEffect } from 'react';

export default function ProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setName(data.name);
      setEmail(data.email);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
      setMessage('Profile updated');
      setPassword('');
    } else {
      setMessage('Error updating');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="block mb-2 p-2 border" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="block mb-2 p-2 border" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password (optional)" className="block mb-2 p-2 border" />
      <button type="submit" className="bg-blue-500 text-white p-2">Update</button>
      {message && <p>{message}</p>}
    </form>
  );
}