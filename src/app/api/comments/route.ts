import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { connectToDB } from '@/lib/db';
import { Comment } from '@/models/Comment';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDB();
  const { content, postId } = await req.json();
  if (!content || !postId) return NextResponse.json({ error: 'Content and postId are required' }, { status: 400 });
  const comment = new Comment({ content, author: session.user.id, post: postId });
  await comment.save();
  return NextResponse.json(comment);
}

export async function GET(req: NextRequest) {
  await connectToDB();
  const { postId } = req.nextUrl.searchParams;
  if (!postId) return NextResponse.json({ error: 'postId is required' }, { status: 400 });
  const comments = await Comment.find({ post: postId }).populate('author', 'name');
  return NextResponse.json(comments);
}