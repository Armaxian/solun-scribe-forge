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

# Stripe Configuration (Subscriptions)
# Note: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET should be set in Supabase Edge Functions secrets,
# NOT in this .env file (they are server-side secrets)
# See "Stripe Setup" section below for full configuration guide

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

## Stripe Setup

Stripe is used for subscription billing. The integration requires both Stripe Dashboard configuration and Supabase Edge Function secrets.

### 1. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers > API keys
3. Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)

### 2. Configure Stripe Products & Prices

In Stripe Dashboard, create products and prices with lookup keys:

1. Go to Products > Add product
2. Create the following products with their prices:

| Product | Lookup Key | Monthly Price | Yearly Price |
|---------|-----------|---------------|--------------|
| Solun Pro | `solun_pro_monthly` | $19/month | - |
| Solun Pro (Yearly) | `solun_pro_yearly` | - | $15/month (billed annually) |
| Solun Team | `solun_team_monthly` | $49/month | - |
| Solun Team (Yearly) | `solun_team_yearly` | - | $39/month (billed annually) |

**Important:** When creating prices, click "Additional options" and set the **Lookup key** field exactly as shown above. These keys are used by the checkout system to find the correct prices.

### 3. Set Up Supabase Edge Function Secrets

Set the following secrets in your Supabase project:

```bash
# Using Supabase CLI
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_secret_key
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

Or via Supabase Dashboard:
1. Go to Project Settings > Edge Functions
2. Add the secrets there

### 4. Configure Stripe Webhook

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
   - `customer.created`
   - `customer.updated`
4. Copy the **Signing secret** (starts with `whsec_`)
5. Add it to Supabase secrets as `STRIPE_WEBHOOK_SECRET`

### 5. Configure Customer Portal

1. In Stripe Dashboard, go to Settings > Billing > Customer portal
2. Enable the following features:
   - Update payment methods
   - View invoice history
   - Cancel subscription
   - Update subscription (if offering plan upgrades)
3. Set up branding to match your site

### 6. Deploy Edge Functions

Deploy the Stripe edge functions to Supabase:

```bash
# Deploy all functions
supabase functions deploy stripe-checkout
supabase functions deploy stripe-portal
supabase functions deploy stripe-webhook
```

### Testing Stripe Integration

Use Stripe test mode and these test card numbers:
- **Success:** 4242 4242 4242 4242
- **Requires authentication:** 4000 0025 0000 3155
- **Declined:** 4000 0000 0000 9995

For webhook testing locally, use Stripe CLI:
```bash
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

## Notes

- The `.env` file is already in `.gitignore` and will not be committed
- All analytics are configured with privacy-first settings (cookieless mode)
- PostHog will run in development mode when `NODE_ENV=development`
- Release URLs are optional - platforms without URLs show "Coming soon" automatically
- **Never commit Stripe secret keys to version control**
- Use test mode keys during development, switch to live keys for production

