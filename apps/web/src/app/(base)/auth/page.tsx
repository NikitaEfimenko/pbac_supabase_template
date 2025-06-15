'use server'
import { AuthForm } from "./auth-form"
import { createSupabaseClient } from "@booking/infra/server/supabase"
import { redirect } from "next/navigation"

export default async function AuthPage() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }
  return (
    <div className="container relative flex h-[100svh] flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <AuthForm />
    </div>
  )
}