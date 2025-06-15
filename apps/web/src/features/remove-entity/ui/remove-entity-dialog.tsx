
'use client'

import { Entity } from "@/entities/entity/model/types"
import { Button } from "@/shared/ui/button"
import { DialogClose } from "@/shared/ui/dialog"
import { FormAction } from "@/shared/ui/form-action"
import { Trash2Icon } from "lucide-react"
import { RemoveEntityFormControls, RemoveEntityFormProvider } from "./form"

type RemoveEntityDialogProps = {
  entityId: Entity["id"]
}

export const RemoveEntityDialog = ({
  entityId
}: RemoveEntityDialogProps) => {

  return <FormAction
    ctaSlot={<Button variant="destructive" size="icon">
      <Trash2Icon size={14} />
    </Button>}
    title="Remove?"
    description="Remove entity?"
    formControls={<div className="flex gap-2">
      <DialogClose>
        <RemoveEntityFormControls />
      </DialogClose>
      <DialogClose>
        <Button type="button">Close</Button>
      </DialogClose>
    </div>}
    formSlot={<></>}
    formProviderComponent={body => <RemoveEntityFormProvider entityId={entityId}>{body}</RemoveEntityFormProvider>}
  />
}