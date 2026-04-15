'use client'

import { useEffect, useState, useCallback } from 'react'
import MonacoEditor from '@/components/MonacoEditor'
import TestTimer from '@/components/TestTimer'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { gradeCalculator } from '@/lib/grader'
import { Play, CheckCircle, Clock } from 'lucide-react'

export default function TestPage() {
  const [code, setCode] = useState('function calculate(a, op, b) {\n  // Your code here\n  // Support +, -, *\n  // Return the result\n}')
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15min
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  
  const testId = params.id as string

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleTimeout = async () => {
    setIsRunning(false)
    const submissionId = await submitTest()
    router.push(`/results/${submissionId}`)
  }

  const handleGrade = async () => {
    setIsSubmitting(true)
    try {
      const gradeResult = await gradeCalculator(code)
      setResults(gradeResult)
    } catch (error) {
      console.error('Grading error', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitTest = async () => {
    // Simulate submission to /api/submissions
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        testId, 
        code, 
        score: results?.score || 0,
        userId: session?.user?.id 
      })
    })
    const data = await res.json()
    return data.id
  }

  const getBadge = (score: number) => {
    if (score >= 90) return 'Senior JS Dev 🏆'
    if (score >= 70) return 'Junior JS Ready ✅'
    return 'Keep Practicing 💪'
  }

  if (!session) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 flex items-center justify-between">
          <TestTimer timeLeft={timeLeft} onTimeout={handleTimeout} />
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setIsRunning(!isRunning)} 
              variant={isRunning ? 'secondary' : 'default'}
              size="lg"
            >
              {isRunning ? '⏸️ Pause' : '▶️ Start Timer'}
            </Button>
            {results && (
              <div className="px-6 py-3 bg-emerald-100 text-emerald-800 font-bold rounded-2xl">
                {results.score}%
              </div>
            )}
          </div>
        </div>

        {/* Challenge */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Calculator Challenge</h1>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl border-2 border-yellow-200 mb-8">
            <p className="text-xl font-semibold mb-4">
              <code className="bg-yellow-200 px-3 py-1 rounded-lg font-mono">function calculate(a, op, b)</code>
            </p>
            <ul className="space-y-2 text-lg">
              <li>• <strong>+</strong> 2 + 2 = 4</li>
              <li>• <strong>-</strong> 5 - 3 = 2</li>
              <li>• <strong>*</strong> 4 * 3 = 12</li>
            </ul>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8">
          <MonacoEditor 
            value={code} 
            onChange={setCode} 
            height="500px" 
          />
        </div>

        {/* Action + Results */}
        <div className="space-y-6">
          <Button 
            onClick={handleGrade}
            disabled={!isRunning || isSubmitting}
            size="lg"
            className="w-full justify-center px-12 text-xl py-8 font-bold shadow-2xl"
          >
            <Play className="w-6 h-6 mr-3" />
            {isSubmitting ? 'Grading...' : `Run Tests (${results ? results.passed + '/' + results.total : '3'})`}
          </Button>

          {results && (
            <div className="p-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-3xl">
              <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center space-x-3">
                <CheckCircle className="w-8 h-8" />
                <span>Results: {results.score}% ({getBadge(results.score)})</span>
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {results.results.map((result: any, i: number) => (
                  <div key={i} className={`p-4 rounded-xl text-center ${
                    result.passed 
                      ? 'bg-emerald-100 border-2 border-emerald-400' 
                      : 'bg-red-100 border-2 border-red-400'
                  }`}>
                    <div className={`text-2xl font-bold mb-2 ${result.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                      {result.passed ? '✅' : '❌'}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Test {i+1}</div>
                    <div className="font-mono bg-white px-3 py-1 rounded-lg mb-2">
                      {result.input.join(' ')}
                    </div>
                    <div className="text-sm">Expected: <code>{result.expected}</code></div>
                    {result.output !== undefined && (
                      <div className="text-sm">Got: <code>{result.output}</code></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
