'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, Share2 } from 'lucide-react'

interface TestResult {
  score: number
  passed: number
  total: number
  results: Array<{
    passed: boolean
    input: [number, string, number]
    expected: number
    output?: number
  }>
  badge: string
}

export default function ResultsPage() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  
  const submissionId = params.id as string

  useEffect(() => {
    fetch(`/api/submissions?id=${submissionId}`)
      .then(res => res.json())
      .then(data => {
        setResult(data)
        setLoading(false)
      })
  }, [submissionId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!result) {
    return <div className="text-center py-24 text-gray-600">Results not found</div>
  }

  const scorePercent = result.score

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Score Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 mb-12 text-center">
          <div className={`inline-flex items-center px-12 py-8 rounded-3xl shadow-2xl mb-8 ${
            scorePercent >= 70 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-600'
          } text-white`}>
            <CheckCircle className="w-16 h-16 mr-6" />
            <div>
              <div className="text-6xl font-black">{scorePercent}%</div>
              <div className="text-2xl opacity-90">{result.passed}/{result.total} tests</div>
            </div>
          </div>
          
          <div className="text-3xl font-bold text-gray-900 mb-4">Calculator Challenge</div>
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-8 py-4 rounded-2xl inline-block font-bold text-xl">
            {result.badge}
          </div>
        </div>

        {/* Test Cases */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {result.results.map((r, i) => (
            <div key={i} className={`p-6 rounded-2xl shadow-xl ${
              r.passed 
                ? 'bg-emerald-50 border-4 border-emerald-200' 
                : 'bg-red-50 border-4 border-red-200'
            }`}>
              <div className={`text-3xl mb-4 ${r.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                {r.passed ? '✅' : '❌'}
              </div>
              <div className="font-mono text-lg mb-4 p-4 bg-white rounded-xl">
                <code>{r.input.join(' ')} = {r.expected}</code>
              </div>
              {r.output !== undefined && (
                <div className="text-sm text-gray-600">
                  Your output: <code>{r.output}</code>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Matching */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🎯 Job Matching</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {scorePercent >= 70 ? (
              <>
                <div className="p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
                  <h3 className="text-2xl font-bold text-emerald-900 mb-4">Junior Frontend Dev</h3>
                  <p className="text-lg mb-6">Your calculator score qualifies you!</p>
                  <Button className="w-full">Apply Now →</Button>
                </div>
                <div className="p-8 bg-blue-50 rounded-2xl border-2 border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">React Developer</h3>
                  <p className="text-lg mb-6">Strong JS fundamentals shown.</p>
                  <Button variant="outline" className="w-full">View Jobs</Button>
                </div>
              </>
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-6xl mb-6">📈</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Score 70%+ to Unlock Jobs</h3>
                <Button onClick={() => router.push('/test/calculator-basic')} size="lg">
                  Retake Challenge
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-12">
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="lg" className="px-12">
            <Share2 className="w-5 h-5 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  )
}
