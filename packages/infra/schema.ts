import { serial, jsonb, primaryKey, bigint, text, pgTable, json, uuid, boolean, integer, varchar, timestamp, pgEnum, pgSchema, uniqueIndex, decimal, date, time } from 'drizzle-orm/pg-core';

const authSchema = pgSchema('auth');

const usersInAuth = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const appRoleEnum = pgEnum('app_role', ['admin', 'user']);
export const appPermissionEnum = pgEnum('app_permission', [
  'entities.create',
  'entities.read',
  'entities.update',
  'entities.delete',
  'entities.download',
  'entities.reservation.create',
  'entities.reservation.cancel',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().references(() => usersInAuth.id, { onDelete: 'cascade' }),
});

export const entities = pgTable('entities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  capacity: integer('capacity').notNull(),
  imageUrl: text('image_url'),
  description: text('description'),
  priceSeed: decimal('price_seed', { precision: 10, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => usersInAuth.id, { onDelete: 'cascade' }),
  role: appRoleEnum('role').notNull(),
}, (t) => ({
  uniqueUserRole: uniqueIndex('user_roles_user_id_role_key').on(t.userId, t.role),
}));

export const rolePermissions = pgTable('role_permissions', {
  id: serial('id').primaryKey(),
  role: appRoleEnum('role').notNull(),
  permission: appPermissionEnum('permission').notNull(),
}, (t) => ({
  uniqueRolePermission: uniqueIndex('role_permissions_role_permission_key').on(t.role, t.permission),
}));

export const reservationStatusEnum = pgEnum('reservation_status', [
  'pending_payment',
  'reserved',
  'cancelled',
  'expired'
]);

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityId: uuid('entity_id').notNull().references(() => entities.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: reservationStatusEnum('status').notNull().default('pending_payment'),
  bookingDate: date('booking_date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const databaseSchema = {
  users,
  entities,
  rolePermissions,
  userRoles,
  reservations
};