/**
 * Health Check API Route
 *
 * GET /api/health - Health check endpoint for monitoring
 */

import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db/prisma';
import { createLogger } from '@/lib/logger';

const logger = createLogger('HealthCheck');

/**
 * GET handler - Health check endpoint
 */
export async function GET() {
  try {
    // Check database connection
    const isDatabaseHealthy = await checkDatabaseHealth();

    if (!isDatabaseHealthy) {
      logger.error('Health check failed: Database unhealthy');
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          checks: {
            database: 'unhealthy',
          },
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'healthy',
      },
    });
  } catch (error) {
    logger.error('Health check failed', error as Error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Internal server error',
      },
      { status: 503 }
    );
  }
}
