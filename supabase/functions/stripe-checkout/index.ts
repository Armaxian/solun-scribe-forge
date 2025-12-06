import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Stripe price lookup keys - must match what's configured in Stripe Dashboard
const PRICE_LOOKUP_KEYS = {
  PRO_MONTHLY: 'solun_pro_monthly',
  PRO_YEARLY: 'solun_pro_yearly',
  TEAM_MONTHLY: 'solun_team_monthly',
  TEAM_YEARLY: 'solun_team_yearly',
} as const

type PriceLookupKey = typeof PRICE_LOOKUP_KEYS[keyof typeof PRICE_LOOKUP_KEYS]

const VALID_LOOKUP_KEYS = new Set(Object.values(PRICE_LOOKUP_KEYS))

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Payment system not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { lookup_key, success_url, cancel_url } = await req.json()

    // Validate lookup key to prevent injection attacks
    if (!lookup_key || typeof lookup_key !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Price lookup key is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!VALID_LOOKUP_KEYS.has(lookup_key as PriceLookupKey)) {
      return new Response(
        JSON.stringify({ error: 'Invalid price lookup key' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already has a Stripe customer ID
    const { data: existingSubscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let stripeCustomerId: string | undefined

    if (existingSubscription?.stripe_customer_id) {
      stripeCustomerId = existingSubscription.stripe_customer_id

      // Check if customer already has an active subscription
      const existingSubscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'active',
        limit: 1,
      })

      if (existingSubscriptions.data.length > 0) {
        return new Response(
          JSON.stringify({ 
            error: 'You already have an active subscription. Please manage it from your account settings.',
            has_active_subscription: true
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get the price using lookup key
    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    })

    if (prices.data.length === 0) {
      console.error(`Price not found for lookup key: ${lookup_key}`)
      return new Response(
        JSON.stringify({ error: 'Price configuration not found. Please contact support.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const price = prices.data[0]

    // Create checkout session options
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      billing_address_collection: 'auto',
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : user.email,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: success_url || `${req.headers.get('origin')}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/pricing?checkout=cancelled`,
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
      metadata: {
        user_id: user.id,
      },
      allow_promotion_codes: true,
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionOptions)

    return new Response(
      JSON.stringify({
        url: session.url,
        session_id: session.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: error.statusCode || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

