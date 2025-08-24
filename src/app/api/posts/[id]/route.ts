import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDB } from '@/src/lib/db';
import { Post } from '@/src/models/Post';
import getServerSession from 'next-auth';

// Define the params type to handle Promise
type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB();
    const params = await context.params; // Resolve the Promise
    const { id } = params;
    const post = await Post.findById(id).populate('author', 'name');
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/posts/[id] - Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;
    const { title, content } = await req.json();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    if (post.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = new Date();
    await post.save();
    return NextResponse.json(post);
  } catch (error) {
    console.error('PUT /api/posts/[id] - Error updating post:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectToDB();
    const params = await context.params;
    const { id } = params;
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    if (post.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await post.deleteOne();
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('DELETE /api/posts/[id] - Error deleting post:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}