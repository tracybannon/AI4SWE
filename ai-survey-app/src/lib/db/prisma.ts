/**
 * Prisma Database Client
 *
 * Provides a singleton instance of the Prisma client with:
 * - Connection pooling
 * - Query logging in development
 * - Error handling integration
 * - Hot module reloading support
 */

import { PrismaClient } from '@prisma/client';
import { createLogger } from '../logger';

const logger = createLogger('Database');

/**
 * Extended Prisma client with logging
 */
const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { level: 'query', emit: 'event' },
            { level: 'error', emit: 'event' },
            { level: 'warn', emit: 'event' },
          ]
        : [{ level: 'error', emit: 'event' }],
  });

  // Log queries in development
  if (process.env.NODE_ENV === 'development') {
    client.$on('query' as never, (e: any) => {
      logger.debug('Prisma Query', {
        query: e.query,
        params: e.params,
        duration: e.duration,
      });
    });
  }

  // Log errors
  client.$on('error' as never, (e: any) => {
    logger.error('Prisma Error', new Error(e.message), {
      target: e.target,
    });
  });

  // Log warnings
  client.$on('warn' as never, (e: any) => {
    logger.warn('Prisma Warning', {
      message: e.message,
    });
  });

  return client;
};

// Declare global type for Prisma client
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

/**
 * Singleton Prisma client instance
 * Uses globalThis to prevent multiple instances during hot reloading in development
 */
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// Store on globalThis in development to prevent creating new instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

/**
 * Connect to database
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', error as Error);
    throw error;
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Failed to disconnect from database', error as Error);
    throw error;
  }
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed', error as Error);
    return false;
  }
}
