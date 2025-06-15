import 'server-only';
import { AvailabilityResponse, CheckAvailabilityRequest } from '../types';
import { findConflictingReservations } from './dal';

export async function checkAvailability(
  params: CheckAvailabilityRequest & { userId: string }
): Promise<AvailabilityResponse> {
  const { entityId, bookingDate, startTime, endTime } = params;

  const conflictingReservations = await findConflictingReservations(params.userId, params.entityId, params.bookingDate, params.startTime, params.endTime);

  return {
    available: conflictingReservations.length === 0,
    conflictingReservations: conflictingReservations.length > 0 ? conflictingReservations : undefined,
  };
}