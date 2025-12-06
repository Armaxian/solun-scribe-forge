import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      licenses: {
        Row: {
          id: string
          key: string
          status: 'active' | 'expired' | 'revoked' | 'pending'
          tier: 'basic' | 'professional' | 'team'
          assigned_user: string | null
          expiry: string
          created_at: string
          updated_at: string
          created_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          key: string
          status: 'active' | 'expired' | 'revoked' | 'pending'
          tier: 'basic' | 'professional' | 'team'
          assigned_user?: string | null
          expiry: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          key?: string
          status?: 'active' | 'expired' | 'revoked' | 'pending'
          tier?: 'basic' | 'professional' | 'team'
          assigned_user?: string | null
          expiry?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          notes?: string | null
        }
      }
      user_entitlements: {
        Row: {
          id: string
          user_id: string
          license_id: string | null
          tier: 'basic' | 'professional' | 'team'
          is_valid: boolean
          expires_at: string | null
          validated_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          license_id?: string | null
          tier: 'basic' | 'professional' | 'team'
          is_valid?: boolean
          expires_at?: string | null
          validated_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          license_id?: string | null
          tier?: 'basic' | 'professional' | 'team'
          is_valid?: boolean
          expires_at?: string | null
          validated_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          source: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          source: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          source?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid' | 'paused'
          tier: 'basic' | 'professional' | 'team' | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          status?: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid' | 'paused'
          tier?: 'basic' | 'professional' | 'team' | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          status?: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid' | 'paused'
          tier?: 'basic' | 'professional' | 'team' | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signInWithMagicLink = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  })
  return { data, error }
}

export const signInWithOAuth = async (provider: 'google' | 'apple') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/account`,
    },
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}
