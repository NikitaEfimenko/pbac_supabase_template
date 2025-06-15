'use server'
import { createSupabaseClient } from "@booking/infra/server/supabase"

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  console.log(data, error)
  if (error) {
    console.error(error)
  }
}