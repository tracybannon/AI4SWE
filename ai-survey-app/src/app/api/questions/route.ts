/**
 * Questions API Routes
 *
 * GET /api/questions - Get all active questions
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { handleError } from '@/lib/errors';
import { createLogger } from '@/lib/logger';

const logger = createLogger('QuestionsAPI');

/**
 * GET handler - Fetch all active questions ordered by sequence
 */
export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching active questions');

    // Fetch all active questions ordered by their display order
    const questions = await prisma.question.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        order: true,
        text: true,
        type: true,
        required: true,
        category: true,
        options: true,
        placeholder: true,
        helpText: true,
      },
    });

    logger.info(`Retrieved ${questions.length} active questions`);

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    logger.error('Failed to fetch questions', error as Error);
    const errorResponse = handleError(error as Error, {
      endpoint: '/api/questions',
    });
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
