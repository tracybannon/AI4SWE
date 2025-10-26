/**
 * Centralized Error Handling System
 *
 * Provides:
 * - Custom error classes for different error types
 * - Error codes for consistent error handling
 * - Error formatting for API responses
 * - Logging integration
 */

import { createLogger } from '../logger';

const logger = createLogger('ErrorHandler');

/**
 * Error codes for consistent error handling across the application
 */
export enum ErrorCode {
  // Authentication errors (1xxx)
  UNAUTHORIZED = 'AUTH_1001',
  INVALID_CREDENTIALS = 'AUTH_1002',
  TOKEN_EXPIRED = 'AUTH_1003',
  INSUFFICIENT_PERMISSIONS = 'AUTH_1004',

  // Validation errors (2xxx)
  VALIDATION_ERROR = 'VAL_2001',
  INVALID_INPUT = 'VAL_2002',
  MISSING_REQUIRED_FIELD = 'VAL_2003',

  // Database errors (3xxx)
  DATABASE_ERROR = 'DB_3001',
  RECORD_NOT_FOUND = 'DB_3002',
  DUPLICATE_RECORD = 'DB_3003',
  CONSTRAINT_VIOLATION = 'DB_3004',

  // Business logic errors (4xxx)
  BUSINESS_RULE_VIOLATION = 'BUS_4001',
  INVALID_OPERATION = 'BUS_4002',

  // System errors (5xxx)
  INTERNAL_ERROR = 'SYS_5001',
  SERVICE_UNAVAILABLE = 'SYS_5002',
  EXTERNAL_SERVICE_ERROR = 'SYS_5003',
}

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);

    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    this.context = context;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly (TypeScript requirement)
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', code: ErrorCode = ErrorCode.UNAUTHORIZED, context?: Record<string, any>) {
    super(message, code, 401, true, context);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization error class
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', context?: Record<string, any>) {
    super(message, ErrorCode.INSUFFICIENT_PERMISSIONS, 403, true, context);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, true, context);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Not found error class
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', context?: Record<string, any>) {
    super(`${resource} not found`, ErrorCode.RECORD_NOT_FOUND, 404, true, context);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Database error class
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', context?: Record<string, any>) {
    super(message, ErrorCode.DATABASE_ERROR, 500, true, context);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Business logic error class
 */
export class BusinessError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.BUSINESS_RULE_VIOLATION, 400, true, context);
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}

/**
 * Error response format for API responses
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    timestamp: string;
    context?: Record<string, any>;
    stack?: string;
  };
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: Error | AppError): ErrorResponse {
  const isAppError = error instanceof AppError;

  const response: ErrorResponse = {
    error: {
      code: isAppError ? error.code : ErrorCode.INTERNAL_ERROR,
      message: error.message,
      timestamp: isAppError ? error.timestamp.toISOString() : new Date().toISOString(),
    },
  };

  // Add context if available
  if (isAppError && error.context) {
    response.error.context = error.context;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack;
  }

  return response;
}

/**
 * Global error handler for logging and processing errors
 */
export function handleError(error: Error | AppError, context?: Record<string, any>): ErrorResponse {
  // Log the error
  if (error instanceof AppError) {
    if (error.isOperational) {
      logger.warn(error.message, {
        code: error.code,
        statusCode: error.statusCode,
        context: { ...error.context, ...context },
      });
    } else {
      logger.error('Non-operational error occurred', error, {
        code: error.code,
        statusCode: error.statusCode,
        context: { ...error.context, ...context },
      });
    }
  } else {
    // Unknown error
    logger.error('Unexpected error occurred', error, context);
  }

  // Return formatted error response
  return formatErrorResponse(error);
}

/**
 * Async error wrapper for route handlers
 * Catches errors and passes them to the error handler
 */
export function asyncHandler<T>(
  handler: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {
  return async (...args: any[]): Promise<T> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof Error) {
        handleError(error);
      }
      throw error;
    }
  };
}

/**
 * Check if error is operational
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}
