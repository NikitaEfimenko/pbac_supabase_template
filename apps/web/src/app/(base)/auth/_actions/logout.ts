'use server'
import { createSupabaseClient } from "@booking/infra/server/supabase"

export async function signOut() {
  const supabase = await createSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error)
  }
}
