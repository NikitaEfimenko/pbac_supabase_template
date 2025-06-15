import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Entity } from '@/entities/entity/model/types';
import { findEntityById } from '@/entities/entity/server/dal';
import { DownloadPdf } from '@/features/download-pdf/ui/download-pdf';
import { getServerSession } from '@booking/infra/server/get-session';
import { notFound } from 'next/navigation';

interface EntityDetailsProps {
  entityId: Entity["id"];
}

export async function EntityDetails({ entityId }: EntityDetailsProps) {
  const session = await getServerSession();
  const entity = await findEntityById(entityId, session.user.id);

  if (!entity) {
    notFound();
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{entity.name}</h1>
            <p className="text-xl text-gray-600 mb-2">{entity.address}</p>
            <p className="text-lg text-gray-600">Вместимость: {entity.capacity}</p>
          </div>
          <DownloadPdf entity={entity} />
        </div>
      </div>
    </div>
  );
} 