/**
 * Unit Tests for Error Handling System
 *
 * Tests custom error classes, error formatting, and error handling utilities
 */

import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  DatabaseError,
  BusinessError,
  ErrorCode,
  formatErrorResponse,
  handleError,
  isOperationalError,
} from '@/lib/errors';

describe('Error Handling System', () => {
  describe('AppError', () => {
    it('should create an AppError with default values', () => {
      const error = new AppError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should create an AppError with custom values', () => {
      const context = { userId: '123' };
      const error = new AppError(
        'Custom error',
        ErrorCode.VALIDATION_ERROR,
        400,
        true,
        context
      );

      expect(error.message).toBe('Custom error');
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error.context).toEqual(context);
    });

    it('should maintain proper stack trace', () => {
      const error = new AppError('Test error');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('AppError');
    });
  });

  describe('AuthenticationError', () => {
    it('should create an AuthenticationError with default message', () => {
      const error = new AuthenticationError();

      expect(error.message).toBe('Authentication failed');
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(error.statusCode).toBe(401);
      expect(error.isOperational).toBe(true);
    });

    it('should create an AuthenticationError with custom message', () => {
      const error = new AuthenticationError('Invalid token');

      expect(error.message).toBe('Invalid token');
      expect(error.statusCode).toBe(401);
    });

    it('should include context when provided', () => {
      const context = { email: 'test@example.com' };
      const error = new AuthenticationError('Login failed', ErrorCode.INVALID_CREDENTIALS, context);

      expect(error.context).toEqual(context);
      expect(error.code).toBe(ErrorCode.INVALID_CREDENTIALS);
    });
  });

  describe('AuthorizationError', () => {
    it('should create an AuthorizationError with default message', () => {
      const error = new AuthorizationError();

      expect(error.message).toBe('Insufficient permissions');
      expect(error.code).toBe(ErrorCode.INSUFFICIENT_PERMISSIONS);
      expect(error.statusCode).toBe(403);
    });

    it('should create an AuthorizationError with custom message', () => {
      const error = new AuthorizationError('Admin access required');

      expect(error.message).toBe('Admin access required');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('ValidationError', () => {
    it('should create a ValidationError', () => {
      const error = new ValidationError('Invalid email format');

      expect(error.message).toBe('Invalid email format');
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.statusCode).toBe(400);
    });

    it('should include validation context', () => {
      const context = { field: 'email', value: 'invalid-email' };
      const error = new ValidationError('Invalid email', context);

      expect(error.context).toEqual(context);
    });
  });

  describe('NotFoundError', () => {
    it('should create a NotFoundError with default resource', () => {
      const error = new NotFoundError();

      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe(ErrorCode.RECORD_NOT_FOUND);
      expect(error.statusCode).toBe(404);
    });

    it('should create a NotFoundError with custom resource', () => {
      const error = new NotFoundError('User');

      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('DatabaseError', () => {
    it('should create a DatabaseError with default message', () => {
      const error = new DatabaseError();

      expect(error.message).toBe('Database operation failed');
      expect(error.code).toBe(ErrorCode.DATABASE_ERROR);
      expect(error.statusCode).toBe(500);
    });

    it('should create a DatabaseError with custom message', () => {
      const error = new DatabaseError('Connection timeout');

      expect(error.message).toBe('Connection timeout');
    });
  });

  describe('BusinessError', () => {
    it('should create a BusinessError', () => {
      const error = new BusinessError('Cannot delete active evaluation');

      expect(error.message).toBe('Cannot delete active evaluation');
      expect(error.code).toBe(ErrorCode.BUSINESS_RULE_VIOLATION);
      expect(error.statusCode).toBe(400);
    });
  });

  describe('formatErrorResponse', () => {
    it('should format AppError correctly', () => {
      const error = new AppError('Test error', ErrorCode.VALIDATION_ERROR, 400);
      const response = formatErrorResponse(error);

      expect(response.error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(response.error.message).toBe('Test error');
      expect(response.error.timestamp).toBeDefined();
    });

    it('should format generic Error correctly', () => {
      const error = new Error('Generic error');
      const response = formatErrorResponse(error);

      expect(response.error.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(response.error.message).toBe('Generic error');
    });

    it('should include context for AppError', () => {
      const context = { userId: '123' };
      const error = new AppError('Test', ErrorCode.INTERNAL_ERROR, 500, true, context);
      const response = formatErrorResponse(error);

      expect(response.error.context).toEqual(context);
    });

    it('should include stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      const response = formatErrorResponse(error);

      expect(response.error.stack).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      const response = formatErrorResponse(error);

      expect(response.error.stack).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('handleError', () => {
    it('should handle AppError and return formatted response', () => {
      const error = new AppError('Test error', ErrorCode.VALIDATION_ERROR, 400);
      const response = handleError(error);

      expect(response.error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(response.error.message).toBe('Test error');
    });

    it('should handle generic Error', () => {
      const error = new Error('Unexpected error');
      const response = handleError(error);

      expect(response.error.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(response.error.message).toBe('Unexpected error');
    });

    it('should include additional context', () => {
      const error = new ValidationError('Invalid input');
      const context = { endpoint: '/api/test' };
      const response = handleError(error, context);

      expect(response).toBeDefined();
    });
  });

  describe('isOperationalError', () => {
    it('should return true for operational AppError', () => {
      const error = new AppError('Test', ErrorCode.VALIDATION_ERROR, 400, true);
      expect(isOperationalError(error)).toBe(true);
    });

    it('should return false for non-operational AppError', () => {
      const error = new AppError('Test', ErrorCode.INTERNAL_ERROR, 500, false);
      expect(isOperationalError(error)).toBe(false);
    });

    it('should return false for generic Error', () => {
      const error = new Error('Test');
      expect(isOperationalError(error)).toBe(false);
    });

    it('should return true for ValidationError', () => {
      const error = new ValidationError('Invalid input');
      expect(isOperationalError(error)).toBe(true);
    });

    it('should return true for NotFoundError', () => {
      const error = new NotFoundError('User');
      expect(isOperationalError(error)).toBe(true);
    });
  });
});
