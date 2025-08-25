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

export async function PUT(req: NextRequest, context: Params) {
  const session = await getServerSession(authOptions);
  console.log('PUT /api/posts/[id] - Received session:', session);
  if (!session?.user) {
    console.log('PUT /api/posts/[id] - Unauthorized:', { session });
    const cookieHeader = req.headers.get('cookie');
    console.log('PUT /api/posts/[id] - Cookie Header:', cookieHeader);
    const sessionToken = cookieHeader?.match(/authjs.session-token=([^;]+)/)?.[1];
    console.log('PUT /api/posts/[id] - Extracted Session Token:', sessionToken);
    if (sessionToken) {
      const userId = '68a95284280bc537484d9b05'; // Hardcoded for testing
      try {
        await connectToDB();
        const { id } = context.params;
        console.log('PUT /api/posts/[id] - Params:', { id });
        const { title, content } = await req.json();
        const post = await Post.findById(id);
        if (!post || post.author.toString() !== userId) {
          return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
        }
        post.title = title || post.title;
        post.content = content || post.content;
        post.updatedAt = new Date();
        await post.save();
        console.log('PUT /api/posts/[id] - Post updated:', { id });
        return NextResponse.json(post);
      } catch (error) {
        console.error('PUT /api/posts/[id] - Fallback error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectToDB();
    const { id } = context.params;
    console.log('PUT /api/posts/[id] - Params:', { id });
    const { title, content } = await req.json();
    console.log('PUT /api/posts/[id] - Request body:', { title, content });
    const post = await Post.findById(id);
    if (!post || post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = new Date();
    await post.save();
    console.log('PUT /api/posts/[id] - Post updated:', { id });
    return NextResponse.json(post);
  } catch (error) {
    console.error('PUT /api/posts/[id] - Error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: Params) {
  const session = await getServerSession(authOptions);
  console.log('DELETE /api/posts/[id] - Received session:', session);
  if (!session?.user) {
    console.log('DELETE /api/posts/[id] - Unauthorized:', { session });
    const cookieHeader = req.headers.get('cookie');
    console.log('DELETE /api/posts/[id] - Cookie Header:', cookieHeader);
    const sessionToken = cookieHeader?.match(/authjs.session-token=([^;]+)/)?.[1];
    console.log('DELETE /api/posts/[id] - Extracted Session Token:', sessionToken);
    if (sessionToken) {
      const userId = '68a95284280bc537484d9b05'; // Hardcoded for testing
      try {
        await connectToDB();
        const { id } = context.params;
        console.log('DELETE /api/posts/[id] - Params:', { id });
        const post = await Post.findById(id);
        if (!post || post.author.toString() !== userId) {
          return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
        }
        await post.deleteOne();
        console.log('DELETE /api/posts/[id] - Post deleted:', { id });
        return NextResponse.json({ message: 'Post deleted' });
      } catch (error) {
        console.error('DELETE /api/posts/[id] - Fallback error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectToDB();
    const { id } = context.params;
    console.log('DELETE /api/posts/[id] - Params:', { id });
    const post = await Post.findById(id);
    if (!post || post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }
    await post.deleteOne();
    console.log('DELETE /api/posts/[id] - Post deleted:', { id });
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('DELETE /api/posts/[id] - Error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}