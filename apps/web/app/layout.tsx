import './globals.css'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'

import { MarketplaceProvider } from '../lib/marketplace-state'
import { SiteFeedbackProvider } from '../lib/site-feedback'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'EduMart - Premium Education Marketplace',
  description: 'Buy and sell educational products with ease. Secure, trusted, scalable.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://edumart.com',
    siteName: 'EduMart',
  },
  icons: {
    icon: '/favicon.ico',
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
        <MarketplaceProvider>
          <SiteFeedbackProvider>{children}</SiteFeedbackProvider>
        </MarketplaceProvider>
      </body>
    </html>
  )
}
