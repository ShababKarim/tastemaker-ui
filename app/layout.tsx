import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Tastemaker',
  description: 'Food & drink journal to track and share your favorite spots and dishes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="tastemaker">
      <body className="min-h-screen bg-base-100 text-base-content">
        <Navbar />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
