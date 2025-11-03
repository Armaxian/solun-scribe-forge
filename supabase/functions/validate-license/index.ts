import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { key } = await req.json()
    
    if (!key || typeof key !== 'string') {
      return new Response(
        JSON.stringify({ error: 'License key is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Normalize the license key
    const normalizedKey = key.trim().toUpperCase()

    // Prevent demo keys from being used in production (optional check)
    // Remove or comment this out if you want to allow demo keys
    // if (normalizedKey.includes('DEMO') && Deno.env.get('ENVIRONMENT') === 'production') {
    //   return new Response(
    //     JSON.stringify({ error: 'Demo keys are not allowed in production' }),
    //     { 
    //       status: 400, 
    //       headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    //     }
    //   )
    // }

    // Query the licenses table (using service role bypasses RLS)
    const { data: license, error: licenseError } = await supabaseClient
      .from('licenses')
      .select('id, key, status, tier, assigned_user, expiry, notes')
      .eq('key', normalizedKey)
      .single()

    if (licenseError || !license) {
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: 'Invalid license key'
        }),
        { 
          status: 200, // Return 200 to indicate the request succeeded, but license is invalid
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if license is already assigned to another user
    if (license.assigned_user && license.assigned_user !== user.id) {
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: 'This license key is already assigned to another user'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check license status
    if (license.status === 'revoked') {
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: 'This license key has been revoked'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check expiry
    const expiryDate = new Date(license.expiry)
    const now = new Date()
    const isExpired = expiryDate < now

    if (isExpired || license.status === 'expired') {
      // Update license status to expired if not already
      if (license.status !== 'expired') {
        await supabaseClient
          .from('licenses')
          .update({ status: 'expired', updated_at: new Date().toISOString() })
          .eq('id', license.id)
      }

      return new Response(
        JSON.stringify({ 
          valid: false,
          error: 'This license key has expired',
          expiry: license.expiry
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // License is valid - assign it to the user if not already assigned
    if (!license.assigned_user) {
      const { error: assignError } = await supabaseClient
        .from('licenses')
        .update({ 
          assigned_user: user.id,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', license.id)

      if (assignError) {
        console.error('Error assigning license:', assignError)
        return new Response(
          JSON.stringify({ error: 'Failed to assign license' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Update or create user entitlement
    const { error: entitlementError } = await supabaseClient
      .from('user_entitlements')
      .upsert({
        user_id: user.id,
        license_id: license.id,
        tier: license.tier,
        is_valid: true,
        expires_at: license.expiry,
        validated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (entitlementError) {
      console.error('Error updating entitlements:', entitlementError)
      return new Response(
        JSON.stringify({ error: 'Failed to update user entitlements' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return success response
    return new Response(
      JSON.stringify({
        valid: true,
        tier: license.tier,
        expiry: license.expiry,
        message: 'License validated and activated successfully'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error validating license:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

