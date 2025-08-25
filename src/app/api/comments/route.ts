import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/src/lib/db';
import { Comment } from '@/src/models/Comment'; // Assuming a Comment model
import { authOptions } from '../auth/[...nextauth]/route';
import getServerSession from 'next-auth';

// Define Comment model (create this file if not exists, e.g., src/models/Comment.ts)
// import mongoose from 'mongoose';
// const commentSchema = new mongoose.Schema({
//   content: { type: String, required: true },
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   createdAt: { type: Date, default: Date.now },
// });
// export const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get('postId');
    if (!postId) return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    const comments = await Comment.find({ postId }).populate('author', 'name');
    return NextResponse.json(comments);
  } catch (error) {
    console.error('GET /api/comments - Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectToDB();
    const { postId, content } = await req.json();
    if (!postId || !content) {
      return NextResponse.json({ error: 'postId and content are required' }, { status: 400 });
    }
    const comment = new Comment({ content, author: session.user.id, postId, createdAt: new Date() });
    await comment.save();
    return NextResponse.json(comment);
  } catch (error) {
    console.error('POST /api/comments - Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}