export type EntityId = string;
export type UserId = string;

export type Entity = {
  id: EntityId;
  name: string;
  address: string;
  capacity: number;
  imageUrl?: string;
  description?: string;
  priceSeed: number;
  createdAt: Date;
  ownerId: UserId;
};

export type CreateEntityInput = Omit<Entity, 'id' | 'createdAt' | 'ownerId'>;
export type UpdateEntityInput = Partial<CreateEntityInput>; 