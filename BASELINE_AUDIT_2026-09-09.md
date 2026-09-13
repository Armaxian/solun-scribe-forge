# Solun Website Baseline Audit & Feature Truth Table
**Date:** September 9, 2026
**Purpose:** Establish ground truth before redesign and production hardening

## Executive Summary

**Current State:** The website has a working Stripe subscription implementation, license key system, and comprehensive UI components. However, it contains significant mismatches between marketing claims and actual product capabilities, particularly around collaboration, sync, and AI features.

**Critical Findings:**
1. ✅ **Stripe billing is implemented** - checkout, webhooks, portal all functional
2. ❌ **Home page claims features not in the app** - collaboration, sync, unlimited RAG
3. ❌ **No AI usage tracking/allowance system** - billing exists but consumption limits don't
4. ❌ **No desktop AI entitlement bridge** - subscriptions don't unlock desktop AI
5. ❌ **Privacy describes sync that doesn't exist** - says "optional cloud sync" but it's disabled
6. ⚠️  **Download page releases.json returns HTML** - no actual release manifest

## Hero Animation Components

**Protected Components (DO NOT REPLACE):**
- `src/components/HeroCanvas.tsx` - Three.js noise shader (green organic flow)
- `src/components/SafeHeroCanvas.tsx` - Error boundary wrapper with lazy loading
- `src/components/ui/prism.tsx` - OGL pyramid/prism shader (iridescent geometric)
- `src/components/ui/prism-demo.tsx` - Wrapper for prism component

**Current Usage:** Home page uses `PrismDemo` (prism shader), NOT `SafeHeroCanvas` (noise shader).

**Prompt Requirement:** Preserve the "WebGL prism/pyramid shader" animation. This corresponds to the `prism.tsx` component currently in use via `PrismDemo`.

## Feature Truth Table

| Marketing Claim | Source Location | Implementation Status | Evidence | Action |
|----------------|-----------------|----------------------|----------|--------|
| **Distraction-free editor** | Home, Pricing, Features | ✅ Implemented | Desktop repo has TipTap editor | Keep claim |
| **Lore Vault** | Home, Pricing | ✅ Implemented | Desktop has characters/places/items schema | Keep claim |
| **RAG-powered AI chat** | Home, Pricing | ⚠️  Partial | AI chat exists; RAG retrieval has fallback only | Qualify as "AI chat with context" |
| **Unlimited Lore Vault** (Pro) | Pricing | ❌ No evidence | No entity limits found in schema | Remove "unlimited" |
| **Full RAG** (Pro vs Free) | Pricing | ❌ Not tiered | No Pro/Free RAG distinction in code | Remove tiering |
| **Cloud sync** | Home, Pricing, Privacy, Terms | ❌ Disabled | `packages/sync` excluded from build | Remove all sync claims |
| **Team collaboration** | Pricing (Team plan) | ❌ Not implemented | No multiplayer/collaboration code | Remove Team plan entirely |
| **Real-time collaboration** | Pricing | ❌ Not implemented | No WebSocket/CRDT/multiplayer | Remove claim |
| **Shared Lore Vault** | Pricing | ❌ Not implemented | All lore is local SQLite | Remove claim |
| **Unlimited version control** | Pricing | ❌ Misleading | Has revisions but not "unlimited" | Change to "Local version history" |
| **Branch and merge** | Home | ❌ Not implemented | No Git-style branching | Remove claim |
| **End-to-end encryption** | Home, Privacy | ❌ Misleading | Has encrypted storage, not E2EE | Change to "Encrypted local storage" |
| **Priority support** | Pricing | ❌ No support system | No ticketing/support infrastructure | Remove or qualify |
| **30-day refund** | Pricing | ⚠️  Contradicts Terms | Terms say "payments are final" | Resolve contradiction |
| **Thousands of users** | Pricing | ❌ Unverified | No user count evidence | Remove claim |
| **Desktop license sold separately** | Pricing FAQ | ❌ Confusing | Only subscriptions exist, no separate license | Clarify: desktop IS the product |
| **GPG signatures** (Linux) | Download | ❌ Not verified | No GPG key/signature files in release | Remove until implemented |
| **Security audits** | Download | ❌ Unverified | No audit reports | Remove claim |
| **Code signing** | Download | ⚠️  Config exists | electron-builder.yml has signing config, but no published artifacts | Keep, verify on first release |

## Current Stripe Implementation Analysis

### ✅ What Works
**Checkout Flow:**
- `supabase/functions/stripe-checkout/index.ts` - Creates subscription checkout sessions
- Validates lookup keys: `solun_pro_monthly`, `solun_pro_yearly`, `solun_team_monthly`, `solun_team_yearly`
- Prevents duplicate active subscriptions
- Passes `user_id` in metadata for reconciliation

**Webhook Processing:**
- `supabase/functions/stripe-webhook/index.ts` - Handles all subscription events
- Signature verification (when `STRIPE_WEBHOOK_SECRET` set)
- Events: checkout.session.completed, subscription.created/updated/deleted, invoice.payment_succeeded/failed
- Updates `subscriptions` and `user_entitlements` tables atomically
- Maps lookup keys to tiers: professional, team

**Customer Portal:**
- `supabase/functions/stripe-portal/index.ts` - Opens Stripe-hosted management
- Returns users to `/account` after changes

**Database Schema:**
- `supabase/migrations/20240104000000_create_subscriptions_table.sql`
- RLS policies: users can SELECT own subscription, cannot INSERT/UPDATE/DELETE directly
- Trigger: `sync_subscription_to_entitlements()` revokes access on cancellation
- Function: `check_expired_subscriptions()` for scheduled cleanup

### ❌ What's Missing

**1. AI Usage Tracking** (Critical - Required for Desktop Bridge)
No implementation of:
- Usage allowance schema (monthly request/token limits per plan)
- Usage consumption tracking (actual AI requests from desktop)
- Reservation/settlement pattern for concurrent requests
- Period-based allowance renewal
- Overage prevention

**2. Desktop AI Entitlement Bridge** (Critical - Billing Won't Unlock Desktop)
Current desktop AI check:
```typescript
// apps/desktop/src/main/ipc/secureAI.ts
const ai_access_expires_at = user.app_metadata.ai_access_expires_at
if (!ai_access_expires_at || new Date(ai_access_expires_at) < new Date()) {
  return { error: 'AI access expired or not enabled' }
}
```

**Missing:**
- Edge Function to read `subscriptions` + `user_entitlements` → return AI access decision
- Schema for `ai_usage` table (request_id, user_id, tokens_used, period, status: pending/reported/settled)
- Desktop AI handler calling entitlement endpoint before provider
- Allowance enforcement before expensive operations

**3. Actual Product Releases**
`public/releases.json` doesn't exist → download page shows "Coming soon" for all platforms

## Routes & Navigation

**Active Routes:**
- `/` - Home (uses `Home.tsx` with PrismDemo animation)
- `/features` - Feature descriptions
- `/pricing` - Stripe-integrated pricing (has Team plan that shouldn't exist)
- `/download` - Platform-specific downloads (needs real releases.json)
- `/account` - User dashboard with subscription status
- `/login` - Auth flows
- `/docs`, `/faqs`, `/about`, `/contact` - Content pages
- `/privacy`, `/terms`, `/cookies`, `/legal` - Legal pages
- `/blog`, `/blog/:slug` - Blog system
- `/story` - About/story page

**Issues:**
- `/blog/offline-first-architecture` - Post not found (in sitemap)
- `/blog/continuity-engine-deep-dive` - Post not found (in sitemap)
- NotFound returns HTTP 200 instead of 404

## Supabase Schema (Current)

**Tables:**
- `auth.users` - Supabase Auth managed
- `profiles` - User profile data
- `licenses` - Legacy license key system (desktop app licenses)
- `user_entitlements` - Unified entitlement view (licenses OR subscriptions)
- `subscriptions` - Stripe subscription state (NEW, working)
- `newsletter_subscribers` - Email collection
- `contact_messages` - Contact form submissions

**Edge Functions:**
- `validate-license` - Server-side license key validation
- `subscribe-newsletter` - Newsletter signup
- `stripe-checkout` - Create subscription checkout session
- `stripe-webhook` - Process Stripe events
- `stripe-portal` - Open billing management portal

**Missing Edge Functions:**
- `ai-entitlements` - Check AI access for desktop
- `ai-usage-reserve` - Reserve usage before AI request
- `ai-usage-settle` - Settle actual usage after AI response

## Privacy & Legal Accuracy

**Privacy.tsx Current Claims:**
- ✅ Accurate: "offline-first approach", "content stored locally", "optional cloud sync"
- ❌ **Inaccurate:** "optional cloud sync" - sync is disabled, not optional
- ❌ **Missing:** AI request data flow (what context is sent to AI provider)
- ❌ **Missing:** Which AI provider is used
- ⚠️  Generic: "Supabase servers (configurable region)" - should specify actual region

**Terms.tsx Issues:**
- Contains placeholder: "[Company Address], Australia"
- "Payments are final" contradicts Pricing "30-day refund"

## Pricing Plans Current vs Proposed

**Current (Inaccurate):**
- Free: Local AI (limited), Basic Lore (100 entities), 3 versions
- Pro $19/mo: Unlimited Lore, Full RAG, Unlimited versions, Priority email support
- Team $49/mo: Everything in Pro, 10 members, Real-time collab, Shared Lore, Cloud sync

**Proposed (Accurate):**
- **Remove Team plan entirely** (not implemented)
- Free: Desktop app, local writing, basic AI access (if invited), local backups, local Lore Vault
- Pro $19/mo: Subscription AI access (X requests/month), same desktop features (no new features, just unlocks AI)

**Critical Decision Needed:** What does Pro actually unlock?
- Current evidence: Only AI access via `user_entitlements.is_valid`
- No editor features, no Lore limits, no export restrictions in code
- Pro subscription = "AI allowance" NOT "premium app features"

## Download Page Issues

**Current Behavior:**
- `public/releases.json` doesn't exist
- `useDownloads` hook tries to fetch `/releases.json`
- Fetch succeeds with HTTP 200 but returns HTML (likely index.html fallback)
- Hook sees HTML instead of JSON, falls back to environment variables
- Environment variables are empty
- Shows "Coming soon" for all platforms

**Fix Required:**
- Create `public/releases.json` based on `public/releases.json.example`
- OR populate environment variables with real release URLs
- OR return HTTP 404 when releases.json missing (needs Netlify config)

## Recommended Implementation Priorities

### Phase 1: Truth in Marketing (Immediate)
1. ✅ Remove Team plan from pricing
2. ✅ Remove collaboration/sync/cloud claims from all pages
3. ✅ Qualify AI claims ("AI chat" not "Full RAG")
4. ✅ Remove "unlimited" claims without evidence
5. ✅ Update Privacy to accurately describe AI data flow
6. ✅ Fix Terms contradiction on refunds
7. ✅ Create placeholder releases.json or show honest unavailability

### Phase 2: Billing Completion (Before Launch)
8. ⚠️  Define actual Pro plan value proposition (AI allowance only vs. premium features)
9. ⚠️  Create AI usage tracking schema and migration
10. ⚠️  Implement `ai-entitlements` Edge Function for desktop
11. ⚠️  Implement usage reservation/settlement in AI path
12. ⚠️  Test end-to-end: website purchase → desktop AI unlocks → usage tracked → limit enforced

### Phase 3: Production Quality (Before Launch)
13. ⚠️  Add proper 404 responses (NotFound route + Netlify config)
14. ⚠️  Remove/fix broken blog post links from sitemap
15. ⚠️  Add integration tests for checkout/webhook flows
16. ⚠️  Security audit: RLS policies, API token exposure, CORS, CSP
17. ⚠️  Performance: measure Core Web Vitals, optimize hero animation
18. ⚠️  Accessibility: WCAG 2.2 AA compliance audit

## Tech Stack Confirmed

- **Framework:** React 18 + TypeScript + Vite 5
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + shadcn/ui components
- **Auth:** Supabase Auth (email/password, OAuth ready for Google/GitHub)
- **Database:** Supabase Postgres
- **Billing:** Stripe (subscription mode, hosted checkout + portal)
- **Analytics:** PostHog (privacy-first, cookieless)
- **3D Graphics:** Three.js (HeroCanvas) + OGL (Prism) + Spline (feature embeds)
- **Deployment:** Netlify (configured in netlify.toml)

## Animation Baseline (Protected)

**Prism Component (Currently in Use):**
- File: `src/components/ui/prism.tsx`
- Technology: OGL (WebGL library)
- Visual: Iridescent pyramid/octahedron with raymarch rendering
- Parameters: `height=3.5, baseWidth=5.5, animationType="rotate", glow=1, noise=0.5, scale=3.6, timeScale=0.5`
- Interaction: Mouse hover tilts the prism
- Fallback: None currently (needs still image for reduced motion)
- Performance: Suspends when offscreen if `suspendWhenOffscreen=true`

**Alternative Noise Shader (Not Currently Used):**
- File: `src/components/HeroCanvas.tsx`
- Technology: Three.js + React Three Fiber
- Visual: Organic green flowing noise (FBM-based)
- Fallback: Gradient div for reduced motion
- Currently wrapped in `SafeHeroCanvas.tsx` but not used on Home page

**Prompt Says:** "Preserve the WebGL prism/pyramid shader"
**This means:** Keep `prism.tsx` and `PrismDemo` as-is

## Deployment Configuration

**Netlify (`netlify.toml`):**
- Build command: `bun run build` (or npm run build)
- Publish directory: `dist/`
- Security headers: CSP, HSTS, X-Frame-Options configured
- Redirects: SPA routing (/* → /index.html for client-side routing)
- Post-build: `generate-sitemap.ts` creates sitemap.xml

**Environment Variables Required:**
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_PUBLIC_POSTHOG_KEY
VITE_PUBLIC_POSTHOG_HOST
VITE_RELEASE_WINDOWS_URL (optional)
VITE_RELEASE_MAC_INTEL_URL (optional)
VITE_RELEASE_MAC_ARM_URL (optional)
VITE_RELEASE_LINUX_URL (optional)
```

## Next Actions

See updated TODO list in code. Top priorities:
1. Create accurate landing page copy (Home.tsx)
2. Fix Pricing to remove Team plan and unsupported features
3. Create `public/releases.json` or show honest "no release yet" state
4. Update Privacy with accurate AI data flow
5. Create AI usage tracking schema
6. Implement desktop AI entitlement bridge
7. Write final deliverables document with launch checklist

---

**This baseline establishes the truth. All redesign work must be measured against these findings.**
