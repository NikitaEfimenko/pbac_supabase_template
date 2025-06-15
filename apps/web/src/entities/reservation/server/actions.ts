'use server';

import { getServerSession } from '@booking/infra/server/get-session';
import * as dal from './dal';
import { revalidatePath } from 'next/cache';
import { Entity, Reservation } from '@booking/infra/types';
import * as access from './access';
import { createReservation } from './create-reservation';
import { calculatePrice } from '../utils';
import { z } from 'zod';
import { createSupabaseClient } from '@booking/infra/server/supabase';
import { createReservationSchema } from '@/features/create-reservation/model/schema';

type State = {
  error: string | null;
  success: boolean;
  data?: any;
};

export async function getMyReservations(): Promise<State> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { error: 'Не авторизован', success: false };
    }

    const reservations = await dal.findReservationsWithEntityByUserId(session.user.id);
    
    return { 
      success: true, 
      error: null, 
      data: reservations.map(({ reservation, entity }) => ({
        ...reservation,
        entity
      }))
    };
  } catch (error) {
    console.error(error);
    return { 
      error: error instanceof Error ? error.message : 'Ошибка при получении бронирований',
      success: false 
    };
  }
} 

export async function pay(
  reservationId: Reservation["id"],
  prevState: State,
): Promise<State> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { error: 'Не авторизован', success: false };
    }
    await dal.emulatePay(reservationId, session.user.id)
    revalidatePath("/dashboard/bookings")
    return { success: true, error: null };
  } catch (error) {
    console.error(error);
    return { 
      error: error instanceof Error ? error.message : 'Ошибка при оплате',
      success: false 
    };
  }
}


export async function reserveEntity(
  entityId: Entity["id"],
  prevState: State,
  data: z.infer<typeof createReservationSchema>,
): Promise<State> {
  const { date, startTime, endTime } = data
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { error: 'Не авторизован', success: false };
    }

    const reservationData = {
      bookingDate: date.toISOString(),
      startTime: startTime,
      endTime: endTime,
    };

    const { available, conflictingReservations } = await access.checkAvailability({
      ...reservationData,
      userId: session.user.id,
      entityId: entityId
    });


    if (!available) {
      return { error: 'Нет прав на бронирование', success: false };
    }

    const totalPrice = calculatePrice(reservationData.startTime, reservationData.endTime)

    const reservation = await createReservation({
      entityId: entityId,
      bookingDate: reservationData.bookingDate,
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      totalPrice: totalPrice,
      userId: session.user.id
    });

    const entity = await dal.findEntityById(entityId, session.user.id)
    const client = await createSupabaseClient()
    const { data, error } = await client.functions.invoke('resend-email', {
      body: {
        to: session.user.email,
        subject: `Новая заявка на бронирование объекта ${entity.name}`,
        html: `
          <p>Здравствуйте, ${session.user.email}!</p>
          <p>Ваша заявка на бронирование объекта ${entity.name} успешно создана.</p>
          <p>Вы можете просмотреть ее в разделе "Мои бронирования".</p>
        `,
      },
      headers: {
        "x-api-key": process.env.MY_EMAIL_SECRET!,
      },
    });
    revalidatePath(`/entities/${entityId}`);
    revalidatePath("/dashboard/bookings")
    return { success: true, error: null };
  } catch (error) {
    console.error(error);
    return { 
      error: error instanceof Error ? error.message : 'Ошибка при бронировании',
      success: false 
    };
  }
}