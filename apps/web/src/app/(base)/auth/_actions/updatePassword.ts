'use server'

import { createSupabaseClient } from "@booking/infra/server/supabase"

type State = { error: string | null, success: boolean }

export async function updatePassword(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createSupabaseClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Не авторизован', success: false }
  }

  const password = formData.get('password') as string

  console.log("is password", password)
  
  if (!password || password.length < 6) {
    return { error: 'Пароль должен быть не менее 6 символов', success: false }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error(error)
    console.log("is error", error)
    return { error: error.message, success: false }
  }

  return { success: true, error: null }
}