'use server'
import { createSupabaseClient } from "@booking/infra/server/supabase"
import { redirect } from "next/navigation"
import { UserRole } from "@/shared/types/user"
// import { users } from "@booking/infra/schema"
import { adminClient } from "@booking/infra/database"

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as UserRole

  const supabase = await createSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      data: {
        email_confirm_required: true,
        role
      }
    }
  })

  if (error) {
    console.error(error)
    redirect(`/auth/error?error=${error?.message}`)
  }

  if (data.user?.identities?.length === 0) {
    redirect(`/auth/error?error=User already exists`)
  }

  // // Create user record in our database
  // if (data.user) {
  //   await adminClient.insert(users).values({
  //     id: data.user.id,
  //     role,
  //   })
  // }

  redirect('/auth/signup-success')
}