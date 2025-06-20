'use server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createSupabaseClient } from '@booking/infra/server/supabase'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  console.log('confirm !!!')
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  console.log(token_hash, type, next)

  if (token_hash && type) {
    const supabase = await createSupabaseClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next)
    } else {
      redirect(`/auth/error?error=${error?.message}`)
    }
  }

}