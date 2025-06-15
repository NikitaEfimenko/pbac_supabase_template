
import { appPermissionEnum, appRoleEnum } from '../schema'
import { createSupabaseClient } from './supabase'
import { jwtDecode } from 'jwt-decode'
import { redirect } from 'next/navigation'

type UserSession = {
  role: typeof appRoleEnum.enumValues[number]
  permissions: Array<typeof appPermissionEnum.enumValues[number]>
  user: {
    id: string
    email: string
  }
}

export async function getServerSession(): Promise<UserSession> {
  const supabase = await createSupabaseClient()

  // Достаём access_token и user
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  if (!session?.access_token || !user) {
    redirect('/auth')
  }

  const jwt = jwtDecode<{
    user_role: UserSession['role']
    user_permissions: UserSession['permissions']
  }>(session.access_token)

  return {
    role: jwt.user_role,
    permissions: jwt.user_permissions,
    user: {
      id: user.id,
      email: user.email || ''
    }
  }
}
