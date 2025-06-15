"use client"

import { useCallback, useMemo, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { Calendar } from "@/shared/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { cn } from "@/shared/lib/utils"
import { toast } from "sonner"

import { Entity } from "@/entities/entity/model/types"
import { reserveEntity as createReservation } from "@/entities/reservation/server/actions"
import { CreateReservationSchema, createReservationSchema } from "../model/schema"
import { calculatePrice } from "@/entities/reservation/utils"

interface BookingFormProps {
  entity: Entity
}

export function BookingForm({ entity }: BookingFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateReservationSchema>({
    resolver: zodResolver(createReservationSchema),
  })

  const calculatePriceInner = useCallback(() => {
    return calculatePrice(form.getValues().startTime, form.getValues().endTime)
  }, [form.getValues().startTime, form.getValues().endTime])

  const onSubmit = (data: CreateReservationSchema) => {
    startTransition(async () => {
      const result = await createReservation(entity.id, { error: null, success: false }, data)

      if (result.error) {
        toast.error("Ошибка", {
          description: typeof result.error === "string" ? result.error : "Проверьте правильность заполнения формы",
        })
        return
      }

      toast.success("Бронирование создано", {
        description: "Бронирование создано",
      })
      form.reset()
    })
  }

  const totalPrice = useMemo(() => calculatePriceInner(), [form.getValues().startTime, form.getValues().endTime])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Booking date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP", { locale: ru }) : "Select date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional wishes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your wishes for the event..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {totalPrice > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total to be paid:</span>
                  <span className="text-lg font-bold">{totalPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  hours × {(123).toLocaleString("ru-RU")} ₽/hour
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Processing..." : "Book"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
