import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/src/lib/db';
import { Post } from '@/src/models/Post';
import { authOptions } from '../auth/[...nextauth]/route';
import getServerSession from 'next-auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    console.log('GET /api/posts - Starting request:', Object.fromEntries(req.nextUrl.searchParams));
    const { search, page = '1', limit = '6', author } = Object.fromEntries(req.nextUrl.searchParams);
    let query = {};
    if (search) query = { ...query, title: new RegExp(search, 'i') };
    if (author) query = { ...query, author }; // Filter by author ID
    const posts = await Post.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('author', 'name');
    const total = await Post.countDocuments(query);
    console.log('GET /api/posts - Successfully fetched posts:', { count: posts.length, total });
    return NextResponse.json({ posts, total });
  } catch (error) {
    console.error('GET /api/posts - Error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    console.log('POST /api/posts - Unauthorized:', { session });
    const sessionToken = req.headers.get('cookie')?.match(/authjs.session-token=([^;]+)/)?.[1];
    if (sessionToken) {
      const userId = '68a95284280bc537484d9b05'; // Hardcoded for testing
      const { title, content } = await req.json();
      const post = new Post({ title, content, author: userId, createdAt: new Date(), updatedAt: new Date() });
      await post.save();
      return NextResponse.json(post);
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectToDB();
    const { title, content } = await req.json();
    console.log('POST /api/posts - Request body:', { title, content });
    if (!title || !content) {
      console.log('POST /api/posts - Validation failed');
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    const post = new Post({ title, content, author: session.user.id, createdAt: new Date(), updatedAt: new Date() });
    await post.save();
    console.log('POST /api/posts - Post created:', post._id);
    return NextResponse.json(post);
  } catch (error) {
    console.error('POST /api/posts - Error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.log('PUT /api/posts - Unauthorized:', { session });
    const sessionToken = req.headers.get('cookie')?.match(/authjs.session-token=([^;]+)/)?.[1];
    if (sessionToken) {
      console.log('PUT /api/posts - Found session token:', sessionToken);
      // Temporary fallback - Replace with proper JWT decoding
      const userId = '68a95284280bc537484d9b05'; // Hardcoded for testing
      try {
        await connectToDB();
        const { title, content } = await req.json();
        const post = await Post.findOne({ author: userId }); // Find a post by author for update (example logic)
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        post.title = title || post.title;
        post.content = content || post.content;
        post.updatedAt = new Date();
        await post.save();
        return NextResponse.json(post);
      } catch (error) {
        console.error('PUT /api/posts - Fallback error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectToDB();
    const { title, content } = await req.json();
    console.log('PUT /api/posts - Request body:', { title, content });
    // Note: PUT on /api/posts should target a specific post; consider moving this to /api/posts/[id]
    const post = await Post.findOne({ author: session.user.id }); // Example: Update the latest post by author
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = new Date();
    await post.save();
    return NextResponse.json(post);
  } catch (error) {
    console.error('PUT /api/posts - Error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.log('DELETE /api/posts - Unauthorized:', { session });
    const sessionToken = req.headers.get('cookie')?.match(/authjs.session-token=([^;]+)/)?.[1];
    if (sessionToken) {
      console.log('DELETE /api/posts - Found session token:', sessionToken);
      const userId = '68a95284280bc537484d9b05'; // Hardcoded for testing
      try {
        await connectToDB();
        const post = await Post.findOne({ author: userId }); // Example: Delete the latest post by author
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        await post.deleteOne();
        return NextResponse.json({ message: 'Post deleted' });
      } catch (error) {
        console.error('DELETE /api/posts - Fallback error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectToDB();
    const post = await Post.findOne({ author: session.user.id }); // Example: Delete the latest post by author
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    await post.deleteOne();
    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('DELETE /api/posts - Error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}