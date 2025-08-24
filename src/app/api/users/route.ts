import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { connectToDB } from '@/src/lib/db';
import { User } from '@/src/models/User';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectToDB();
  const users = await User.find({}).select('-password');
  return NextResponse.json(users);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await connectToDB();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'User deleted' });
}