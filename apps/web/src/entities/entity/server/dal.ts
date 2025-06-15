import { and, eq } from 'drizzle-orm';
import { createRlsClient } from '@booking/infra/database';
import { entities } from '@booking/infra/schema';
import { Entity, User } from '@booking/infra/types';

// Публичные операции через RLS
export const findEntityById = async (id: Entity["id"], userId?: User["id"]) => {
  const client = createRlsClient(userId);
  const [entity] = await client
    .select()
    .from(entities)
    .where(eq(entities.id, id));
  
  return entity;
};

export const findEntitiesByOwnerId = async (ownerId: User["id"], userId?: User["id"]) => {
  const client = createRlsClient(userId);
  return client
    .select()
    .from(entities)
    .where(eq(entities.ownerId, ownerId));
};

export const findAllEntities = async (userId?: User["id"]) => {
  const client = createRlsClient(userId);
  return client
    .select()
    .from(entities);
};

// Админские операции через adminClient
export const createEntity = async (data: typeof entities.$inferInsert, userId: User["id"]) => {
  const client = createRlsClient(userId);
  const [entity] = await client
    .insert(entities)
    .values(data)
    .returning();
  
  return entity;
};

export const updateEntity = async (id: Entity["id"], data: Partial<typeof entities.$inferInsert>, userId: User["id"]) => {
  const client = createRlsClient(userId);
  const [entity] = await client
    .update(entities)
    .set(data)
    .where(eq(entities.id, id))
    .returning();
  
  return entity;
};

export const deleteEntity = async (id: Entity["id"], userId: User["id"]) => {
  const client = createRlsClient(userId);
  const [entity] = await client
    .delete(entities)
    .where(eq(entities.id, id))
    .returning();
  
  return entity;
}; 