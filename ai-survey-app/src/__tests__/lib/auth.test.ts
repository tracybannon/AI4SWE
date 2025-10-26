/**
 * Unit Tests for Authentication Utilities
 *
 * Tests password hashing and verification functions
 */

import { hashPassword, verifyPassword } from '@/lib/auth/utils';

describe('Authentication Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
      expect(hash).toMatch(/^\$2[aby]\$/); // bcrypt hash format
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // Different salts
    });

    it('should handle empty strings', async () => {
      const hash = await hashPassword('');
      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should handle long passwords', async () => {
      const longPassword = 'a'.repeat(100);
      const hash = await hashPassword(longPassword);

      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should handle special characters', async () => {
      const password = 'P@ssw0rd!#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123';
      const wrongPassword = 'WrongPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('testpassword123', hash);

      expect(isValid).toBe(false);
    });

    it('should reject password with extra characters', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('TestPassword123 ', hash);

      expect(isValid).toBe(false);
    });

    it('should handle empty password verification', async () => {
      const password = '';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('', hash);

      expect(isValid).toBe(true);
    });

    it('should reject empty password against non-empty hash', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('', hash);

      expect(isValid).toBe(false);
    });
  });

  describe('Password hashing security', () => {
    it('should use bcrypt with sufficient rounds', async () => {
      const password = 'TestPassword123';
      const startTime = Date.now();
      await hashPassword(password);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Bcrypt with 12 rounds should take at least some time (>10ms typically)
      // This is a rough check to ensure it's not using a weak hash
      expect(duration).toBeGreaterThan(10);
    });

    it('should produce hashes of consistent length', async () => {
      const passwords = ['short', 'mediumpassword', 'verylongpasswordwithmanychars'];
      const hashes = await Promise.all(passwords.map(p => hashPassword(p)));

      const lengths = hashes.map(h => h.length);
      const firstLength = lengths[0];

      // All bcrypt hashes should be the same length (60 characters)
      expect(lengths.every(l => l === firstLength)).toBe(true);
      expect(firstLength).toBe(60);
    });
  });
});
