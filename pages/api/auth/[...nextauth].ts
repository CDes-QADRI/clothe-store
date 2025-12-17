import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

type TokenWithId = JWT & { id?: string };
type SessionUserWithId = NonNullable<Session['user']> & { id?: string };

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const email = (credentials.email ?? '').toLowerCase();
        const password = credentials.password ?? '';

        if (!email || !password) return null;

        await connectDB();

        const user = await User.findOne({ email }).lean();
        if (!user) return null;
        if (!user.isVerified) {
          return null;
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        };
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as TokenWithId).id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      const tokenWithId = token as TokenWithId;
      if (session.user && tokenWithId.id) {
        (session.user as SessionUserWithId).id = tokenWithId.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
