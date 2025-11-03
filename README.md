# Solun Website

The official website for Solun, a premium AI writing workspace. Built with React, TypeScript, Vite, and Supabase.

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Supabase Setup](#supabase-setup)
- [PostHog Configuration](#posthog-configuration)
- [Adding Downloads](#adding-downloads)
- [License Flow](#license-flow)
- [Security](#security)
- [Testing](#testing)
- [Project Structure](#project-structure)

## Quick Start

### Prerequisites

- **Node.js** 18+ (install via [nvm](https://github.com/nvm-sh/nvm))
- **bun** (recommended) or npm for package management
- **Git** for version control

### Initial Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd solun-scribe-forge

# Install dependencies
bun install  # or npm install

# Copy environment template
cp .env.example .env  # (if exists, otherwise see Environment Setup)

# Start development server
bun run dev  # or npm run dev
```

The development server will start at `http://localhost:5173` with hot module reloading.

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory. **Never commit this file** (it's in `.gitignore`).

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# PostHog Configuration (Analytics)
VITE_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Release Configuration (Downloads)
# URLs and SHA256 hashes for platform downloads
# Leave blank if platform is not available yet
VITE_RELEASE_WINDOWS_URL=https://github.com/Armaxian/Solun/releases/latest/download/win-unpacked.zip
VITE_RELEASE_WINDOWS_SHA256=your_sha256_hash_here
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

### Getting Your Keys

#### Supabase
1. Go to your [Supabase project dashboard](https://app.supabase.com)
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon/public key**

#### PostHog
1. Go to your [PostHog project](https://app.posthog.com)
2. Navigate to **Project Settings**
3. Copy the **Project API Key**
4. Use host URL: `https://us.i.posthog.com` (or `https://eu.i.posthog.com` for EU)

See [ENV_SETUP.md](./ENV_SETUP.md) for more detailed configuration instructions.

## Development

### Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS + shadcn/ui
- **Routing:** React Router v6
- **State Management:** TanStack Query (React Query)
- **Authentication:** Supabase Auth
- **Analytics:** PostHog (privacy-first, cookieless)
- **3D Graphics:** Three.js + React Three Fiber

### Development Workflow

```bash
# Start dev server with hot reload
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Run linter
bun run lint

# Run tests
bun run test

# Run tests in watch mode
bun run test:watch
```

### Code Structure

- `src/routes/` - Route components (pages)
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and libraries
- `src/hooks/` - Custom React hooks
- `src/styles/` - Global styles and theme
- `supabase/` - Database migrations and Edge Functions
- `public/` - Static assets

## Scripts

### Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start Vite development server with HMR |
| `build` | Build production bundle (outputs to `dist/`) |
| `build:dev` | Build with development mode flags |
| `preview` | Preview production build locally |
| `lint` | Run ESLint on all TypeScript/React files |
| `test` | Run Vitest tests once |
| `test:watch` | Run Vitest in watch mode |
| `generate-assets` | Generate placeholder OG images and PWA icons |
| `postbuild` | Post-build hook that generates sitemap |

### Build Process

The production build:
1. Compiles TypeScript and React code
2. Optimizes assets (minification, tree-shaking)
3. Generates sitemap automatically (`postbuild` hook)
4. Outputs to `dist/` directory

### Generating Assets

The `generate-assets` script creates placeholder SVGs for:
- OG images (1200x630px) - should be converted to PNG
- PWA icons (192x192, 512x512px) - should be converted to PNG
- Blog post images (800x450px) - should be converted to optimized JPG

```bash
bun run generate-assets
```

**Note:** These are SVG placeholders. Replace them with proper branded assets before production.

## Deployment

### Netlify Deployment

This project is configured for deployment on Netlify via `netlify.toml`.

#### Build Configuration

The build process:
- Uses **bun** (configured in `netlify.toml`)
- Runs `bun run build` to create production bundle
- Publishes `dist/` directory
- Applies security headers (CSP, HSTS, etc.)
- Configures SPA routing (redirects all routes to `index.html`)

#### Environment Variables on Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add all required variables from [Environment Setup](#environment-setup)
4. **Important:** Update CSP in `netlify.toml` if your Supabase project URL changes

#### Custom Domain

To connect a custom domain:
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration instructions
4. SSL certificates are provisioned automatically

#### Deployment Checklist

- [ ] All environment variables configured in Netlify
- [ ] CSP headers updated with correct Supabase URL
- [ ] Build command set to `bun run build` (or `npm run build`)
- [ ] Publish directory set to `dist`
- [ ] Custom domain configured (if applicable)
- [ ] Test production build locally with `bun run preview`

### Alternative Deployment

The site can be deployed to any static hosting service:
- **Vercel:** Connect GitHub repo, add env vars
- **GitHub Pages:** Use GitHub Actions with build workflow
- **AWS S3 + CloudFront:** Upload `dist/` to S3, configure CloudFront
- **Any static host:** Serve `dist/` directory with SPA routing support

## Supabase Setup

### Database Migrations

The project includes Supabase migrations in `supabase/migrations/`:

1. **`20240101000000_create_licenses_tables.sql`** - Creates `licenses` and `user_entitlements` tables with RLS policies
2. **`20240102000000_create_newsletter_subscribers.sql`** - Creates newsletter subscribers table

#### Applying Migrations

**Using Supabase CLI (recommended):**
```bash
supabase migration up
```

**Using Supabase Dashboard:**
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy contents of migration file
3. Run the SQL

### Database Tables

#### Required Tables

- `profiles` - User profile data (created manually or via trigger)
- `licenses` - License keys and metadata
- `user_entitlements` - Validated license status per user
- `newsletter_subscribers` - Newsletter subscription management

#### Row Level Security (RLS)

All tables use RLS policies:
- **licenses:** Completely locked down (no client access)
- **user_entitlements:** Users can only read their own records
- **profiles:** Users can view/update their own profile
- **newsletter_subscribers:** Public insert (with rate limiting)

### Edge Functions

#### validate-license

Server-side license validation function.

**Deployment:**
```bash
supabase functions deploy validate-license
```

**Location:** `supabase/functions/validate-license/index.ts`

**Environment Variables:**
- Automatically has access to `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- No manual configuration needed

**Testing:**
- Requires authenticated user (JWT token)
- Endpoint: `https://<project-ref>.supabase.co/functions/v1/validate-license`

#### subscribe-newsletter

Newsletter subscription handler.

**Deployment:**
```bash
supabase functions deploy subscribe-newsletter
```

**Location:** `supabase/functions/subscribe-newsletter/index.ts`

### Authentication Setup

Supabase Auth is configured to support:
- Email/password authentication
- Magic link (passwordless)
- OAuth providers (Google, Apple - if configured)

**OAuth Configuration:**
1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable desired providers
3. Configure redirect URLs: `https://yourdomain.com/account`

## PostHog Configuration

### Setup

PostHog is used for privacy-first analytics (cookieless mode, respects Do Not Track).

**Configuration:**
- Automatically initialized in `src/main.tsx`
- Respects `DNT` header
- Runs in development mode (logs to console)
- Gracefully handles ad blockers

**Environment Variables:**
```env
VITE_PUBLIC_POSTHOG_KEY=your_project_api_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Features

- **Privacy-first:** No cookies, memory-only persistence
- **Session recording:** Disabled
- **Automatic pageviews:** Disabled (manual tracking via `Analytics` class)
- **Error handling:** Gracefully fails if blocked by ad blockers

### Usage in Code

```typescript
import { Analytics } from '@/lib/analytics';

// Track custom event
Analytics.getInstance().track({
  name: 'button_clicked',
  properties: { button: 'download' }
});

// Track page view
Analytics.getInstance().pageView('/download');
```

## Adding Downloads

The download page supports two methods for configuring releases:

### Method 1: Environment Variables (Recommended for CI/CD)

Set release URLs and SHA256 hashes as environment variables:

```env
VITE_RELEASE_WINDOWS_URL=https://github.com/org/repo/releases/latest/download/windows.zip
VITE_RELEASE_WINDOWS_SHA256=abc123def456...
VITE_RELEASE_WINDOWS_SIZE=~192 MB
```

**Supported platforms:**
- `VITE_RELEASE_WINDOWS_*` - Windows downloads
- `VITE_RELEASE_MAC_INTEL_*` - macOS Intel
- `VITE_RELEASE_MAC_ARM_*` - macOS Apple Silicon
- `VITE_RELEASE_LINUX_*` - Linux AppImage
- `VITE_RELEASE_LINUX_DEB_*` - Linux .deb (optional)

**Getting SHA256 Hash:**
```bash
# macOS/Linux
shasum -a 256 your-file.zip

# Windows (PowerShell)
Get-FileHash your-file.zip -Algorithm SHA256
```

### Method 2: JSON File (Manual Updates)

Place a `releases.json` file in `public/` directory:

```json
{
  "windows": [
    {
      "downloadUrl": "https://github.com/org/repo/releases/latest/download/windows.zip",
      "sha256": "abc123def456...",
      "size": "~192 MB",
      "recommended": true,
      "signature": "Code signed by Company Name",
      "description": "Standard installer with auto-updater"
    }
  ],
  "mac-intel": [],
  "mac-arm": [],
  "linux": []
}
```

**Important:** JSON file takes precedence over environment variables if both exist.

See `public/releases.json.example` for full format reference.

### Adding a New Release

1. **Build your application** for the target platform
2. **Upload** the build artifact to your release storage (GitHub Releases, S3, etc.)
3. **Calculate SHA256 hash** of the file
4. **Update** either:
   - Environment variables in `.env` (for local) or Netlify (for production)
   - `public/releases.json` file (for manual updates without redeployment)
5. **Verify** the download appears on `/download` page

### Future CI Automation

The release system is designed to support automated workflows:
- Calculate SHA256 after build
- Upload artifacts to release storage
- Update `releases.json` or environment variables via API
- Trigger deployment after successful upload

## License Flow

The license system provides server-side validation with secure client integration.

### Overview

1. **User enters license key** on Account page
2. **Frontend calls Edge Function** (`validate-license`) with key
3. **Edge Function validates** key against `licenses` table
4. **If valid:** Creates/updates `user_entitlements` record
5. **Frontend caches** license status in React Query
6. **Premium features** check license via `useLicense()` hook

### Components

- **`licenses` table:** Stores license keys, status, tier, expiry
- **`user_entitlements` table:** Stores validated license status per user
- **Edge Function:** `validate-license` - server-side validation
- **Frontend hooks:** `useLicense()` - license status management
- **License gate:** `<LicenseGate>` component for feature gating

### License Tiers

- `basic` - Basic features
- `professional` - Professional features
- `team` - Team collaboration features

### Usage

```typescript
import { useLicense } from '@/hooks/use-license';

function PremiumFeature() {
  const { isValid, tier, loading } = useLicense();

  if (loading) return <div>Loading...</div>;
  if (!isValid) return <LicenseGate requiredTier="professional" />;

  return <div>Premium content</div>;
}
```

### Adding License Keys

1. Go to Supabase dashboard → **Table Editor** → `licenses`
2. Click **Insert row**
3. Fill in:
   - `key`: License key (e.g., `SOLUN-PRO-2024-XXXXX`)
   - `status`: `active` | `expired` | `revoked` | `pending`
   - `tier`: `basic` | `professional` | `team`
   - `expiry`: ISO timestamp (e.g., `2025-12-31T23:59:59Z`)
   - `notes`: Optional notes about the license

**Security:** License keys are never exposed to clients. Validation happens entirely on the server.

See [LICENSE_SETUP.md](./LICENSE_SETUP.md) for detailed setup instructions.

## Security

### Security Headers

The project includes comprehensive security headers (configured in `netlify.toml`):

- **Content Security Policy (CSP):** Restricts resource loading to trusted origins
- **HTTP Strict Transport Security (HSTS):** Forces HTTPS connections
- **X-Frame-Options:** Prevents clickjacking
- **X-Content-Type-Options:** Prevents MIME sniffing
- **Referrer-Policy:** Controls referrer information

### Row Level Security (RLS)

All database tables use RLS policies:
- Users can only access their own data
- License keys are completely locked down
- Edge Functions use service role key for secure access

### Environment Variables

- **Never commit** `.env` files
- Use Netlify environment variables for production
- Rotate keys regularly
- Use different keys for staging/production

### Authentication

- JWT tokens managed by Supabase
- Tokens expire after configured duration
- OAuth providers require proper redirect URL configuration

### License Key Protection

- License keys never exposed in client code
- Validation happens entirely on server
- Invalid keys rejected immediately
- Rate limiting should be added for production

### Best Practices

1. **Keep dependencies updated:** Run `bun outdated` regularly
2. **Review security advisories:** Check npm/bun audit
3. **Test RLS policies:** Verify users can't access other users' data
4. **Monitor Edge Function logs:** Watch for suspicious activity
5. **Use HTTPS everywhere:** Never serve over HTTP in production

## Testing

### Test Framework

- **Vitest** - Fast Vite-native test runner
- **jsdom** - DOM environment for component tests
- **React Testing Library** - (can be added for component tests)

### Running Tests

```bash
# Run all tests once
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with UI
bun test --ui
```

### Test Structure

Tests are located alongside source files:
- `src/lib/__tests__/` - Utility function tests
- Tests use `.test.ts` or `.spec.ts` naming

### Coverage

Coverage thresholds (configured in `vitest.config.ts`):
- Lines: 60%
- Functions: 60%
- Branches: 60%
- Statements: 60%

View coverage report:
```bash
bun test --coverage
```

### Test Setup

Test configuration in `vitest.config.ts`:
- Uses `jsdom` environment for DOM APIs
- Includes setup file: `vitest.setup.ts`
- Aliases `@/` to `src/`

### Writing Tests

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '../utils';

describe('functionToTest', () => {
  it('should handle valid input', () => {
    expect(functionToTest('input')).toBe('expected');
  });
});
```

### Current Test Coverage

The project includes tests for:
- Error sanitization (`error-sanitizer.test.ts`)
- License utilities (`license.test.ts`)
- Profile management (`profile.test.ts`)
- Validation helpers (`validation.test.ts`)

### Future Testing

Consider adding:
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress
- Visual regression tests
- Accessibility tests

## Project Structure

```
solun-scribe-forge/
├── public/                 # Static assets
│   ├── blog/              # Blog post images
│   ├── releases.json      # Release config (optional)
│   └── ...
├── scripts/               # Build scripts
│   ├── generate-assets.ts
│   └── generate-sitemap.ts
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── lib/               # Utility functions
│   │   └── __tests__/    # Unit tests
│   ├── routes/            # Page components
│   └── styles/           # Global styles
├── supabase/
│   ├── functions/         # Edge Functions
│   │   ├── validate-license/
│   │   └── subscribe-newsletter/
│   └── migrations/        # Database migrations
├── .env                   # Environment variables (gitignored)
├── netlify.toml          # Netlify deployment config
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

## Additional Resources

- [Environment Setup Guide](./ENV_SETUP.md) - Detailed env var configuration
- [License Setup Guide](./LICENSE_SETUP.md) - License system setup
- [Technical Audit Report](./TECHNICAL_AUDIT_REPORT.md) - Architecture overview

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `bun run test`
5. Run linter: `bun run lint`
6. Commit changes: `git commit -m 'Add your feature'`
7. Push to branch: `git push origin feature/your-feature`
8. Create a Pull Request

## Support

For questions or issues:
1. Check existing documentation files
2. Review code comments and TypeScript types
3. Search existing GitHub issues
4. Create a new issue with detailed information

---

**Note:** This README is designed to enable new contributors to onboard without needing to ask questions. If something is unclear or missing, please update this document!
