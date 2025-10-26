/**
 * NextAuth.js Configuration
 *
 * Provides secure authentication with:
 * - Credentials provider (email/password)
 * - JWT session strategy
 * - Password hashing with bcrypt
 * - Protected routes
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { createLogger } from '../logger';
import prisma from '../db/prisma';
import { AuthenticationError } from '../errors';

const logger = createLogger('Auth');

/**
 * NextAuth configuration options
 */
export const authOptions: NextAuthOptions = {
  // Configure session strategy
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Configure JWT
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Configure pages
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },

  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          if (!credentials?.email || !credentials?.password) {
            logger.warn('Login attempt with missing credentials');
            throw new AuthenticationError('Email and password are required');
          }

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user) {
            logger.warn('Login attempt for non-existent user', {
              email: credentials.email,
            });
            throw new AuthenticationError('Invalid credentials');
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isValidPassword) {
            logger.warn('Login attempt with invalid password', {
              userId: user.id,
              email: user.email,
            });
            throw new AuthenticationError('Invalid credentials');
          }

          // Log successful login
          logger.info('User logged in successfully', {
            userId: user.id,
            email: user.email,
          });

          // Return user object (without password)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          logger.error('Authentication error', error as Error);
          return null;
        }
      },
    }),
  ],

  // Configure callbacks
  callbacks: {
    /**
     * JWT callback - Add user info to token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    /**
     * Session callback - Add user info to session
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  // Configure events for logging
  events: {
    async signIn({ user }) {
      logger.info('User signed in', { userId: user.id });
    },
    async signOut({ token }) {
      logger.info('User signed out', { userId: token.id });
    },
  },

  // Security options
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
