import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CyberGuard AI - Anti-Scam Protection',
  description: 'AI-powered Anti-Scam Web Application',
  icons: {
    icon: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  )
}


