import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('Middleware - Token:', token);

  // Allow all requests to proceed, API routes handle authorization
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/users/:path*', '/admin/users'],
};