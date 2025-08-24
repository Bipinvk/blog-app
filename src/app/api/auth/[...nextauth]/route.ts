import { connectToDB } from '@/src/lib/db';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/src/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectToDB();
          console.log('Authorize - DB URI:', process.env.MONGODB_URI);
          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            console.log('Authorize - User not found:', credentials?.email);
            return null;
          }
          if (!bcrypt.compareSync(credentials?.password, user.password)) {
            console.log('Authorize - Password mismatch:', credentials?.email);
            return null;
          }
          console.log('Authorize - Success:', { id: user._id, email: user.email, role: user.role });
          return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
        } catch (error) {
          console.error('Authorize - Error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - Input:', { token, user });
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      console.log('JWT Callback - Output:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Input:', { session, token });
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }
      console.log('Session Callback - Output:', session);
      return session;
    },
  },
  pages: { signIn: '/login', error: '/login' },
  debug: true,
};

const { auth, handlers } = NextAuth(authOptions);
export const { GET, POST } = handlers;