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

# Release Configuration (Downloads)
# URLs and SHA256 hashes for platform downloads
# Leave blank if platform is not available yet
VITE_RELEASE_WINDOWS_URL=https://github.com/Armaxian/Solun/releases/latest/download/win-unpacked.zip
VITE_RELEASE_WINDOWS_SHA256=410bea8874a627e57251b28d97ca97e84d9d165aaf4e200b6d74f1385b490f51
VITE_RELEASE_WINDOWS_SIZE=~192 MB

# macOS Intel
VITE_RELEASE_MAC_INTEL_URL=
VITE_RELEASE_MAC_INTEL_SHA256=
VITE_RELEASE_MAC_INTEL_SIZE=~80 MB

# macOS Apple Silicon
VITE_RELEASE_MAC_ARM_URL=
VITE_RELEASE_MAC_ARM_SHA256=
VITE_RELEASE_MAC_ARM_SIZE=~78 MB

# Linux (AppImage)
VITE_RELEASE_LINUX_URL=
VITE_RELEASE_LINUX_SHA256=
VITE_RELEASE_LINUX_SIZE=~90 MB

# Linux (.deb - optional)
VITE_RELEASE_LINUX_DEB_URL=
VITE_RELEASE_LINUX_DEB_SHA256=
VITE_RELEASE_LINUX_DEB_SIZE=~75 MB
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

## Release Configuration

The download page supports two methods for release configuration:

1. **Environment Variables** (recommended for CI/CD):
   - Set the `VITE_RELEASE_*` variables in your `.env` file
   - Values are loaded at build time
   - Platforms without URLs will show "Coming soon"

2. **JSON File** (for manual updates):
   - Place a `releases.json` file in the `public/` directory
   - This file takes precedence over environment variables
   - See `public/releases.json.example` for the format
   - Allows updates without redeployment

### Future CI Automation

The release system is designed to support automated CI/CD workflows:

- **TODO**: Add GitHub Actions workflow to:
  1. Calculate SHA256 after build
  2. Upload artifacts to GitHub Releases/S3
  3. Update `releases.json` or environment variables
  4. Trigger deployment

## Notes

- The `.env` file is already in `.gitignore` and will not be committed
- All analytics are configured with privacy-first settings (cookieless mode)
- PostHog will run in development mode when `NODE_ENV=development`
- Release URLs are optional - platforms without URLs show "Coming soon" automatically

