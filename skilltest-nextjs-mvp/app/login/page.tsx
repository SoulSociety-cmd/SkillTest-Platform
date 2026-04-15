'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Login() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border">
        <h1 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Sign In
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => signIn('credentials', { 
              email: 'test@test.com', 
              password: 'test123',
              callbackUrl: '/dashboard'
            })}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-xl transition-all shadow-lg"
          >
            🎯 Quick Test (test@test.com / test123)
          </button>
          
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full border-2 border-gray-200 bg-white font-bold py-4 px-8 rounded-2xl hover:shadow-lg transition-all hover:border-gray-300"
          >
            🌐 Continue with Google
          </button>
        </div>
        
        <p className="text-center text-sm text-gray-600 mt-8">
          No account? Just use the test credentials above!
        </p>
      </div>
    </div>
  )
}
