// import { mockBookings, mockVenues } from "@/lib/mock-data"
import { Loader } from "@/shared/ui/loader"
import BookingsList from "@/widgets/bookings-list/ui/bookings-list"
import { Metadata } from "next";
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "My bookings",
  description: "My bookings",
};

export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My bookings</h1>
        <p className="text-muted-foreground">Manage your bookings and download tickets</p>
      </div>
      <Suspense fallback={<Loader/>}>
        <BookingsList/>
      </Suspense>
    </div>
  )
}
