import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vigil - Keep Watch Over Your SaaS',
  description: 'Monitor your APIs, endpoints, and SSL certificates with instant alerts via Slack, Discord, or email.',
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