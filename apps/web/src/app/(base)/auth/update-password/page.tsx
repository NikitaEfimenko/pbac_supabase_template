'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"
import { updatePassword } from "../_actions/updatePassword"
import { useFormState, useFormStatus } from "react-dom"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [state, formAction] = useFormState(updatePassword, {
    error: null,
    success: false,
  })

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard')
    }
  }, [state.success])

  const status = useFormStatus()
  return <div className={cn('flex flex-col gap-6')}>
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>Please enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="New password"
                required
              />
            </div>
            {state.error && <p className="text-sm text-red-500">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={state.success}>
              {status.pending ? 'Saving...' : 'Save new password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
}