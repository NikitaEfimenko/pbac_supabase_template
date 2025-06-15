import "server-only";

import { createRlsClient } from '@booking/infra/database';
import { reservations } from '@booking/infra/schema';
import { addMinutes } from 'date-fns';
import { CreateReservationRequest } from '../types';

export async function createReservation(
  params: CreateReservationRequest & { userId: string }
) {
  const client = createRlsClient(params.userId);

  const reservation = await client.insert(reservations).values({
    entityId: String(params.entityId),
    userId: String(params.userId), 
    bookingDate: String(params.bookingDate),
    startTime: String(params.startTime),
    endTime: params.endTime,
    totalPrice: String(params.totalPrice),
    status: 'pending_payment',
    expiresAt: addMinutes(new Date(), 5), // Резервация истекает через час если не оплачена
  }).returning();

  return reservation[0];
} 