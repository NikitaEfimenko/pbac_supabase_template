import { z } from "zod"

export const createReservationSchema = z.object({
  date: z.date({
    required_error: "Выберите дату бронирования",
  }),
  startTime: z.string({
    required_error: "Выберите время начала",
  }),
  endTime: z.string({
    required_error: "Выберите время окончания",
  }),
  notes: z.string().optional(),
})

export type CreateReservationSchema = z.infer<typeof createReservationSchema> 