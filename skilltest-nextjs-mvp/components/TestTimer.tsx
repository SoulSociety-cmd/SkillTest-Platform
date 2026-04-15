'use client'

interface TestTimerProps {
  timeLeft: number
  onTimeout: () => void
}

export default function TestTimer({ timeLeft, onTimeout }: TestTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="font-mono text-3xl font-bold text-gray-900">
        {formatTime(timeLeft)}
      </div>
    </div>
  )
}
