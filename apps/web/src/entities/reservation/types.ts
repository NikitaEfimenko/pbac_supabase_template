import { Entity } from "@booking/infra/types";
import { z } from 'zod';

export type ReservationWithEntity = {
  id: string;
  entityId: string;
  userId: string;
  status: 'pending_payment' | 'reserved' | 'cancelled' | 'expired';
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  entity: Entity;
};

export const checkAvailabilitySchema = z.object({
  entityId: z.string().uuid(),
  bookingDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const checkPaymentSchema = z.object({
  reservationId: z.string().uuid(),
});


export const createReservationSchema = checkAvailabilitySchema.extend({
  totalPrice: z.number(),
});

export type CheckAvailabilityRequest = z.infer<typeof checkAvailabilitySchema>;
export type CheckPaymentSchema = z.infer<typeof checkPaymentSchema>;
export type CreateReservationRequest = z.infer<typeof createReservationSchema>;

export type AvailabilityResponse = {
  available: boolean;
  conflictingReservations?: Array<{
    startTime: string;
    endTime: string;
  }>;
}; 