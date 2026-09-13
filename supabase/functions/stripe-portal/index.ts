import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { adminClient, corsHeaders, json, requestUser } from '../_shared/http.ts';
import { billingReturnUrl } from '../_shared/billing-url.ts';

serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const client = adminClient();
    const user = await requestUser(req, client);
    if (!user) return json({ error: 'Sign in to manage billing' }, 401);
    const body = await req.json();
    const returnUrl = billingReturnUrl(body?.return_url, Deno.env.get('SITE_URL') ?? 'https://solun.app', '/account');
    const { data, error } = await client.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    if (!data?.stripe_customer_id) return json({ error: 'No billing account found' }, 404);
    const key = Deno.env.get('STRIPE_SECRET_KEY');
    if (!key) return json({ error: 'Billing is temporarily unavailable' }, 503);
    const stripe = new Stripe(key, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });
    const session = await stripe.billingPortal.sessions.create({ customer: data.stripe_customer_id, return_url: returnUrl });
    return json({ url: session.url });
  } catch (error) {
    if (error instanceof TypeError || error instanceof SyntaxError) return json({ error: 'Invalid billing request' }, 400);
    return json({ error: 'Unable to open billing. Please try again.' }, 503);
  }
});
