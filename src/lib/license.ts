import { supabase } from './supabase';

export type LicenseTier = 'basic' | 'professional' | 'team' | null;
export type LicenseStatus = 'none' | 'valid' | 'expired' | 'invalid';

export interface LicenseDetails {
  tier: LicenseTier;
  expiry: string | null;
  isValid: boolean;
}

export interface ValidateLicenseResponse {
  valid: boolean;
  tier?: LicenseTier;
  expiry?: string;
  error?: string;
  message?: string;
}

/**
 * Validates a license key via the Supabase Edge Function
 */
export async function validateLicense(key: string): Promise<ValidateLicenseResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { valid: false, error: 'Not authenticated' };
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-license`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      },
      body: JSON.stringify({ key }),
    });

    const result: ValidateLicenseResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error validating license:', error);
    return { valid: false, error: 'Failed to validate license. Please try again later.' };
  }
}

/**
 * Fetches the current user's license entitlements from the database
 */
export async function fetchUserEntitlements(): Promise<LicenseDetails | null> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_entitlements')
      .select('tier, expires_at, is_valid')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No entitlements found
        return null;
      }
      console.error('Error fetching entitlements:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Check if expired
    const isExpired = data.expires_at ? new Date(data.expires_at) < new Date() : false;
    const isValid = data.is_valid && !isExpired;

    return {
      tier: isValid ? (data.tier as LicenseTier) : null,
      expiry: data.expires_at,
      isValid,
    };
  } catch (error) {
    console.error('Error fetching entitlements:', error);
    return null;
  }
}

/**
 * Checks if a user has a valid license for a specific tier
 */
export async function hasValidLicense(minTier: LicenseTier = 'basic'): Promise<boolean> {
  const entitlements = await fetchUserEntitlements();
  
  if (!entitlements || !entitlements.isValid || !entitlements.tier) {
    return false;
  }

  const tierOrder: Record<string, number> = {
    'basic': 1,
    'professional': 2,
    'team': 3,
  };

  const userTierLevel = tierOrder[entitlements.tier] || 0;
  const requiredTierLevel = tierOrder[minTier] || 0;

  return userTierLevel >= requiredTierLevel;
}

/**
 * Gets the display name for a license tier
 */
export function getTierDisplayName(tier: LicenseTier): string {
  switch (tier) {
    case 'basic':
      return 'Basic';
    case 'professional':
      return 'Professional';
    case 'team':
      return 'Team';
    default:
      return 'Free';
  }
}

/**
 * Gets features for a license tier
 */
export function getTierFeatures(tier: LicenseTier): string[] {
  switch (tier) {
    case 'basic':
      return ['Basic Writing Tools', 'Local Storage', 'Standard Export'];
    case 'professional':
      return ['AI Writing Assistant', 'Lore Vault', 'Advanced Export', 'Priority Support'];
    case 'team':
      return [
        'Everything in Professional',
        'Team Collaboration',
        'Shared Lore Vault',
        'Cloud Sync & Backup',
        'Admin Dashboard'
      ];
    default:
      return [];
  }
}

