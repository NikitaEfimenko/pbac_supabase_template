import { z } from 'zod';
import { CreateEntityDto } from './create-entity';

export const UpdateEntityDto = CreateEntityDto.partial();

export type UpdateEntityDtoType = z.infer<typeof UpdateEntityDto>; 