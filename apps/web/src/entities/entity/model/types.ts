export interface Entity {
  id: string
  name: string
  address: string
  capacity: number
  imageUrl: string | null
  description: string | null
  priceSeed: string
  createdAt: Date
  ownerId: string
}