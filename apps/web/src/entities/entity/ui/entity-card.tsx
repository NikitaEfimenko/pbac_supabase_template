import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { MapPin, Users, Clock } from "lucide-react"
import { Entity } from "@/entities/entity/model/types"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"

interface EntityCardProps {
  entity: Entity
}

export function EntityCard({ entity }: EntityCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-56">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
          <Image
            src={entity.imageUrl ?? "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"}
            alt="Photo by Drew Beamer"
            fill
            className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </AspectRatio>
      </div>
      <CardHeader className="mt-4">
        <CardTitle className="line-clamp-1">{entity.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{entity.address}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            <span>{entity.capacity} persons</span>
          </div>
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            {(123).toLocaleString("ru-RU")} ₽/час
          </Badge>
        </div>
        {/* {entity.description && <p className="text-sm text-muted-foreground line-clamp-2">{entity.description}</p>} */}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/dashboard/entities/${entity.id}`}>More details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
