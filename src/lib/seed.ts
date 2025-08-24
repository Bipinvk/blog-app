import { connectToDB } from './db';
import { User } from '@/models/User';
import { Post } from '@/models/Post';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectToDB();

  // Clear existing data
  await User.deleteMany();
  await Post.deleteMany();

  // Create sample users
  const admin = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('Admin@123', 10),
    role: 'admin',
  });
  const user = new User({
    name: 'Regular User',
    email: 'user@example.com',
    password: bcrypt.hashSync('User@123', 10),
    role: 'user',
  });
  await admin.save();
  await user.save();

  // Create sample posts
  const posts = [
    {
      title: 'First Sample Post',
      content: 'This is the content of the first sample post.',
      author: admin._id,
    },
    {
      title: 'Second Sample Post',
      content: 'This is the content of the second sample post.',
      author: user._id,
    },
  ];
  await Post.insertMany(posts);

  console.log('Seeding completed!');
  process.exit();
}

seed().catch(console.error);