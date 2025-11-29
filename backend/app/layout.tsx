export const metadata = {
  title: 'CyberGuard Backend Test',
  description: 'Testing backend API endpoints',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

