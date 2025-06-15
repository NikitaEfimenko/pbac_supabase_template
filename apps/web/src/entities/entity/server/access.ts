import { EntityId, UserId } from '@/shared/types';
import { findEntityById } from './dal';

export const canUserCreateEntity = async (userId: UserId, role: string) => {
  console.log('canUserCreateEntity', userId, role)
  return role === 'admin';
};

export const canUserUpdateEntity = async (userId: UserId, entityId: EntityId) => {
  const entity = await findEntityById(entityId);
  return entity?.ownerId === userId;
};

export const canUserDeleteEntity = async (userId: UserId, entityId: EntityId) => {
  const entity = await findEntityById(entityId);
  return entity?.ownerId === userId;
};

export const canUserViewEntity = async (userId: UserId, entityId: EntityId) => {
  return true; // Все пользователи могут просматривать сущности
};
