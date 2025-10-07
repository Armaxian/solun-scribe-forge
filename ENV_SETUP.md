# Environment Variables Setup

## Required Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# PostHog Configuration (Analytics)
VITE_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Getting Your Keys

### Supabase
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

### PostHog
1. Go to your PostHog project
2. Navigate to Project Settings
3. Copy the Project API Key
4. The host URL is typically `https://us.i.posthog.com` (or `https://eu.i.posthog.com` for EU)

## Notes

- The `.env` file is already in `.gitignore` and will not be committed
- All analytics are configured with privacy-first settings (cookieless mode)
- PostHog will run in development mode when `NODE_ENV=development`

