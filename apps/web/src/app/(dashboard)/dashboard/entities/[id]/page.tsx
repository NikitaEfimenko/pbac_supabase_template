import { getEntity } from "@/entities/entity/server/actions"
import { BookingForm } from "@/features/create-reservation/ui"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Clock, MapPin, Star, Users } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"


export const metadata: Metadata = {
  title: "Booking entity",
  description: "Booking entity",
};


interface EntityPageProps {
  params: {
    id: string
  }
}

export default async function EntityPage({ params }: EntityPageProps) {
  const { id } = params
  const { data: entity, error } = await getEntity(id, { error: null, success: false, data: null })

  if (!entity) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={entity.imageUrl ?? "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"}
              alt={entity.name}
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{entity.name}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{entity.address}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Badge variant="secondary" className="text-sm">
                <Users className="w-4 h-4 mr-1" />
                {entity.capacity} persons
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {/* {entity.price_per_hour.toLocaleString("ru-RU")} ₽/час */}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Star className="w-4 h-4 mr-1" />
                4.8 (24 reviews)
              </Badge>
            </div>

            {entity.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{entity.description}</p>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Wi-Fi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Projector</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Conditioner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Parking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Sound system</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Kitchen</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <BookingForm entity={entity} />
        </div>
      </div>
    </div>
  )
}
