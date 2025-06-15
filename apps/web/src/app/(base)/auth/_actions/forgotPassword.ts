'use server'
import { createSupabaseClient } from "@booking/infra/server/supabase"

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string

  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    console.error(error)
  }
}
