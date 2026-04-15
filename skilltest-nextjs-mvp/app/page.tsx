'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 text-center">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-20 rounded-3xl shadow-2xl mb-12">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
          Test Real JS Skills
        </h1>
        <p className="text-2xl opacity-90 mb-12 max-w-2xl mx-auto">
          Build a calculator in 15 minutes. Get instant grading and job matching.
        </p>
        {!session && (
          <div className="space-x-4">
            <Button 
              onClick={() => signIn('credentials', { callbackUrl: '/dashboard' })} 
              size="lg" 
              className="px-12 py-8 text-xl font-bold bg-white text-gray-900 hover:bg-gray-50 shadow-xl"
            >
              Start Free Test
            </Button>
            <Button 
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })} 
              size="lg" 
              variant="outline"
              className="px-12 py-8 text-xl font-bold border-white/50 bg-white/10 backdrop-blur-xl"
            >
              Sign in with Google
            </Button>
          </div>
        )}
        {session && (
          <Button 
            onClick={() => router.push('/dashboard')} 
            size="lg" 
            className="px-12 py-8 text-xl font-bold bg-white text-gray-900 hover:bg-gray-50 shadow-xl"
          >
            Go to Dashboard →
          </Button>
        )}
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 text-left">
        <div className="p-8 rounded-2xl border bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">AI Grading</h3>
          <p>3 test cases run automatically. Get score + feedback instantly.</p>
        </div>
        
        <div className="p-8 rounded-2xl border bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">15min Challenge</h3>
          <p>Strict timer. Real-world pressure. Build calculator function.</p>
        </div>
        
        <div className="p-8 rounded-2xl border bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Job Matching</h3>
          <p>High score = job badges + recommendations.</p>
        </div>
      </div>
      
      {session && (
        <div className="mt-20 p-8 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-3xl shadow-2xl text-center">
          <p className="text-2xl font-bold mb-4">Welcome back, {session.user?.name || session.user?.email}!</p>
          <Button onClick={() => router.push('/dashboard')} size="lg" className="px-12">
            Continue Testing
          </Button>
        </div>
      )}
    </div>
  )
}
