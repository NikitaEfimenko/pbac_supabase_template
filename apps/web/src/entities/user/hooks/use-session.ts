'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@booking/infra/supabase/client'
import { jwtDecode } from 'jwt-decode'
import { AuthChangeEvent, Session as SupabaseSession } from '@supabase/supabase-js'

type Session = {
  role: string
  permissions: string[]
  user: {
    id: string
    email: string
  }
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  
  useEffect(() => {
    const supabase = createSupabaseClient()
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        const jwt = jwtDecode<{
          user_role: string
          user_permissions: string[]
        }>(session.access_token)

        setSession({
          role: jwt.user_role,
          permissions: jwt.user_permissions,
          user: {
            id: session.user.id,
            email: session.user.email || ''
          }
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: SupabaseSession | null) => {
        if (session?.access_token) {
          const jwt = jwtDecode<{
            user_role: string
            user_permissions: string[]
          }>(session.access_token)
  
          setSession({
            role: jwt.user_role,
            permissions: jwt.user_permissions,
            user: {
              id: session.user.id,
              email: session.user.email || ''
            }
          })
        } else {
          setSession(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return session
} 