'use client'

import { Button } from "@/shared/ui/button"
import { FormAction } from "@/shared/ui/form-action"
import { PencilIcon } from "lucide-react"
import { UpdateEntityFormBody, UpdateEntityFormControls, UpdateEntityFormProvider } from "./form"
import { Entity } from "@booking/infra/types"

type UpdateEntityDialogProps = {
  entity: Entity
}

export const UpdateEntityDialog = ({ entity }: UpdateEntityDialogProps) => {
  return (
    <FormAction
      title="Editing an Entity"
      description="Change entity data"
      formProviderComponent={(children) => (
        <UpdateEntityFormProvider 
          entityId={entity.id}
          defaultValues={{
            name: entity.name,
            address: entity.address,
            capacity: entity.capacity,
            imageUrl: entity.imageUrl ?? undefined,
            description: entity.description ?? undefined,
            priceSeed: entity.priceSeed.toString(),
          }}
        >
          {children}
        </UpdateEntityFormProvider>
      )}
      formSlot={<UpdateEntityFormBody />}
      formControls={<UpdateEntityFormControls />}
      ctaSlot={
        <Button variant="ghost" size="icon">
          <PencilIcon className="w-4 h-4" />
        </Button>
      }
    />
  )
} 