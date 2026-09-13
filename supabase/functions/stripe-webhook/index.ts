import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { adminClient, json } from '../_shared/http.ts';

const tiers: Record<string, 'professional' | 'team'> = {
  solun_pro_monthly: 'professional', solun_pro_yearly: 'professional',
  solun_team_monthly: 'team', solun_team_yearly: 'team',
};

serve(async req => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const key = Deno.env.get('STRIPE_SECRET_KEY');
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const signature = req.headers.get('stripe-signature');
  if (!key || !secret) return json({ error: 'Webhook not configured' }, 503);
  if (!signature) return json({ error: 'Missing signature' }, 400);
  const stripe = new Stripe(key, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(await req.text(), signature, secret, undefined, Stripe.createSubtleCryptoProvider());
  } catch {
    return json({ error: 'Invalid signature' }, 400);
  }
  try {
    let subscriptionId: string | null = null;
    if (['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)) {
      subscriptionId = (event.data.object as Stripe.Subscription).id;
    } else if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'subscription') subscriptionId = session.subscription as string | null;
    } else if (['invoice.payment_succeeded', 'invoice.payment_failed'].includes(event.type)) {
      subscriptionId = (event.data.object as Stripe.Invoice).subscription as string | null;
    }
    if (!subscriptionId) return json({ received: true });
    // Retrieve current Stripe state: a delayed failed invoice must not revoke a recovered subscription.
    const observedAt = new Date().toISOString();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['items.data.price'] });
    const client = adminClient();
    let userId = subscription.metadata?.user_id;
    if (!userId) {
      const { data, error } = await client.from('subscriptions').select('user_id').eq('stripe_customer_id', subscription.customer as string).maybeSingle();
      if (error) throw error;
      userId = data?.user_id;
    }
    if (!userId) throw new Error('Subscription account mapping missing');
    const price = subscription.items.data[0]?.price;
    const tier = price?.lookup_key ? tiers[price.lookup_key] : undefined;
    if (!tier) throw new Error('Unrecognized subscription price');
    const { error } = await client.rpc('apply_stripe_subscription', {
      p_user_id: userId, p_observed_at: observedAt,
      p_subscription: {
        id: subscription.id, customer: subscription.customer, price_id: price.id, status: subscription.status, tier,
        current_period_start: subscription.current_period_start, current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end, canceled_at: subscription.canceled_at,
        trial_start: subscription.trial_start, trial_end: subscription.trial_end, created: subscription.created,
      },
    });
    if (error) throw error;
    return json({ received: true });
  } catch {
    // Stripe retries non-2xx responses. Never acknowledge a failed database write.
    console.error('Stripe webhook synchronization failed', event.id);
    return json({ error: 'Subscription synchronization failed' }, 500);
  }
});
