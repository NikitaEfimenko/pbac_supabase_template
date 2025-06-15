import { createSupabaseClient } from "@booking/infra/server/supabase"
import { redirect } from "next/navigation"
import { EntityList } from "@/widgets/entity-list/ui"
import { Suspense } from "react"
import { Loader } from "@/shared/ui/loader"

export default async function HomePage() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return <>    
    <div className="container mx-auto px-4 py-8">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">Booking system</h1>
      <p className="text-md text-muted-foreground">
       Find and book the perfect entity for your event
      </p>
    </div>
    <div className="flex flex-col gap-4 w-full">
      <Suspense fallback={<Loader/>}>
        <EntityList/>
      </Suspense>
    </div>
  </div>
  </>
}