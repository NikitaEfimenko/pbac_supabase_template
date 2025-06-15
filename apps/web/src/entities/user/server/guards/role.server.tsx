import 'server-only'
import { getServerSession } from "@booking/infra/server/get-session"
import { hasPermissions } from "@/entities/user/server/access"
import { ReactNode } from "react"

type Props = {
  permissions: string[]
  children: ReactNode
  fallback?: ReactNode
}

export async function PermissionsGuard({ permissions, children, fallback = null }: Props) {
  const allowed = await hasPermissions(permissions)
  return allowed ? children : fallback
}
