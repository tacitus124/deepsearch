import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tusper',
  description: 'Deep research powered by AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">{children}</body>
    </html>
  )
}
