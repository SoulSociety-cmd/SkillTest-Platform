import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Nav from '@/components/Nav'
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

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
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={inter.className}>
        <Providers>
          <Nav />
          <main className="min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}