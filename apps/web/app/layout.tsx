import './globals.css'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'

import { MarketplaceProvider } from '../lib/marketplace-state'
import { SiteFeedbackProvider } from '../lib/site-feedback'
import { PwaRegister } from '../components/pwa-register'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Karom EduMart - Premium Education Marketplace',
  description: 'Buy and sell educational products with ease. Secure, trusted, scalable.',
  metadataBase: new URL('https://edumart.com'),
  manifest: '/manifest.webmanifest',
  applicationName: 'Karom EduMart',
  themeColor: '#0B3558',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Karom EduMart',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://edumart.com',
    siteName: 'EduMart',
    title: 'Karom EduMart - Premium Education Marketplace',
    description: 'Buy and sell educational products with ease. Secure, trusted, scalable.',
    images: [{ url: '/brand/karom-edumart-full.webp', width: 1024, height: 1024, alt: 'Karom EduMart social preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karom EduMart - Premium Education Marketplace',
    description: 'Buy and sell educational products with ease. Secure, trusted, scalable.',
    images: ['/brand/karom-edumart-full.webp'],
  },
  icons: {
    icon: '/brand/karom-edumart-mark.webp',
    apple: '/brand/karom-edumart-mark.webp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${spaceGrotesk.variable}`}>
        <PwaRegister />
        <MarketplaceProvider>
          <SiteFeedbackProvider>{children}</SiteFeedbackProvider>
        </MarketplaceProvider>
      </body>
    </html>
  )
}
