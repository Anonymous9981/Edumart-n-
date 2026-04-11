import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Karom EduMart',
    short_name: 'EduMart',
    description: 'Premium education marketplace for students, schools, and vendors.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F3F7FF',
    theme_color: '#0B3558',
    lang: 'en',
    icons: [
      {
        src: '/brand/karom-edumart-mark.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/brand/karom-edumart-mark.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
      {
        src: '/brand/karom-edumart-mark.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'maskable',
      },
    ],
  }
}
