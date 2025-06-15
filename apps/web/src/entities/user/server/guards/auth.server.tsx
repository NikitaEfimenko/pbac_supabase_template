import 'server-only'

import { createSupabaseClient } from "@booking/infra/server/supabase"
import { ReactNode } from "react"
import { redirect } from "next/navigation"

export async function AuthGuard({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <>{children}</>
}