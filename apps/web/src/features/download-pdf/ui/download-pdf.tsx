'use client';

import { useState } from 'react';
import { generatePdf } from '../server/actions';
import { Button } from '@/shared/ui/button';
import { Entity } from '@/entities/entity/model/types';
import { toast } from 'sonner';

interface Props {
  entity: Entity;
}

export function DownloadPdf({ entity }: Props) {
  const [base64pdf, setBase64pdf] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);

    const { data: base64, error } = await generatePdf(entity.id, {
      error: null,
      success: false,
    });

    setPending(false);

    if (error) {
      toast.error(error);
      return;
    }

    if (base64) {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${base64}`;
      link.download = `${entity.name}.pdf`;
      link.click();
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Button variant="outline" type="submit" disabled={pending}>
        {pending ? 'Processing...' : 'Download PDF'}
      </Button>
    </form>
  );
}