import { supabase } from './supabase';
import { validateEmail as validateEmailFormat } from './validation';

export type NewsletterSource = 'footer' | 'blog';

export interface NewsletterSubscriptionResult {
  success: boolean;
  message: string;
  already_subscribed?: boolean;
  error?: string;
}

/**
 * Validates email format
 * @deprecated Use validateEmail from '@/lib/validation' instead
 * This function is kept for backward compatibility
 */
export function validateEmail(email: string): boolean {
  const result = validateEmailFormat(email);
  return result.valid;
}

/**
 * Subscribes an email to the newsletter via Supabase Edge Function
 */
export async function subscribeToNewsletter(
  email: string,
  source: NewsletterSource = 'footer'
): Promise<NewsletterSubscriptionResult> {
  // Validate email using centralized validation
  const emailValidation = validateEmailFormat(email);
  if (!emailValidation.valid) {
    return {
      success: false,
      message: emailValidation.error || 'Please enter a valid email address',
      error: emailValidation.error || 'Invalid email format',
    };
  }

  // Use sanitized email from validation
  const trimmedEmail = emailValidation.sanitized || email.trim().toLowerCase();

  // Validate source
  if (source !== 'footer' && source !== 'blog') {
    source = 'footer';
  }

  try {
    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
      body: { email: trimmedEmail, source },
    });

    if (error) {
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.',
        error: error.message || 'Unknown error',
      };
    }

    // Handle response from Edge Function
    if (data?.success) {
      return {
        success: true,
        message: data.message || 'Successfully subscribed to newsletter!',
        already_subscribed: data.already_subscribed || false,
      };
    }

    if (data?.error) {
      return {
        success: false,
        message: data.error || 'Failed to subscribe',
        error: data.error,
      };
    }

    // Fallback success response
    return {
      success: true,
      message: 'Successfully subscribed to newsletter!',
    };
  } catch (error) {
    console.error('Newsletter subscription exception:', error);
    return {
      success: false,
      message: 'Failed to subscribe. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

