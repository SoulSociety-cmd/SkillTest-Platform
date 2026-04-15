import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillTest Platform - Test Real JS Skills',
  description: 'Real-world coding test platform for hiring',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/50 shadow-lg">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SkillTest
                </Link>
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-medium">
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
