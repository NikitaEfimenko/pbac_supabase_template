'use client'

import { Button } from "@/shared/ui/button"
import { FormAction } from "@/shared/ui/form-action"
import { Edit, PlusIcon } from "lucide-react"
import { EntityFormBody, EntityFormControls, EntityFormProvider } from "./form"

type CreateEntityDialogProps = {
  userId: string
  role: string
}

export const CreateEntityDialog = ({ userId, role }: CreateEntityDialogProps) => {
  return (
    <FormAction
      title="Creating an Entity"
      description="Fill out the form to create a new entity"
      formProviderComponent={(children) => (
        <EntityFormProvider userId={userId} role={role}>
          {children}
        </EntityFormProvider>
      )}
      formSlot={<EntityFormBody />}
      formControls={<EntityFormControls />}
      ctaSlot={
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
        Create Entity
        </Button>
      }
    />
  )
} 
