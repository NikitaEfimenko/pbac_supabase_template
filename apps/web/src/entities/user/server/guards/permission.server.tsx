import 'server-only'
import { hasRole } from "@/entities/user/server/access"
import { ReactNode } from "react"
import { AppRole } from '@booking/infra/types'

type Props = {
  role: AppRole
  children: ReactNode
  fallback?: ReactNode
}

export async function RoleGuard({ role, children, fallback = null }: Props) {
  const allowed = await hasRole(role)
  return <>
   {allowed ? children : fallback}
  </>
}