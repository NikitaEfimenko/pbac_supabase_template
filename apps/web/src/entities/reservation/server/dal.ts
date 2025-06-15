import { createRlsClient } from '@booking/infra/database';
import { entities, reservations } from '@booking/infra/schema';
import { Entity, Reservation, User } from '@booking/infra/types';
import { and, eq, sql } from 'drizzle-orm';

import { addMinutes } from 'date-fns';
import { CreateReservationRequest } from '../types';

export const findEntityById = async (id: Entity["id"], userId?: User["id"]) => {
  const client = createRlsClient(userId);
  const [entity] = await client
    .select()
    .from(entities)
    .where(eq(entities.id, id));
  
  return entity;
};


export const emulatePay = async (reservationId: Reservation["id"], userId: User["id"]) => {
  const client = createRlsClient(userId);
  const [reservation] = await client.update(reservations).set({
    "status": "reserved"
  }).where(
    and(
      eq(reservations.id, reservationId),
      eq(reservations.userId, userId),
    ));
  
  return reservation;
};


export const findReservationsWithEntityByUserId = async (userId: User["id"]) => {
  const client = createRlsClient(userId);
  
  return client
    .select({
      reservation: reservations,
      entity: entities
    })
    .from(reservations)
    .leftJoin(entities, eq(reservations.entityId, entities.id))
    .where(eq(reservations.userId, userId));
}; 



export const findConflictingReservations = async (userId: User["id"], entityId: Entity["id"], bookingDate: string, startTime: string, endTime: string) => {
  const client = createRlsClient(userId);
  const conflictingReservations = await client
  .select({
    startTime: reservations.startTime,
    endTime: reservations.endTime,
  })
  .from(reservations)
  .where(
    and(
      eq(reservations.entityId, entityId),
      eq(reservations.bookingDate, sql`${bookingDate}::date`),
      sql`
        (start_time, end_time) OVERLAPS (${startTime}::time, ${endTime}::time)
        AND status = 'reserved'
      `
    )
  );
  return conflictingReservations
};
