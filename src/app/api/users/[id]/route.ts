import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDB } from '@/src/lib/db';
import { User } from '@/src/models/User';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('PUT /api/users/[id] - Token:', token);
  if (!token || token.role !== 'admin') {
    console.log('PUT /api/users/[id] - Forbidden: No token or role mismatch', { role: token?.role });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await connectToDB();
    const { role } = await req.json();
    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    const user = await User.findByIdAndUpdate(
      params.id,
      { role, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error('PUT /api/users/[id] - Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('DELETE /api/users/[id] - Token:', token);
  if (!token || token.role !== 'admin') {
    console.log('DELETE /api/users/[id] - Forbidden: No token or role mismatch', { role: token?.role });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await connectToDB();
    const user = await User.findByIdAndDelete(params.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    console.error('DELETE /api/users/[id] - Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}