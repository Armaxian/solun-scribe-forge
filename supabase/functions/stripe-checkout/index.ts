import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

import { billingReturnUrl } from '../_shared/billing-url.ts';
import { adminClient, corsHeaders, json, requestUser } from '../_shared/http.ts';

serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const client = adminClient();
    const user = await requestUser(req, client);
    if (!user) return json({ error: 'Sign in to subscribe' }, 401);
    if (Deno.env.get('SOLUN_BILLING_ENABLED') !== 'true' || Deno.env.get('SOLUN_AI_ENABLED') !== 'true') return json({ error: 'AI subscriptions are not available yet. Local writing is free.' }, 503);
    const body = await req.json();
    if (!['solun_pro_monthly', 'solun_pro_yearly'].includes(body?.lookup_key)) return json({ error: 'Invalid plan' }, 400);
    const site = Deno.env.get('SITE_URL') ?? 'https://solun.app';
    const successUrl = billingReturnUrl(body.success_url, site, '/account?checkout=success&session_id={CHECKOUT_SESSION_ID}');
    const cancelUrl = billingReturnUrl(body.cancel_url, site, '/pricing?checkout=cancelled');
    const { data: allowance, error: allowanceError } = await client.from('plan_allowances').select('*').eq('tier', 'professional').single();
    if (allowanceError || !allowance || allowance.requests_per_month <= 0 || allowance.tokens_per_month <= 0 || allowance.cost_limit_usd <= 0) return json({ error: 'AI subscriptions are not configured yet' }, 503);
    const key = Deno.env.get('STRIPE_SECRET_KEY');
    if (!key) return json({ error: 'Payments are not configured' }, 503);
    const stripe = new Stripe(key, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });
    const { data: existing, error } = await client.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    let customerId = existing?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } }, { idempotencyKey: `solun-customer-${user.id}` });
      customerId = customer.id;
      const { error: saveError } = await client.from('subscriptions').upsert({ user_id: user.id, stripe_customer_id: customerId }, { onConflict: 'user_id', ignoreDuplicates: true });
      if (saveError) throw saveError;
    }
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
    if (subscriptions.data.some(sub => !['canceled', 'incomplete_expired'].includes(sub.status))) return json({ error: 'Manage your existing subscription from Account.', has_active_subscription: true }, 409);
    const recent = await stripe.checkout.sessions.list({ customer: customerId, limit: 10 });
    const open = recent.data.find(session => session.status === 'open' && session.mode === 'subscription');
    if (open) {
      if (open.metadata?.lookup_key !== body.lookup_key) return json({ error: 'A checkout for a different billing period is already open. Finish it or wait for it to expire before changing periods.' }, 409);
      return json({ url: open.url, session_id: open.id });
    }
    const prices = await stripe.prices.list({ lookup_keys: [body.lookup_key], active: true });
    const price = prices.data[0];
    if (!price?.recurring) return json({ error: 'Plan price is not configured' }, 503);
    const session = await stripe.checkout.sessions.create({
      customer: customerId, mode: 'subscription', line_items: [{ price: price.id, quantity: 1 }],
      success_url: successUrl, cancel_url: cancelUrl,
      subscription_data: { metadata: { user_id: user.id } }, metadata: { user_id: user.id, lookup_key: body.lookup_key },
      allow_promotion_codes: true,
    }, { idempotencyKey: `solun-checkout-${user.id}-${recent.data[0]?.id ?? 'first'}` });
    return json({ url: session.url, session_id: session.id });
  } catch (error) {
    if (error instanceof TypeError || error instanceof SyntaxError) return json({ error: 'Invalid checkout request' }, 400);
    console.error('Checkout creation failed');
    return json({ error: 'Unable to open checkout. Please try again.' }, 503);
  }
});
