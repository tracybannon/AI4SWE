/**
 * Single Evaluation API Routes
 *
 * GET /api/evaluations/[id] - Get evaluation details with responses
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/utils';
import { handleError, NotFoundError, AuthorizationError } from '@/lib/errors';
import { createLogger } from '@/lib/logger';

const logger = createLogger('EvaluationDetailsAPI');

/**
 * GET handler - Fetch evaluation by ID with responses
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const user = await requireAuth();
    const evaluationId = params.id;

    logger.info('Fetching evaluation details', {
      evaluationId,
      userId: user.id,
    });

    // Fetch evaluation with responses and questions
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: evaluationId,
      },
      include: {
        responses: {
          include: {
            question: true,
          },
          orderBy: {
            question: {
              order: 'asc',
            },
          },
        },
      },
    });

    if (!evaluation) {
      throw new NotFoundError('Evaluation');
    }

    // Check if evaluation belongs to the current user
    if (evaluation.userId !== user.id) {
      throw new AuthorizationError('You do not have access to this evaluation');
    }

    logger.info('Evaluation details retrieved successfully', {
      evaluationId,
    });

    return NextResponse.json({
      success: true,
      evaluation: {
        id: evaluation.id,
        name: evaluation.name,
        description: evaluation.description,
        phase: evaluation.phase,
        status: evaluation.status,
        createdAt: evaluation.createdAt,
        completedAt: evaluation.completedAt,
        responses: evaluation.responses.map((response) => ({
          questionId: response.questionId,
          questionText: response.question.text,
          questionCategory: response.question.category,
          answer: response.answer,
        })),
      },
    });
  } catch (error) {
    logger.error('Failed to fetch evaluation details', error as Error);
    const errorResponse = handleError(error as Error, {
      endpoint: `/api/evaluations/${params.id}`,
    });
    const statusCode = error instanceof Error && 'statusCode' in error
      ? (error as any).statusCode
      : 500;
    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
