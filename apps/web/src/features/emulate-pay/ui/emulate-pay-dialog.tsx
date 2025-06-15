'use client'

import { Button } from "@/shared/ui/button"
import { FormAction } from "@/shared/ui/form-action"
import { Banknote } from "lucide-react"
import { DialogClose } from "@/shared/ui/dialog"
import { EmulatePayContols, EmulatePayFormProvider } from "./form"

type PayReservationDialogProps = {
  reservationId: string
}

export const PayReservationDialog = ({ reservationId }: PayReservationDialogProps) => {
  return (
    <FormAction
      title="(Mock action) Payment"
      description="(Mock action) Payment?"
      formProviderComponent={(children) => (
        <EmulatePayFormProvider reservationId={reservationId}>
          {children}
        </EmulatePayFormProvider>
      )}
      formSlot={<></>}
      formControls={<div className="flex gap-2">
        <DialogClose>
          <EmulatePayContols/>
        </DialogClose>
        <DialogClose>
          <Button variant="outline" type="button">Close</Button>
        </DialogClose>
      </div>}
      ctaSlot={
        <Button>
          <Banknote className="w-4 h-4 mr-2" />
          Pay
        </Button>
      }
    />
  )
} 
