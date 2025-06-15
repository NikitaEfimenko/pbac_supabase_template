import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from './schema';
import { appPermissionEnum, appRoleEnum } from './schema';

export type User = InferSelectModel<typeof schema.users>;
export type Entity = InferSelectModel<typeof schema.entities>;
export type Reservation = InferSelectModel<typeof schema.reservations>;
export type UserRole = InferSelectModel<typeof schema.userRoles>;
export type RolePermission = InferSelectModel<typeof schema.rolePermissions>;

export type NewUser = InferInsertModel<typeof schema.users>;
export type NewEntity = InferInsertModel<typeof schema.entities>;
export type NewReservation = InferInsertModel<typeof schema.reservations>; 


export type AppRole = typeof appRoleEnum.enumValues[number];
export type AppPermission = typeof appPermissionEnum.enumValues[number];


export interface JWTCustomClaims {
  user_role: AppRole;
  user_permissions: AppPermission[];
}

export interface UserObject {
  id: string;
  role: AppRole;
  permissions: AppPermission[];
} 