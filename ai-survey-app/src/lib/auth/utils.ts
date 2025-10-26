/**
 * Authentication Utility Functions
 *
 * Provides helper functions for:
 * - Password hashing and verification
 * - User registration
 * - Session validation
 */

import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './config';
import prisma from '../db/prisma';
import { createLogger } from '../logger';
import { ValidationError, AuthenticationError, DatabaseError } from '../errors';

const logger = createLogger('AuthUtils');

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Register a new user
 */
export async function registerUser(data: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ id: string; email: string; name: string | null }> {
  try {
    // Validate input
    if (!data.email || !data.password) {
      throw new ValidationError('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate password strength
    if (data.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    // Normalize email
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: data.name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    logger.info('New user registered', {
      userId: user.id,
      email: user.email,
    });

    return user;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    logger.error('Failed to register user', error as Error);
    throw new DatabaseError('Failed to register user');
  }
}

/**
 * Get the current authenticated user session
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    logger.error('Failed to get current user', error as Error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError('Authentication required');
  }
  return user;
}

/**
 * Check if a user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
