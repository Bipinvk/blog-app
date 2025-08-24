import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    return NextResponse.json({ message: 'User registered' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Database error, please try again later' }, { status: 500 });
  }
}