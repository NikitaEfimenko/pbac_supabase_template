import 'server-only'

import { getServerSession } from "@booking/infra/server/get-session"

export async function hasPermissions(permissions: string[]) {
  const session = await getServerSession()
  if (!session?.user.id) return false

  return session.permissions.some(permission => permissions.includes(permission))
}

export async function hasRole(role: string) {
  const session = await getServerSession()
  if (!session?.user.id) return false

  return session.role === role
}