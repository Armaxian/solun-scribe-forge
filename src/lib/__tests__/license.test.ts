import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateLicense,
  fetchUserEntitlements,
  hasValidLicense,
  getTierDisplayName,
  getTierFeatures,
  type LicenseTier,
} from '../license';
import { supabase } from '../supabase';

// Mock Supabase
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

// Mock global fetch
global.fetch = vi.fn();

// Mock environment variables
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');

describe('license', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validateLicense', () => {
    it('should return error when user is not authenticated', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const result = await validateLicense('TEST-KEY');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });

    it('should successfully validate a license key', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => ({
          valid: true,
          tier: 'professional',
          expiry: '2025-12-31',
        }),
      } as Response);

      const result = await validateLicense('TEST-KEY');
      expect(result.valid).toBe(true);
      expect(result.tier).toBe('professional');
      expect(result.expiry).toBe('2025-12-31');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.supabase.co/functions/v1/validate-license',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockSession.access_token}`,
            'apikey': 'test-anon-key',
          }),
          body: JSON.stringify({ key: 'TEST-KEY' }),
        })
      );
    });

    it('should handle invalid license key response', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      vi.mocked(global.fetch).mockResolvedValue({
        json: async () => ({
          valid: false,
          error: 'Invalid license key',
        }),
      } as Response);

      const result = await validateLicense('INVALID-KEY');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid license key');
    });

    it('should handle fetch errors gracefully', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      const result = await validateLicense('TEST-KEY');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Failed to validate license. Please try again later.');
    });
  });

  describe('fetchUserEntitlements', () => {
    it('should return null when user is not authenticated', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const result = await fetchUserEntitlements();
      expect(result).toBeNull();
    });

    it('should fetch valid user entitlements', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      const mockData = {
        tier: 'professional',
        expires_at: '2025-12-31T00:00:00Z',
        is_valid: true,
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockData,
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase).from = mockFrom as any;

      const result = await fetchUserEntitlements();
      expect(result).toEqual({
        tier: 'professional',
        expiry: '2025-12-31T00:00:00Z',
        isValid: true,
      });
    });

    it('should handle expired entitlements', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      const expiredDate = pastDate.toISOString();

      const mockData = {
        tier: 'professional',
        expires_at: expiredDate,
        is_valid: true,
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockData,
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase).from = mockFrom as any;

      const result = await fetchUserEntitlements();
      expect(result?.isValid).toBe(false);
      expect(result?.tier).toBeNull();
    });

    it('should return null when no entitlements found (PGRST116)', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'No rows found' },
            }),
          }),
        }),
      });

      vi.mocked(supabase).from = mockFrom as any;

      const result = await fetchUserEntitlements();
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: '500', message: 'Database error' },
            }),
          }),
        }),
      });

      vi.mocked(supabase).from = mockFrom as any;

      const result = await fetchUserEntitlements();
      expect(result).toBeNull();
    });
  });

  describe('hasValidLicense', () => {
    it('should return false when no entitlements exist', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const result = await hasValidLicense('basic');
      expect(result).toBe(false);
    });

    it('should return true when user has valid basic tier for basic requirement', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString();

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                tier: 'basic',
                expires_at: futureDateStr,
                is_valid: true,
              },
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase).from = mockFrom as any;

      const result = await hasValidLicense('basic');
      expect(result).toBe(true);
    });

    it('should return true when user has professional tier for basic requirement', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString();

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                tier: 'professional',
                expires_at: futureDateStr,
                is_valid: true,
              },
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase).from = mockFrom as any;

      const result = await hasValidLicense('basic');
      expect(result).toBe(true);
    });

    it('should return false when user has basic tier but needs professional', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString();

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                tier: 'basic',
                expires_at: futureDateStr,
                is_valid: true,
              },
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase).from = mockFrom as any;

      const result = await hasValidLicense('professional');
      expect(result).toBe(false);
    });

    it('should return true when user has team tier for professional requirement', async () => {
      const mockSession = {
        access_token: 'test-token',
        user: { id: 'user-123' },
      };

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString();

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                tier: 'team',
                expires_at: futureDateStr,
                is_valid: true,
              },
              error: null,
            }),
          }),
        }),
      });

      vi.mocked(supabase).from = mockFrom as any;

      const result = await hasValidLicense('professional');
      expect(result).toBe(true);
    });
  });

  describe('getTierDisplayName', () => {
    it('should return correct display names for each tier', () => {
      expect(getTierDisplayName('basic')).toBe('Basic');
      expect(getTierDisplayName('professional')).toBe('Professional');
      expect(getTierDisplayName('team')).toBe('Team');
      expect(getTierDisplayName(null)).toBe('Free');
    });
  });

  describe('getTierFeatures', () => {
    it('should return correct features for basic tier', () => {
      const features = getTierFeatures('basic');
      expect(features).toContain('Basic Writing Tools');
      expect(features).toContain('Local Storage');
      expect(features).toContain('Standard Export');
    });

    it('should return correct features for professional tier', () => {
      const features = getTierFeatures('professional');
      expect(features).toContain('AI Writing Assistant');
      expect(features).toContain('Lore Vault');
      expect(features).toContain('Advanced Export');
      expect(features).toContain('Priority Support');
    });

    it('should return correct features for team tier', () => {
      const features = getTierFeatures('team');
      expect(features).toContain('Everything in Professional');
      expect(features).toContain('Team Collaboration');
      expect(features).toContain('Shared Lore Vault');
      expect(features).toContain('Cloud Sync & Backup');
      expect(features).toContain('Admin Dashboard');
    });

    it('should return empty array for null tier', () => {
      const features = getTierFeatures(null);
      expect(features).toEqual([]);
    });
  });
});

