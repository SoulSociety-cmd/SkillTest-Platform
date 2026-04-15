'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
  }

  if (!session) {
    router.push('/')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Welcome, {session.user?.name || session.user?.email}!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Take our JavaScript Calculator challenge. 15 minutes. Instant results.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border group hover:shadow-3xl transition-all">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-xl group-hover:scale-110 transition-transform">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Calculator Challenge</h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-lg mx-auto leading-relaxed">
            Implement <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm font-bold">calculate(a, op, b)</code>
            <br/>Supports +, -, *. 3 test cases. 15 minutes.
          </p>
          
          <Link href="/test/calculator-basic">
            <Button size="lg" className="w-full text-xl py-8 font-bold shadow-xl hover:shadow-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
              🚀 Start Challenge Now
            </Button>
          </Link>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-purple-200/50">
          <h3 className="text-2xl font-bold text-purple-900 mb-8 flex items-center justify-center space-x-3">
            📊 Your Stats
          </h3>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900 mb-2">0%</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900 mb-2">0</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Tests Taken</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-800">🔒 No Badge</div>
              <div className="text-xs text-purple-600 mt-1">Score 70%+ to unlock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
