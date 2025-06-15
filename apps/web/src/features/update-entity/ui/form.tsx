'use client'

import { FC, ReactNode, useEffect, useRef } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { useFormState, useFormStatus } from "react-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"

import { UpdateEntityDto, UpdateEntityDtoType } from "@/entities/entity/dto/update-entity"
import { updateEntity } from "@/entities/entity/server/actions"
import { Entity } from "@booking/infra/types"

export const UpdateEntityFormBody = () => {
  const form = useFormContext<UpdateEntityDtoType>()

  return <>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Adress</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="capacity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Capacity</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              {...field} 
              onChange={e => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image URL</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="priceSeed"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Price seed</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
}

export const UpdateEntityFormControls = () => {
  const form = useFormContext<UpdateEntityDtoType>()
  const { pending } = useFormStatus()
  const errors = Object.values(form.formState.errors)

  return <>
    <Button disabled={pending || errors.length > 0} type="submit">
      {pending ? 'Updating...' : 'Update'}
    </Button>
  </>
}

type UpdateEntityFormProviderProps = {
  children: ReactNode
  entityId: Entity["id"]
  defaultValues: UpdateEntityDtoType
}

export const UpdateEntityFormProvider: FC<UpdateEntityFormProviderProps> = ({
  children,
  entityId,
  defaultValues
}) => {
  const form = useForm<UpdateEntityDtoType>({
    resolver: zodResolver(UpdateEntityDto),
    defaultValues,
    mode: "all"
  })

  const formRef = useRef<HTMLFormElement>(null)
  const serverAction = updateEntity.bind(null, entityId)
  const [state, action] = useFormState(serverAction, {
    error: null,
    success: false,
    data: null
  })

  useEffect(() => {
    if (state.success) {
      toast.success("Entity updated", {
        description: state.data?.name
      })
    }
    if (state.error) {
      toast.error("Error", {
        description: state.error
      })
    }
  }, [state])

  return <Form {...form}>
    <form
      ref={formRef}
      action={action}
      className="space-y-4"
    >
      {children}
    </form>
  </Form>
} 