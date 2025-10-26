/**
 * Enterprise Logging Infrastructure
 *
 * Provides a centralized logging system using Winston with:
 * - Multiple log levels (error, warn, info, debug)
 * - Daily log rotation
 * - Structured logging with metadata
 * - Different transports for development and production
 * - Request correlation IDs for tracing
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for console output
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to Winston
winston.addColors(colors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

/**
 * Create transports based on environment
 */
const createTransports = (): winston.transport[] => {
  const transports: winston.transport[] = [];

  // Console transport (always enabled)
  transports.push(
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    })
  );

  // File transports for production
  if (process.env.NODE_ENV === 'production') {
    // Error log file
    transports.push(
      new DailyRotateFile({
        filename: path.join('logs', 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxFiles: '30d',
        maxSize: '20m',
        format: logFormat,
      })
    );

    // Combined log file
    transports.push(
      new DailyRotateFile({
        filename: path.join('logs', 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d',
        maxSize: '20m',
        format: logFormat,
      })
    );
  }

  return transports;
};

/**
 * Create the Winston logger instance
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  transports: createTransports(),
  exitOnError: false,
});

/**
 * Logger utility class with convenience methods
 */
export class Logger {
  private context: string;
  private metadata: Record<string, any>;

  constructor(context: string = 'Application', metadata: Record<string, any> = {}) {
    this.context = context;
    this.metadata = metadata;
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, additionalMeta?: Record<string, any>): void {
    logger.error(message, {
      context: this.context,
      ...this.metadata,
      ...additionalMeta,
      ...(error && {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      }),
    });
  }

  /**
   * Log a warning message
   */
  warn(message: string, meta?: Record<string, any>): void {
    logger.warn(message, {
      context: this.context,
      ...this.metadata,
      ...meta,
    });
  }

  /**
   * Log an info message
   */
  info(message: string, meta?: Record<string, any>): void {
    logger.info(message, {
      context: this.context,
      ...this.metadata,
      ...meta,
    });
  }

  /**
   * Log a debug message
   */
  debug(message: string, meta?: Record<string, any>): void {
    logger.debug(message, {
      context: this.context,
      ...this.metadata,
      ...meta,
    });
  }

  /**
   * Log HTTP request information
   */
  http(message: string, meta?: Record<string, any>): void {
    logger.http(message, {
      context: this.context,
      ...this.metadata,
      ...meta,
    });
  }

  /**
   * Create a child logger with additional context
   */
  child(context: string, metadata?: Record<string, any>): Logger {
    return new Logger(`${this.context}:${context}`, {
      ...this.metadata,
      ...metadata,
    });
  }
}

/**
 * Create and export default logger instance
 */
export const defaultLogger = new Logger('Application');

/**
 * Export factory function for creating contextual loggers
 */
export const createLogger = (context: string, metadata?: Record<string, any>): Logger => {
  return new Logger(context, metadata);
};

export default logger;
