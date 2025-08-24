import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route'; // Changed from { auth }
import { connectToDB } from '@/lib/db';
import { Post } from '@/models/Post';
import getServerSession from 'next-auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const post = await Post.findById(params.id).populate('author', 'name');
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions); // Changed from auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectToDB();
    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { title, content } = await req.json();
    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = new Date();
    await post.save();
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions); // Changed from auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectToDB();
    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await post.deleteOne();
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}