/**
 * Jest Setup File
 *
 * Configures the testing environment before tests run
 */

import '@testing-library/jest-dom';

// Mock environment variables for tests
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-jest-testing';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'file:./test.db';
process.env.NODE_ENV = 'test';
