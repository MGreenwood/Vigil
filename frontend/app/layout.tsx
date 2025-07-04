import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vigil - Keep Watch Over Your SaaS',
  description: 'Vigil is a developer-focused monitoring platform that alerts you to downtime, webhook failures, and SSL expirations so you can serve your customers better, even while you sleep.',
  keywords: ['monitoring', 'uptime', 'alerts', 'webhooks', 'SSL certificates', 'API monitoring', 'developer tools', 'SaaS monitoring'],
  authors: [{ name: 'Vigil Team' }],
  creator: 'Vigil',
  publisher: 'Vigil',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vigil.example.com'), // Update this with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vigil.example.com', // Update this with your actual domain
    title: 'Vigil - Keep Watch Over Your SaaS',
    description: 'Vigil is a developer-focused monitoring platform that alerts you to downtime, webhook failures, and SSL expirations so you can serve your customers better, even while you sleep.',
    siteName: 'Vigil',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Vigil - SaaS Monitoring Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vigil - Keep Watch Over Your SaaS',
    description: 'Vigil is a developer-focused monitoring platform that alerts you to downtime, webhook failures, and SSL expirations so you can serve your customers better, even while you sleep.',
    images: ['/logo.png'],
    creator: '@vigilofficial.bsky.social', // Bluesky handle
    site: '@vigilofficial.bsky.social', // Bluesky handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral">
        {children}
      </body>
    </html>
  )
} 