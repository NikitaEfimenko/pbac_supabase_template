'use server'
import { createSupabaseClient } from "@booking/infra/server/supabase"
import { redirect } from "next/navigation"

export async function loginWithOAuth(provider: "github") {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    }
  })

  if (data.url) {
    redirect(data.url)
  }

  if (error) {
    console.error(error)
  }
}