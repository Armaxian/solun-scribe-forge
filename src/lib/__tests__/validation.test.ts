import { describe, it, expect } from 'vitest';
import { validateEmail, sanitizeLicenseKey, isNonEmpty } from '../validation';

describe('validateEmail', () => {
  describe('Valid email addresses', () => {
    it('should validate a standard email address', () => {
      const result = validateEmail('user@example.com');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('user@example.com');
      expect(result.error).toBeUndefined();
    });

    it('should validate email with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('user@mail.example.com');
    });

    it('should validate email with plus sign', () => {
      const result = validateEmail('user+tag@example.com');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('user+tag@example.com');
    });

    it('should validate email with dots', () => {
      const result = validateEmail('first.last@example.com');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('first.last@example.com');
    });

    it('should normalize email to lowercase', () => {
      const result = validateEmail('USER@EXAMPLE.COM');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('user@example.com');
    });

    it('should trim whitespace from email', () => {
      const result = validateEmail('  user@example.com  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('user@example.com');
    });

    it('should trim and lowercase email', () => {
      const result = validateEmail('  USER@EXAMPLE.COM  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('user@example.com');
    });
  });

  describe('Invalid email addresses', () => {
    it('should reject empty string', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
      expect(result.sanitized).toBeUndefined();
    });

    it('should reject whitespace-only string', () => {
      const result = validateEmail('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject email without @ symbol', () => {
      const result = validateEmail('userexample.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email without domain', () => {
      const result = validateEmail('user@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email without local part', () => {
      const result = validateEmail('@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email without TLD', () => {
      const result = validateEmail('user@example');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email with spaces', () => {
      const result = validateEmail('user name@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email with multiple @ symbols', () => {
      const result = validateEmail('user@example@com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email longer than 254 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(longEmail.length).toBeGreaterThan(254);
      const result = validateEmail(longEmail);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email address is too long');
    });
  });

  describe('Edge cases', () => {
    it('should handle null input', () => {
      const result = validateEmail(null as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should handle undefined input', () => {
      const result = validateEmail(undefined as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should handle non-string input', () => {
      const result = validateEmail(123 as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });
  });
});

describe('sanitizeLicenseKey', () => {
  describe('Valid license keys', () => {
    it('should validate a standard license key', () => {
      const result = sanitizeLicenseKey('SOLUN-PRO-2024-DEMO');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('SOLUN-PRO-2024-DEMO');
      expect(result.error).toBeUndefined();
    });

    it('should validate license key with numbers only', () => {
      const result = sanitizeLicenseKey('12345-67890');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('12345-67890');
    });

    it('should validate license key with letters only', () => {
      const result = sanitizeLicenseKey('ABCD-EFGH');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('ABCD-EFGH');
    });

    it('should normalize to uppercase', () => {
      const result = sanitizeLicenseKey('solun-pro-2024-demo');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('SOLUN-PRO-2024-DEMO');
    });

    it('should remove whitespace', () => {
      const result = sanitizeLicenseKey('SOLUN - PRO - 2024 - DEMO');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('SOLUN-PRO-2024-DEMO');
    });

    it('should trim and normalize', () => {
      const result = sanitizeLicenseKey('  solun-pro-2024-demo  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('SOLUN-PRO-2024-DEMO');
    });

    it('should handle license key without hyphens', () => {
      const result = sanitizeLicenseKey('SOLUNPRO2024DEMO');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('SOLUNPRO2024DEMO');
    });

    it('should handle license key with multiple consecutive hyphens', () => {
      const result = sanitizeLicenseKey('SOLUN--PRO--2024');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('SOLUN--PRO--2024');
    });
  });

  describe('Invalid license keys', () => {
    it('should reject empty string', () => {
      const result = sanitizeLicenseKey('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key is required');
      expect(result.sanitized).toBeUndefined();
    });

    it('should reject whitespace-only string', () => {
      const result = sanitizeLicenseKey('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key is required');
    });

    it('should reject license key with special characters', () => {
      const result = sanitizeLicenseKey('SOLUN-PRO-2024@DEMO');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key can only contain letters, numbers, and hyphens');
    });

    it('should reject license key with spaces after sanitization', () => {
      const result = sanitizeLicenseKey('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key is required');
    });

    it('should reject license key with underscores', () => {
      const result = sanitizeLicenseKey('SOLUN_PRO_2024');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key can only contain letters, numbers, and hyphens');
    });

    it('should reject license key with dots', () => {
      const result = sanitizeLicenseKey('SOLUN.PRO.2024');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key can only contain letters, numbers, and hyphens');
    });

    it('should reject license key with parentheses', () => {
      const result = sanitizeLicenseKey('SOLUN(PRO)2024');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key can only contain letters, numbers, and hyphens');
    });
  });

  describe('Edge cases', () => {
    it('should handle null input', () => {
      const result = sanitizeLicenseKey(null as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key is required');
    });

    it('should handle undefined input', () => {
      const result = sanitizeLicenseKey(undefined as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key is required');
    });

    it('should handle non-string input', () => {
      const result = sanitizeLicenseKey(12345 as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('License key is required');
    });
  });
});

describe('isNonEmpty', () => {
  describe('Valid non-empty strings', () => {
    it('should validate a simple string', () => {
      const result = isNonEmpty('hello');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('hello');
      expect(result.error).toBeUndefined();
    });

    it('should validate a string with spaces', () => {
      const result = isNonEmpty('hello world');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('hello world');
    });

    it('should trim whitespace and validate', () => {
      const result = isNonEmpty('  hello  ');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('hello');
    });

    it('should validate with custom field name', () => {
      const result = isNonEmpty('value', 'Username');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('value');
    });

    it('should validate numbers as string', () => {
      const result = isNonEmpty('123');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('123');
    });
  });

  describe('Invalid empty strings', () => {
    it('should reject empty string', () => {
      const result = isNonEmpty('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Field is required');
      expect(result.sanitized).toBeUndefined();
    });

    it('should reject whitespace-only string', () => {
      const result = isNonEmpty('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should reject with custom field name', () => {
      const result = isNonEmpty('', 'Password');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should reject whitespace with custom field name', () => {
      const result = isNonEmpty('   ', 'Username');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username is required');
    });
  });

  describe('Edge cases', () => {
    it('should handle null input', () => {
      const result = isNonEmpty(null as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should handle undefined input', () => {
      const result = isNonEmpty(undefined as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should handle non-string input', () => {
      const result = isNonEmpty(123 as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Field must be text');
    });

    it('should handle non-string input with custom field name', () => {
      const result = isNonEmpty(123 as unknown as string, 'Email');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email must be text');
    });
  });

  describe('Field name customization', () => {
    it('should use default field name', () => {
      const result = isNonEmpty('');
      expect(result.error).toBe('Field is required');
    });

    it('should use custom field name in error', () => {
      const result = isNonEmpty('', 'Email Address');
      expect(result.error).toBe('Email Address is required');
    });

    it('should use custom field name for type error', () => {
      const result = isNonEmpty(123 as unknown as string, 'Password');
      expect(result.error).toBe('Password must be text');
    });
  });
});

