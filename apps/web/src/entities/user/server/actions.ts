import 'server-only'
'use server'

import { createSupabaseClient } from "@booking/infra/supabase/server"

export async function createUser(user: User) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.from('users').insert(user).select().single()
  return data
}