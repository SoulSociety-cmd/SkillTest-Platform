'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Building2, Users, BarChart3, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Nav() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4 p-4">
        <div className="w-6 h-6 bg-primary rounded-full animate-pulse" />
      </div>
    )
  }

  return (
    <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            SkillTest
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {session ? (
              <>
                {/* Menu */}
                <div className="flex space-x-1">
                  {session.user?.role === 'company' ? (
                    <>
                      <Link href="/company/dashboard" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-1">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>

                      <Link href="/company/create-test" className="px-4 py-2 rounded-xl hover:bg-gray-100 flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>Create</span>
                      </Link>

                      <Link href="/company/candidates" className="px-4 py-2 rounded-xl hover:bg-gray-100 flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Candidates</span>
                      </Link>

                      <Link href="/company/analytics" className="px-4 py-2 rounded-xl hover:bg-gray-100 flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>Analytics</span>
                      </Link>
                    </>
                  ) : (
                    <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-1">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                </div>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 h-auto py-2 px-3 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}