'use server'

import { createSupabaseClient } from '@booking/infra/server/supabase';
import * as dal from '@/entities/entity/server/dal';

type State = {
  error: string | null;
  success: boolean;
  data?: string;
};

export async function generatePdf(entityId: string,  prevState: State,) {
  const client = await createSupabaseClient()
  try {
    const entity = await dal.findEntityById(entityId)
    if (!entity) {
      return { error: 'Объект не найден', success: false }
    }
    const { data, error } = await client.functions.invoke('generator-function', {
      body: { 
        capacity: entity.capacity,
        name: entity.name,
        address: entity.address
       },
      headers: {
        'x-api-key': process.env.MY_GENERATOR_SECRET!,
      },
    })
  
    if (error) {
      return { error: error.message, success: false }
    }

    return {
      data: data.data, // уже base64
      success: true,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Ошибка при получении объекта', success: false }
  }
}