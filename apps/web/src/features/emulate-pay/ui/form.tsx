
'use client'

import { FC, ReactNode, useEffect, useRef } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { toast } from "sonner"

import { Button } from "@/shared/ui/button"

import { pay } from "@/entities/reservation/server/actions"
import { Reservation } from "@booking/infra/types"

type ReservationProps = {
  reservationId: Reservation["id"],
  children: ReactNode
}

export const EmulatePayContols = () => {
  const { pending } = useFormStatus()

  return <>
    <Button disabled={pending} type="submit">
      {pending ? 'Payment...' : 'Pay'}
    </Button>
  </>
}

export const EmulatePayFormProvider: FC<ReservationProps> = ({
  reservationId,
  children
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const serverAction = pay.bind(null, reservationId)
  const [state, action] = useFormState(serverAction, {
    error: null,
    success: false,
    data: null
  })

  useEffect(() => {
    if (state.success) {
      toast.success("Reservation paid", {
        description: state.data
      })
    }
    if (state.error) {
      toast.error("Error", {
        description: state.error
      })
    }
  }, [state])

  return <form
      ref={formRef}
      action={action}
      className="space-y-4"
    >
      {children}
    </form>
} 