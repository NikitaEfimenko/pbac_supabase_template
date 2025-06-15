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

import { CreateEntityDto, CreateEntityDtoType } from "@/entities/entity/dto/create-entity"
import { createEntity } from "@/entities/entity/server/actions"

export const EntityFormBody = () => {
  const form = useFormContext<CreateEntityDtoType>()

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

export const EntityFormControls = () => {
  const form = useFormContext<CreateEntityDtoType>()
  const { pending } = useFormStatus()
  const errors = Object.values(form.formState.errors)

  return <>
    <Button disabled={pending || errors.length > 0} type="submit">
      {pending ? 'Creating...' : 'Create'}
    </Button>
  </>
}

type EntityFormProviderProps = {
  children: ReactNode
  userId: string
  role: string
  defaultValues?: Partial<CreateEntityDtoType>
}

export const EntityFormProvider: FC<EntityFormProviderProps> = ({
  children,
  userId,
  role,
  defaultValues = {}
}) => {
  const form = useForm<CreateEntityDtoType>({
    resolver: zodResolver(CreateEntityDto),
    defaultValues,
    mode: "all"
  })

  const formRef = useRef<HTMLFormElement>(null)
  const serverAction = createEntity.bind(null)
  const [state, action] = useFormState(serverAction, {
    error: null,
    success: false,
    data: null
  })

  useEffect(() => {
    if (state.success) {
      toast.success("Entity created", {
        description: state.data?.name
      })
      form.reset()
    }
    if (state.error) {
      toast.error("Error", {
        description: state.error
      })
    }
  }, [state, form])

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