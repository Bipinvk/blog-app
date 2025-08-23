import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';

export async function GET() {
  await connectToDB();
  return NextResponse.json({ message: 'DB connected' });
}