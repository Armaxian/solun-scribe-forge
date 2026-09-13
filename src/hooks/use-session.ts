import { User, Session } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, createElement, useContext, useState, useEffect, type ReactNode } from 'react'

import { supabase } from '@/lib/supabase'

export interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  error: string | null
}

const SessionContext = createContext<AuthState>({ session: null, user: null, loading: true, error: null })

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let authChanged = false
    let userId: string | undefined
    const update = (session: Session | null) => {
      if (!active) return
      if (userId !== session?.user.id) queryClient.clear()
      userId = session?.user.id
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      setError(null)
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authChanged = true
      update(session)
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || authChanged) return
      update(data.session)
      if (error) setError('Unable to restore your session. Please sign in again.')
    }).catch(() => {
      if (!active || authChanged) return
      update(null)
      setError('Unable to restore your session. Please try again.')
    })

    return () => { active = false; subscription.unsubscribe() }
  }, [queryClient])

  return createElement(SessionContext.Provider, { value: { session, user, loading, error } }, children)
}

export const useSession = () => useContext(SessionContext)
