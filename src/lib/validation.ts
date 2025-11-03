/**
 * Input validation and sanitization helpers
 * 
 * These functions provide centralized validation logic for forms across the application.
 * They return validation results with error messages for inline display.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Email validation regex pattern
 * Validates: local-part@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * License key validation regex pattern
 * Allows: alphanumeric characters and hyphens only
 */
const LICENSE_KEY_REGEX = /^[A-Za-z0-9\-]+$/;

/**
 * Validates an email address format
 * 
 * @param email - The email address to validate
 * @returns ValidationResult with valid flag and optional error message
 * 
 * @example
 * ```ts
 * const result = validateEmail('user@example.com');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      valid: false,
      error: 'Email is required',
    };
  }

  const trimmed = email.trim();
  
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Email is required',
    };
  }

  if (trimmed.length > 254) {
    return {
      valid: false,
      error: 'Email address is too long',
    };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid email address',
    };
  }

  return {
    valid: true,
    sanitized: trimmed.toLowerCase(),
  };
}

/**
 * Sanitizes and validates a license key
 * License keys should contain only alphanumeric characters and hyphens
 * 
 * @param licenseKey - The license key to sanitize and validate
 * @returns ValidationResult with valid flag, sanitized value, and optional error message
 * 
 * @example
 * ```ts
 * const result = sanitizeLicenseKey('SOLUN-PRO-2024-DEMO');
 * if (result.valid) {
 *   console.log('Sanitized key:', result.sanitized);
 * }
 * ```
 */
export function sanitizeLicenseKey(licenseKey: string): ValidationResult {
  if (!licenseKey || typeof licenseKey !== 'string') {
    return {
      valid: false,
      error: 'License key is required',
    };
  }

  const trimmed = licenseKey.trim();
  
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'License key is required',
    };
  }

  // Remove whitespace and convert to uppercase for consistency
  const sanitized = trimmed.replace(/\s+/g, '').toUpperCase();

  if (sanitized.length === 0) {
    return {
      valid: false,
      error: 'License key is required',
    };
  }

  if (!LICENSE_KEY_REGEX.test(sanitized)) {
    return {
      valid: false,
      error: 'License key can only contain letters, numbers, and hyphens',
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Checks if a string is non-empty after trimming
 * 
 * @param value - The value to check
 * @param fieldName - Optional field name for error message customization
 * @returns ValidationResult with valid flag and optional error message
 * 
 * @example
 * ```ts
 * const result = isNonEmpty(username, 'Username');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function isNonEmpty(value: string, fieldName: string = 'Field'): ValidationResult {
  if (value === null || value === undefined) {
    return {
      valid: false,
      error: `${fieldName} is required`,
    };
  }

  if (typeof value !== 'string') {
    return {
      valid: false,
      error: `${fieldName} must be text`,
    };
  }

  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: `${fieldName} is required`,
    };
  }

  return {
    valid: true,
    sanitized: trimmed,
  };
}

