import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Booking Template',
    short_name: 'Booking Template',
    description: 'Booking Template',
    start_url: '/',
    display: 'standalone',
    background_color: '#000',
    theme_color: '#000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}

export const routes = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
  },
  entities: {
    list: '/entities',
    create: '/entities/create',
    details: (id: string) => `/entities/${id}`,
  },
  dashboard: {
    entities: '/dashboard/entities',
  }
} as const;