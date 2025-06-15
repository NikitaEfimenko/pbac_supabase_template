import { z } from 'zod';

export const CreateEntityDto = z.object({
  name: z.string().min(3, 'Название должно быть не менее 3 символов'),
  address: z.string().min(5, 'Адрес должен быть не менее 5 символов'),
  capacity: z.number().min(1, 'Вместимость должна быть больше 0'),
  imageUrl: z.string().url('Некорректный URL').optional(),
  description: z.string().optional(),
  priceSeed: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Некорректная цена'),
});

export type CreateEntityDtoType = z.infer<typeof CreateEntityDto>; 