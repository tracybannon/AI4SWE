/**
 * User Registration API Route
 *
 * POST /api/auth/register - Register a new user
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { registerUser } from '@/lib/auth/utils';
import { handleError, ValidationError } from '@/lib/errors';
import { createLogger } from '@/lib/logger';

const logger = createLogger('RegistrationAPI');

/**
 * Registration request schema validation
 */
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().optional(),
});

/**
 * POST handler for user registration
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => e.message).join(', ');
      throw new ValidationError(errors);
    }

    const { email, password, name } = validationResult.data;

    // Register user
    const user = await registerUser({ email, password, name });

    logger.info('User registration successful', { userId: user.id });

    // Return success response (without sensitive data)
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Registration failed', error as Error);
    const errorResponse = handleError(error as Error, {
      endpoint: '/api/auth/register',
    });

    const statusCode = error instanceof ValidationError ? 400 : 500;
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
