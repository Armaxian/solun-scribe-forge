import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

// Subscription status enum matching our database
const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  TRIALING: 'trialing',
  UNPAID: 'unpaid',
  PAUSED: 'paused',
} as const

type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS]

// Map Stripe plan IDs/lookup keys to our tier names
function getTierFromPriceId(priceId: string, lookupKey?: string | null): 'basic' | 'professional' | 'team' {
  // Check lookup key first (more reliable)
  if (lookupKey) {
    if (lookupKey.includes('team')) return 'team'
    if (lookupKey.includes('pro')) return 'professional'
    return 'basic'
  }
  
  // Fallback to checking price ID patterns
  // This is a backup - you should configure lookup keys in Stripe Dashboard
  return 'professional' // Default to professional for paid subscriptions
}

serve(async (req) => {
  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured')
      return new Response('Webhook Error: Server configuration error', { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Create Supabase client with service role key for elevated permissions
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the raw body for signature verification
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    let event: Stripe.Event

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message)
        return new Response(`Webhook Error: ${err.message}`, { status: 400 })
      }
    } else {
      // For development/testing without webhook secret
      // WARNING: Never do this in production without proper signature verification
      console.warn('Processing webhook without signature verification - ensure STRIPE_WEBHOOK_SECRET is set in production')
      event = JSON.parse(body) as Stripe.Event
    }

    console.log(`Processing webhook event: ${event.type}`)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(supabaseClient, stripe, session)
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCreated(supabaseClient, stripe, subscription)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(supabaseClient, stripe, subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(supabaseClient, subscription)
        break
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription
        await handleTrialWillEnd(supabaseClient, subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(supabaseClient, invoice)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(supabaseClient, invoice)
        break
      }

      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer
        console.log(`Customer created: ${customer.id}`)
        break
      }

      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer
        console.log(`Customer updated: ${customer.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function handleCheckoutSessionCompleted(
  supabase: ReturnType<typeof createClient>,
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  console.log('Checkout session completed:', session.id)

  // Get user_id from session metadata
  const userId = session.metadata?.user_id

  if (!userId) {
    console.error('No user_id in checkout session metadata')
    return
  }

  // Get the subscription details
  if (!session.subscription) {
    console.error('No subscription in checkout session')
    return
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
    expand: ['items.data.price'],
  })

  const price = subscription.items.data[0]?.price
  const tier = getTierFromPriceId(price?.id || '', price?.lookup_key)

  // Upsert subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_price_id: price?.id,
      status: subscription.status as SubscriptionStatus,
      tier,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at 
        ? new Date(subscription.canceled_at * 1000).toISOString() 
        : null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    })

  if (subError) {
    console.error('Error upserting subscription:', subError)
    return
  }

  // Update user_entitlements to grant access
  const { error: entitlementError } = await supabase
    .from('user_entitlements')
    .upsert({
      user_id: userId,
      tier,
      is_valid: subscription.status === 'active' || subscription.status === 'trialing',
      expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
      validated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    })

  if (entitlementError) {
    console.error('Error updating user entitlements:', entitlementError)
  }

  console.log(`Subscription ${subscription.id} activated for user ${userId}`)
}

async function handleSubscriptionCreated(
  supabase: ReturnType<typeof createClient>,
  stripe: Stripe,
  subscription: Stripe.Subscription
) {
  console.log('Subscription created:', subscription.id)

  // Get user_id from subscription metadata
  const userId = subscription.metadata?.user_id

  if (!userId) {
    // Try to find user by customer ID
    const { data: existingUser } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', subscription.customer as string)
      .single()

    if (!existingUser?.user_id) {
      console.error('Cannot find user for subscription:', subscription.id)
      return
    }
  }

  // The checkout.session.completed handler should have already created the record
  // This is a backup handler
  console.log(`Subscription created event processed for: ${subscription.id}`)
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createClient>,
  stripe: Stripe,
  subscription: Stripe.Subscription
) {
  console.log('Subscription updated:', subscription.id, 'Status:', subscription.status)

  // Find the subscription record by Stripe subscription ID
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (!existingSub?.user_id) {
    console.error('Subscription not found in database:', subscription.id)
    return
  }

  const price = subscription.items.data[0]?.price
  const tier = getTierFromPriceId(price?.id || '', price?.lookup_key)

  // Update subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      stripe_price_id: price?.id,
      status: subscription.status as SubscriptionStatus,
      tier,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at 
        ? new Date(subscription.canceled_at * 1000).toISOString() 
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (subError) {
    console.error('Error updating subscription:', subError)
    return
  }

  // Update user_entitlements based on subscription status
  const isActive = ['active', 'trialing'].includes(subscription.status)
  
  const { error: entitlementError } = await supabase
    .from('user_entitlements')
    .update({
      tier: isActive ? tier : null,
      is_valid: isActive,
      expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', existingSub.user_id)

  if (entitlementError) {
    console.error('Error updating user entitlements:', entitlementError)
  }

  console.log(`Subscription ${subscription.id} updated, status: ${subscription.status}`)
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
) {
  console.log('Subscription deleted:', subscription.id)

  // Find and update the subscription record
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (!existingSub?.user_id) {
    console.error('Subscription not found in database:', subscription.id)
    return
  }

  // Update subscription status to canceled
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (subError) {
    console.error('Error updating subscription:', subError)
    return
  }

  // Revoke user entitlements
  const { error: entitlementError } = await supabase
    .from('user_entitlements')
    .update({
      tier: null,
      is_valid: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', existingSub.user_id)

  if (entitlementError) {
    console.error('Error revoking user entitlements:', entitlementError)
  }

  console.log(`Subscription ${subscription.id} deleted, entitlements revoked`)
}

async function handleTrialWillEnd(
  supabase: ReturnType<typeof createClient>,
  subscription: Stripe.Subscription
) {
  console.log('Trial will end for subscription:', subscription.id)
  
  // Could send notification email here
  // For now, just log it
  console.log(`Trial ending in 3 days for subscription ${subscription.id}`)
}

async function handlePaymentFailed(
  supabase: ReturnType<typeof createClient>,
  invoice: Stripe.Invoice
) {
  console.log('Payment failed for invoice:', invoice.id)

  if (!invoice.subscription) {
    return
  }

  // Find the subscription and update status
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', invoice.subscription as string)
    .single()

  if (existingSub?.user_id) {
    // Update subscription to past_due status
    await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', invoice.subscription as string)

    console.log(`Subscription ${invoice.subscription} marked as past_due`)
  }
}

async function handlePaymentSucceeded(
  supabase: ReturnType<typeof createClient>,
  invoice: Stripe.Invoice
) {
  console.log('Payment succeeded for invoice:', invoice.id)

  if (!invoice.subscription) {
    return
  }

  // Find the subscription and ensure status is active
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', invoice.subscription as string)
    .single()

  if (existingSub?.user_id) {
    // Ensure subscription is marked as active
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', invoice.subscription as string)

    // Ensure entitlements are valid
    await supabase
      .from('user_entitlements')
      .update({
        is_valid: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', existingSub.user_id)

    console.log(`Payment successful for subscription ${invoice.subscription}`)
  }
}

