import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDB } from '@/src/lib/db';
import { User } from '@/src/models/User';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('GET /api/users - Token:', token);
  if (!token || token.role !== 'admin') {
    console.log('GET /api/users - Forbidden: No token or role mismatch', { role: token?.role });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await connectToDB();
  const users = await User.find({}).select('-password');
  return NextResponse.json(users);
}


