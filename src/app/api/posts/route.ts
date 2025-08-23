import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../auth/[...nextauth]/route';
import { connectToDB } from '@/lib/db';
import { Post } from '@/models/Post';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const filter: any = {};
    const search = searchParams.get('search');
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    const author = searchParams.get('author');
    if (author) filter.author = author;

    const posts = await Post.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(filter);
    return NextResponse.json({ posts, total });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectToDB();
    const { title, content } = await req.json();
    const post = new Post({ title, content, author: session.user.id });
    await post.save();
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}