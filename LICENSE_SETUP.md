# License Validation Setup Guide

This document explains how to set up the backend license validation system.

## Overview

The license validation system uses:
1. **Database tables** (`licenses` and `user_entitlements`) with Row Level Security (RLS)
2. **Supabase Edge Function** (`validate-license`) for secure server-side validation
3. **Frontend utilities** for checking license status and gating premium features

## Database Setup

### Step 1: Run the Migration

Apply the migration file to create the necessary tables:

```bash
# Using Supabase CLI (recommended)
supabase migration up

# Or apply manually via Supabase Dashboard:
# 1. Go to SQL Editor in your Supabase dashboard
# 2. Copy contents of supabase/migrations/20240101000000_create_licenses_tables.sql
# 3. Run the SQL
```

### Step 2: Verify Tables Created

After running the migration, verify these tables exist:
- `licenses` - Stores license keys and metadata
- `user_entitlements` - Stores validated license status for users

### Step 3: Add Sample Licenses (Optional)

The migration includes sample demo licenses. For production:

1. **Generate secure license keys** (not demo keys)
2. **Insert licenses** using the Supabase dashboard or via SQL:

```sql
INSERT INTO licenses (key, status, tier, expiry, notes) VALUES
  ('YOUR-SECURE-KEY-HERE', 'active', 'professional', '2025-12-31 23:59:59+00', 'Customer license');
```

**Important:** Remove or modify demo keys before production deployment.

## Edge Function Setup

### Step 1: Deploy the Edge Function

Using Supabase CLI:

```bash
supabase functions deploy validate-license
```

Or via Supabase Dashboard:
1. Go to Edge Functions
2. Create new function named `validate-license`
3. Copy the contents of `supabase/functions/validate-license/index.ts`
4. Deploy

### Step 2: Set Environment Variables

Ensure these environment variables are set in your Supabase project:
- `SUPABASE_URL` - Your Supabase project URL (automatically set)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for elevated permissions (automatically set)

The Edge Function uses the service role key to bypass RLS and securely access the licenses table.

### Step 3: Verify Function is Accessible

Test the function endpoint (should be accessible at):
```
https://<your-project-ref>.supabase.co/functions/v1/validate-license
```

## Frontend Configuration

No additional configuration needed. The frontend automatically:
- Calls the Edge Function for license validation
- Fetches user entitlements from the database
- Caches license status in the user's session

## Security Features

### Row Level Security (RLS)

- **licenses table**: Completely locked down - no direct client access
- **user_entitlements table**: Users can only read their own entitlements, cannot modify

### Edge Function Security

- Requires valid JWT authentication
- Validates user identity before processing
- Uses service role key for secure database access
- Prevents license key enumeration attacks

### License Key Protection

- License keys are never exposed in client code
- Validation happens entirely on the server
- Invalid/expired keys are rejected immediately
- Demo keys can be blocked in production (see Edge Function code)

## Usage Examples

### Checking License Status

```typescript
import { useLicense } from '@/hooks/use-license';

function MyComponent() {
  const { entitlements, isValid, tier, loading } = useLicense();

  if (loading) return <div>Loading...</div>;

  if (!isValid) {
    return <div>Premium features require a valid license</div>;
  }

  return <div>Your tier: {tier}</div>;
}
```

### Gating Premium Features

```typescript
import { hasValidLicense } from '@/lib/license';

async function handlePremiumAction() {
  const hasAccess = await hasValidLicense('professional');
  
  if (!hasAccess) {
    toast.error('Professional license required');
    return;
  }

  // Proceed with premium feature
}
```

### Validating a License Key

```typescript
import { validateLicense } from '@/lib/license';

const result = await validateLicense('SOLUN-PRO-2024-DEMO');

if (result.valid) {
  console.log('License tier:', result.tier);
  console.log('Expires:', result.expiry);
} else {
  console.error('Validation failed:', result.error);
}
```

## Testing

### Test with Invalid Key

1. Go to Account page
2. Enter an invalid license key (e.g., `INVALID-KEY-123`)
3. Click "Redeem"
4. Should show "Invalid license key" error

### Test with Valid Key

1. Go to Account page
2. Enter a valid demo key (e.g., `SOLUN-PRO-2024-DEMO`)
3. Click "Redeem"
4. Should show success message and display license details
5. Refresh the page - license status should persist

### Test with Expired Key

1. Manually expire a license in the database:
```sql
UPDATE licenses 
SET expiry = '2020-01-01 00:00:00+00' 
WHERE key = 'SOLUN-BASIC-2024';
```

2. Try to redeem the key
3. Should show "License key has expired" error

## Troubleshooting

### "Missing authorization header" Error

- Ensure user is logged in
- Check that JWT token is being sent in request

### "Invalid or expired token" Error

- User session may have expired
- Ask user to sign out and sign back in

### License Status Not Persisting

- Check RLS policies are correct
- Verify `user_entitlements` table exists and is accessible
- Check browser console for errors

### Edge Function Not Found

- Verify function is deployed
- Check function name matches exactly: `validate-license`
- Ensure Supabase URL is correct in environment variables

## Production Checklist

- [ ] Remove demo license keys from database
- [ ] Generate secure, unique license keys
- [ ] Enable demo key blocking in Edge Function (if desired)
- [ ] Test license validation with production keys
- [ ] Verify RLS policies are correctly applied
- [ ] Monitor Edge Function logs for errors
- [ ] Set up alerts for failed validations

## API Reference

### Edge Function: validate-license

**Endpoint:** `POST /functions/v1/validate-license`

**Headers:**
```
Authorization: Bearer <user-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "key": "SOLUN-PRO-2024-DEMO"
}
```

**Success Response (200):**
```json
{
  "valid": true,
  "tier": "professional",
  "expiry": "2025-12-31T23:59:59Z",
  "message": "License validated and activated successfully"
}
```

**Error Response (200):**
```json
{
  "valid": false,
  "error": "Invalid license key"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid or expired token"
}
```

