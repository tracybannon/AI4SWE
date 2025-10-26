/**
 * Evaluations API Routes
 *
 * GET /api/evaluations - Get all evaluations for current user
 * POST /api/evaluations - Create a new evaluation
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/utils';
import { handleError, ValidationError } from '@/lib/errors';
import { createLogger } from '@/lib/logger';

const logger = createLogger('EvaluationsAPI');

/**
 * Create evaluation request schema
 */
const createEvaluationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  phase: z.enum(['before', 'after'], {
    errorMap: () => ({ message: 'Phase must be either "before" or "after"' }),
  }),
  responses: z.record(z.string(), z.string()),
});

/**
 * GET handler - Fetch all evaluations for the current user
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    logger.info('Fetching evaluations for user', { userId: user.id });

    // Fetch evaluations with response counts
    const evaluations = await prisma.evaluation.findMany({
      where: {
        userId: user.id,
      },
      include: {
        responses: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    logger.info(`Retrieved ${evaluations.length} evaluations`);

    return NextResponse.json({
      success: true,
      evaluations: evaluations.map((eval) => ({
        id: eval.id,
        name: eval.name,
        description: eval.description,
        phase: eval.phase,
        status: eval.status,
        responseCount: eval._count.responses,
        createdAt: eval.createdAt,
        completedAt: eval.completedAt,
      })),
    });
  } catch (error) {
    logger.error('Failed to fetch evaluations', error as Error);
    const errorResponse = handleError(error as Error, {
      endpoint: '/api/evaluations',
    });
    const statusCode = error instanceof Error && 'statusCode' in error
      ? (error as any).statusCode
      : 500;
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

/**
 * POST handler - Create a new evaluation with responses
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createEvaluationSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => e.message).join(', ');
      throw new ValidationError(errors);
    }

    const { name, description, phase, responses } = validationResult.data;

    logger.info('Creating evaluation', {
      userId: user.id,
      name,
      phase,
    });

    // Create evaluation with responses in a transaction
    const evaluation = await prisma.$transaction(async (tx) => {
      // Create the evaluation
      const newEvaluation = await tx.evaluation.create({
        data: {
          userId: user.id,
          name,
          description,
          phase,
          status: 'completed',
          completedAt: new Date(),
        },
      });

      // Create responses
      const responseData = Object.entries(responses).map(([questionId, answer]) => ({
        evaluationId: newEvaluation.id,
        questionId,
        answer,
      }));

      await tx.response.createMany({
        data: responseData,
      });

      return newEvaluation;
    });

    logger.info('Evaluation created successfully', {
      evaluationId: evaluation.id,
      userId: user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Evaluation created successfully',
        evaluation: {
          id: evaluation.id,
          name: evaluation.name,
          phase: evaluation.phase,
          status: evaluation.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Failed to create evaluation', error as Error);
    const errorResponse = handleError(error as Error, {
      endpoint: '/api/evaluations',
    });
    const statusCode = error instanceof ValidationError ? 400 : 500;
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
