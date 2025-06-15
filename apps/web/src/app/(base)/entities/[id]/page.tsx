import { BookingForm } from "@/features/create-reservation/ui"
import { Entity } from "@/entities/entity/model/types"

export default async function EntityPage({ params }: { params: { id: string } }) {
  // TODO: Добавить получение данных из Supabase
  const entity: Entity = {
    id: params.id,
    name: "Тестовая площадка",
    address: "ул. Тестовая, 1",
    capacity: 100,
    imageUrl: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
    description: "Тестовое описание",
    priceSeed: "123",
    createdAt: new Date(),
    ownerId: "test-owner",
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold mb-4">{entity.name}</h1>
          <p className="text-muted-foreground mb-2">{entity.address}</p>
          <p className="text-muted-foreground">Capacity: {entity.capacity} persons</p>
        </div>
        <BookingForm entity={entity} />
      </div>
    </div>
  )
} 