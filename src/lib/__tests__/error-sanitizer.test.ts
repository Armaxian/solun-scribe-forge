import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sanitizeError, sanitizeSupabaseError } from '../error-sanitizer';

// Mock console.error to avoid noise in tests
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => {
  consoleErrorSpy.mockClear();
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe('sanitizeError', () => {
  describe('Auth error codes', () => {
    it('should sanitize invalid_credentials error', () => {
      const error = { code: 'invalid_credentials', message: 'Invalid login credentials' };
      const result = sanitizeError(error);
      expect(result).toBe('Invalid email or password. Please check your credentials and try again.');
    });

    it('should sanitize email_not_confirmed error', () => {
      const error = { code: 'email_not_confirmed', message: 'Email not confirmed' };
      const result = sanitizeError(error);
      expect(result).toBe('Please verify your email address before signing in.');
    });

    it('should sanitize too_many_requests error', () => {
      const error = { code: 'too_many_requests', message: 'Rate limit exceeded' };
      const result = sanitizeError(error);
      expect(result).toBe('Too many login attempts. Please try again in a few minutes.');
    });

    it('should sanitize email_rate_limit_exceeded error', () => {
      const error = { code: 'email_rate_limit_exceeded', message: 'Too many emails' };
      const result = sanitizeError(error);
      expect(result).toBe('Too many emails sent. Please wait a few minutes before requesting another.');
    });

    it('should sanitize session_expired error', () => {
      const error = { code: 'session_expired', message: 'Session expired' };
      const result = sanitizeError(error);
      expect(result).toBe('Your session has expired. Please sign in again.');
    });
  });

  describe('PostgREST error codes', () => {
    it('should sanitize PGRST116 (not found) error', () => {
      const error = { code: 'PGRST116', message: 'No rows found' };
      const result = sanitizeError(error);
      expect(result).toBe('The requested information could not be found.');
    });

    it('should sanitize 23505 (unique constraint) error', () => {
      const error = { code: '23505', message: 'Duplicate key' };
      const result = sanitizeError(error);
      expect(result).toBe('This information already exists. Please check your input.');
    });

    it('should sanitize 23503 (foreign key violation) error', () => {
      const error = { code: '23503', message: 'Foreign key violation' };
      const result = sanitizeError(error);
      expect(result).toBe('This action cannot be completed. Some required information is missing.');
    });

    it('should sanitize 23502 (not null violation) error', () => {
      const error = { code: '23502', message: 'Not null violation' };
      const result = sanitizeError(error);
      expect(result).toBe('Required information is missing. Please fill in all required fields.');
    });

    it('should sanitize 42501 (permission denied) error', () => {
      const error = { code: '42501', message: 'Permission denied' };
      const result = sanitizeError(error);
      expect(result).toBe('You do not have permission to perform this action.');
    });
  });

  describe('HTTP status codes', () => {
    it('should sanitize 400 Bad Request', () => {
      const error = { status: 400, message: 'Bad request' };
      const result = sanitizeError(error);
      expect(result).toBe('Invalid request. Please check your input and try again.');
    });

    it('should sanitize 401 Unauthorized', () => {
      const error = { status: 401, message: 'Unauthorized' };
      const result = sanitizeError(error);
      expect(result).toBe('You are not authorized to perform this action. Please sign in.');
    });

    it('should sanitize 403 Forbidden', () => {
      const error = { status: 403, message: 'Forbidden' };
      const result = sanitizeError(error);
      expect(result).toBe('Access denied. You do not have permission for this action.');
    });

    it('should sanitize 404 Not Found', () => {
      const error = { status: 404, message: 'Not found' };
      const result = sanitizeError(error);
      expect(result).toBe('The requested resource could not be found.');
    });

    it('should sanitize 409 Conflict', () => {
      const error = { status: 409, message: 'Conflict' };
      const result = sanitizeError(error);
      expect(result).toBe('This action conflicts with existing data. Please check and try again.');
    });

    it('should sanitize 429 Too Many Requests', () => {
      const error = { status: 429, message: 'Too many requests' };
      const result = sanitizeError(error);
      expect(result).toBe('Too many requests. Please wait a moment before trying again.');
    });

    it('should sanitize 500 Internal Server Error', () => {
      const error = { status: 500, message: 'Internal server error' };
      const result = sanitizeError(error);
      expect(result).toBe('Something went wrong on our end. Please try again later.');
    });

    it('should sanitize using statusCode instead of status', () => {
      const error = { statusCode: 401, message: 'Unauthorized' };
      const result = sanitizeError(error);
      expect(result).toBe('You are not authorized to perform this action. Please sign in.');
    });
  });

  describe('Error message pattern matching', () => {
    it('should detect network errors in message', () => {
      const error = new Error('Network request failed');
      const result = sanitizeError(error);
      expect(result).toBe('Network error. Please check your connection and try again.');
    });

    it('should detect timeout errors in message', () => {
      const error = new Error('Request timeout');
      const result = sanitizeError(error);
      expect(result).toBe('Request timed out. Please try again.');
    });

    it('should detect unauthorized errors in message', () => {
      const error = new Error('Unauthorized access');
      const result = sanitizeError(error);
      expect(result).toBe('You are not authorized to perform this action. Please sign in.');
    });

    it('should detect forbidden errors in message', () => {
      const error = new Error('Forbidden: 403');
      const result = sanitizeError(error);
      expect(result).toBe('Access denied. You do not have permission for this action.');
    });

    it('should detect not found errors in message', () => {
      const error = new Error('Resource not found 404');
      const result = sanitizeError(error);
      expect(result).toBe('The requested resource could not be found.');
    });
  });

  describe('Error object types', () => {
    it('should handle standard Error objects', () => {
      const error = new Error('Some error message');
      const result = sanitizeError(error);
      expect(result).toBe('Something went wrong. Please try again.');
    });

    it('should handle plain objects with error structure', () => {
      const error = {
        code: 'invalid_credentials',
        message: 'Invalid credentials',
        status: 401,
      };
      const result = sanitizeError(error);
      expect(result).toBe('Invalid email or password. Please check your credentials and try again.');
    });

    it('should handle string errors', () => {
      const error = 'Some string error';
      const result = sanitizeError(error);
      expect(result).toBe('Something went wrong. Please try again.');
    });

    it('should handle null/undefined', () => {
      expect(sanitizeError(null)).toBe('Something went wrong. Please try again.');
      expect(sanitizeError(undefined)).toBe('Something went wrong. Please try again.');
    });

    it('should handle unknown error types', () => {
      const error = { someProperty: 'value' };
      const result = sanitizeError(error);
      expect(result).toBe('Something went wrong. Please try again.');
    });
  });

  describe('Context logging', () => {
    it('should log errors with context', () => {
      const error = { code: 'invalid_credentials', message: 'Test' };
      sanitizeError(error, 'login');
      
      // Verify console.error was called
      expect(consoleErrorSpy).toHaveBeenCalled();
      const callArgs = consoleErrorSpy.mock.calls[0];
      expect(callArgs[0]).toContain('Error Sanitizer - login');
    });
  });

  describe('Priority handling', () => {
    it('should prioritize error code over status code', () => {
      const error = {
        code: 'invalid_credentials',
        status: 500,
        message: 'Error',
      };
      const result = sanitizeError(error);
      expect(result).toBe('Invalid email or password. Please check your credentials and try again.');
    });

    it('should prioritize status code over message pattern', () => {
      const error = {
        status: 401,
        message: 'Network error',
      };
      const result = sanitizeError(error);
      expect(result).toBe('You are not authorized to perform this action. Please sign in.');
    });
  });
});

describe('sanitizeSupabaseError', () => {
  it('should handle null error', () => {
    const result = sanitizeSupabaseError(null);
    expect(result).toBe('Something went wrong. Please try again.');
  });

  it('should handle undefined error', () => {
    const result = sanitizeSupabaseError(undefined);
    expect(result).toBe('Something went wrong. Please try again.');
  });

  it('should sanitize Supabase error with code', () => {
    const error = { code: 'invalid_credentials', message: 'Invalid' };
    const result = sanitizeSupabaseError(error);
    expect(result).toBe('Invalid email or password. Please check your credentials and try again.');
  });

  it('should sanitize Supabase error with status', () => {
    const error = { status: 401, message: 'Unauthorized' };
    const result = sanitizeSupabaseError(error);
    expect(result).toBe('You are not authorized to perform this action. Please sign in.');
  });

  it('should handle Supabase error with context', () => {
    const error = { code: 'session_expired', message: 'Expired' };
    sanitizeSupabaseError(error, 'auth');
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    const callArgs = consoleErrorSpy.mock.calls[0];
    expect(callArgs[0]).toContain('Error Sanitizer - auth');
  });
});
