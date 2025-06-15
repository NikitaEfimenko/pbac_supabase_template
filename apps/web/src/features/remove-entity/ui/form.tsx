'use client'

import { FC, ReactNode, useEffect, useRef } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/shared/ui/button"

import { Entity } from "@/entities/entity/model/types"
import { deleteEntity } from "@/entities/entity/server/actions"


export const RemoveEntityFormControls = () => {
  const { pending } = useFormStatus()

  return <>
    <Button disabled={pending} type="submit" variant="destructive">
      {pending ? 'Deleting...' : 'Delete'}
    </Button>
  </>
}

type RemoveEntityFormProviderProps = {
  children: ReactNode
  entityId: Entity["id"]
}

export const RemoveEntityFormProvider: FC<RemoveEntityFormProviderProps> = ({
  children,
  entityId
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const serverAction = deleteEntity.bind(null, entityId)
  const [state, action] = useFormState(serverAction, {
    error: null,
    success: false,
    data: null
  })

  useEffect(() => {
    if (state.success) {
      toast.success("Entity deleted", {
        description: state.data?.name
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