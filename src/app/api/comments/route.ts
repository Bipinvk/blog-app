import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/src/lib/db';
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    // Example: Return comments (implement your logic)
    return NextResponse.json({ message: 'Comments endpoint' });
  } catch (error) {
    console.error('GET /api/comments - Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}