'use client'

import { useSession } from "@/entities/user/hooks/use-session"

type Props = {
  role: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ role, children, fallback = null }: Props) {
  const session = useSession()
  
  if (!session || session.role !== role) {
    return fallback
  }

  return children
} 