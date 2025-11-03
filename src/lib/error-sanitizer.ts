/**
 * Error sanitization utility for Supabase/PostgREST errors
 * Maps raw database and authentication errors to user-friendly messages
 * while preserving full error details in console logs for debugging
 */

type SupabaseError = {
  message?: string;
  code?: string;
  status?: number;
  statusCode?: number;
  details?: string;
  hint?: string;
};

/**
 * Common Supabase Auth error codes
 * Reference: https://supabase.com/docs/reference/javascript/auth-api-authenticateuser#errors
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Invalid credentials
  'invalid_credentials': 'Invalid email or password. Please check your credentials and try again.',
  'email_not_confirmed': 'Please verify your email address before signing in.',
  'signup_disabled': 'New signups are currently disabled. Please contact support.',
  
  // Rate limiting
  'too_many_requests': 'Too many login attempts. Please try again in a few minutes.',
  
  // Email/magic link errors
  'email_rate_limit_exceeded': 'Too many emails sent. Please wait a few minutes before requesting another.',
  'email_send_failed': 'Failed to send email. Please try again later.',
  
  // OAuth errors
  'oauth_account_not_linked': 'This account is not linked to your profile. Please sign in with the original method.',
  'oauth_provider_error': 'There was an issue signing in with this provider. Please try again.',
  
  // Session errors
  'session_not_found': 'Your session has expired. Please sign in again.',
  'session_expired': 'Your session has expired. Please sign in again.',
  
  // Generic auth errors
  'user_not_found': 'No account found with this email address.',
  'weak_password': 'Password is too weak. Please use a stronger password.',
  'user_already_registered': 'An account with this email already exists.',
};

/**
 * PostgREST error codes
 * Reference: https://postgrest.org/en/stable/api.html#errors-and-http-status-codes
 */
const POSTGREST_ERROR_MESSAGES: Record<string, string> = {
  // Not found
  'PGRST116': 'The requested information could not be found.',
  
  // Unique constraint violation
  '23505': 'This information already exists. Please check your input.',
  
  // Foreign key violation
  '23503': 'This action cannot be completed. Some required information is missing.',
  
  // Check constraint violation
  '23514': 'The information provided is invalid. Please check your input.',
  
  // Not null violation
  '23502': 'Required information is missing. Please fill in all required fields.',
  
  // Permission denied
  '42501': 'You do not have permission to perform this action.',
  
  // Connection/timeout errors
  'PGRST301': 'Request timed out. Please try again.',
  'PGRST204': 'No changes were made.',
};

/**
 * HTTP status code messages
 */
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'You are not authorized to perform this action. Please sign in.',
  403: 'Access denied. You do not have permission for this action.',
  404: 'The requested resource could not be found.',
  409: 'This action conflicts with existing data. Please check and try again.',
  422: 'The information provided is invalid. Please check your input.',
  429: 'Too many requests. Please wait a moment before trying again.',
  500: 'Something went wrong on our end. Please try again later.',
  502: 'Service temporarily unavailable. Please try again in a moment.',
  503: 'Service temporarily unavailable. Please try again later.',
  504: 'Request timed out. Please try again.',
};

/**
 * Sanitizes an error and returns a user-friendly message
 * Also logs the full error details to the console for debugging
 * 
 * @param error - The error object (Supabase error, standard Error, or unknown)
 * @param context - Optional context string for better logging (e.g., "login", "profile fetch")
 * @returns A user-friendly error message string
 */
export function sanitizeError(error: unknown, context?: string): string {
  // Log full error details to console for debugging
  // Always log in development mode or test environment (for debugging)
  // In production builds, this check will be false and errors won't be logged to console
  const shouldLog = import.meta.env.DEV || (typeof process !== 'undefined' && process.env.NODE_ENV === 'test');
  
  if (shouldLog && typeof console !== 'undefined' && console.error) {
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack, ...error }
      : error;
    
    console.error(`[Error Sanitizer${context ? ` - ${context}` : ''}]`, errorDetails);
  }

  // Handle null/undefined
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Check for Supabase error structure
    const supabaseError = error as unknown as SupabaseError;
    
    // Check error code first (most specific)
    if (supabaseError.code) {
      // Auth errors
      if (AUTH_ERROR_MESSAGES[supabaseError.code]) {
        return AUTH_ERROR_MESSAGES[supabaseError.code];
      }
      
      // PostgREST errors
      if (POSTGREST_ERROR_MESSAGES[supabaseError.code]) {
        return POSTGREST_ERROR_MESSAGES[supabaseError.code];
      }
    }
    
    // Check status/statusCode
    const status = supabaseError.status || supabaseError.statusCode;
    if (status && HTTP_STATUS_MESSAGES[status]) {
      return HTTP_STATUS_MESSAGES[status];
    }
    
    // Check message for common patterns (fallback)
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'You are not authorized to perform this action. Please sign in.';
    }
    
    if (message.includes('forbidden') || message.includes('403')) {
      return 'Access denied. You do not have permission for this action.';
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return 'The requested resource could not be found.';
    }
    
    // Generic fallback
    return 'Something went wrong. Please try again.';
  }

  // Handle objects with error-like structure
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as SupabaseError;
    
    // Check error code
    if (errorObj.code) {
      if (AUTH_ERROR_MESSAGES[errorObj.code]) {
        return AUTH_ERROR_MESSAGES[errorObj.code];
      }
      if (POSTGREST_ERROR_MESSAGES[errorObj.code]) {
        return POSTGREST_ERROR_MESSAGES[errorObj.code];
      }
    }
    
    // Check status
    const status = errorObj.status || errorObj.statusCode;
    if (status && HTTP_STATUS_MESSAGES[status]) {
      return HTTP_STATUS_MESSAGES[status];
    }
    
    // Check message
    if (errorObj.message) {
      return sanitizeError(new Error(errorObj.message), context);
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return sanitizeError(new Error(error), context);
  }

  // Ultimate fallback
  return 'Something went wrong. Please try again.';
}

/**
 * Sanitizes a Supabase error object specifically
 * This is a convenience function for Supabase operations
 * 
 * @param error - Supabase error object (from auth or database operations)
 * @param context - Optional context string for logging
 * @returns A user-friendly error message string
 */
export function sanitizeSupabaseError(
  error: { message?: string; code?: string; status?: number; statusCode?: number } | null | undefined,
  context?: string
): string {
  if (!error) {
    return 'Something went wrong. Please try again.';
  }

  return sanitizeError(error as SupabaseError, context);
}
