'use server'
import { createSupabaseClient } from "@booking/infra/server/supabase"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  } else {
    redirect("/dashboard")
  }

  return null
}