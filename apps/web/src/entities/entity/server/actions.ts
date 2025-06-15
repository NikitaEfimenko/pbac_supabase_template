'use server';

import { revalidatePath } from 'next/cache';
import { Entity } from '@booking/infra/types';
import * as dal from './dal';
import * as access from './access';
import { getServerSession } from '@booking/infra/server/get-session';
import { createRlsClient } from '@booking/infra/server/database';
import { createSupabaseClient } from '@booking/infra/server/supabase';

type State = {
  error: string | null;
  success: boolean;
  data?: any;
};

export async function createEntity(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { error: 'Не авторизован', success: false };
    }
    const canCreate = await access.canUserCreateEntity(session.user.id, session.role);
    if (!canCreate) {
      return { error: 'Нет прав на создание', success: false };
    }

    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      capacity: Number(formData.get('capacity')),
      imageUrl: formData.get('imageUrl') as string,
      description: formData.get('description') as string,
      priceSeed: String(formData.get('priceSeed')),
      ownerId: session.user.id,
    };

    const entity = await dal.createEntity(data, session.user.id);
    console.log(process.env.MY_EMAIL_SECRET!, "target")
    if (session.user.email) {

      (await createSupabaseClient()).functions.invoke('resend-email', {
        body: {
          to: session.user.email,
          subject: 'Test',
          html: 'Test',
        },
        headers: {
          "x-api-key": process.env.MY_EMAIL_SECRET!,
        },
      });
    }
    revalidatePath('/entities');
    return { success: true, error: null, data: entity };
  } catch (error) {
    console.error(error);
    return {
      error: error instanceof Error ? error.message : 'Ошибка при создании',
      success: false
    };
  }
}

export async function updateEntity(
  entityId: Entity["id"],
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { error: 'Не авторизован', success: false };
    }

    const canUpdate = await access.canUserUpdateEntity(session.user.id, entityId);
    if (!canUpdate) {
      return { error: 'Нет прав на обновление', success: false };
    }

    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      capacity: Number(formData.get('capacity')),
      imageUrl: formData.get('imageUrl') as string,
      description: formData.get('description') as string,
      priceSeed: String(formData.get('priceSeed')),
    };

    const entity = await dal.updateEntity(entityId, data, session.user.id);

    revalidatePath('/entities');
    revalidatePath(`/entities/${entityId}`);

    return { success: true, error: null, data: entity };
  } catch (error) {
    console.error(error);
    return {
      error: error instanceof Error ? error.message : 'Ошибка при обновлении',
      success: false
    };
  }
}

export async function deleteEntity(
  entityId: Entity["id"],
  prevState: State
): Promise<State> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { error: 'Не авторизован', success: false };
    }

    const canDelete = await access.canUserDeleteEntity(session.user.id, entityId);
    if (!canDelete) {
      return { error: 'Нет прав на удаление', success: false };
    }

    const entity = await dal.deleteEntity(entityId, session.user.id);

    revalidatePath('/entities');
    return { success: true, error: null, data: entity };
  } catch (error) {
    console.error(error);
    return {
      error: error instanceof Error ? error.message : 'Ошибка при удалении',
      success: false
    };
  }
}

export async function getEntity(
  entityId: Entity["id"],
  prevState: State
): Promise<{ data: Entity | null, error: string | null, success: boolean }> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { error: 'Не авторизован', success: false, data: null };
    }

    const canView = await access.canUserViewEntity(session.user.id, entityId);
    if (!canView) {
      return { error: 'Нет прав на просмотр', success: false, data: null };
    }

    const entity = await dal.findEntityById(entityId, session.user.id);
    return { success: true, error: null, data: entity };
  } catch (error) {
    console.error(error);
    return {
      error: error instanceof Error ? error.message : 'Ошибка при получении',
      success: false,
      data: null
    };
  }
}

export async function getEntities(
  prevState: State
): Promise<State> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { error: 'Не авторизован', success: false };
    }

    const entities = session.role === 'admin'
      ? await dal.findEntitiesByOwnerId(session.user.id, session.user.id)
      : await dal.findAllEntities(session.user.id);

    return { success: true, error: null, data: entities };
  } catch (error) {
    console.error(error);
    return {
      error: error instanceof Error ? error.message : 'Ошибка при получении списка',
      success: false
    };
  }
}
