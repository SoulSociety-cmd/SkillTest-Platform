'use client'

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, Play, AlertCircle } from 'lucide-react';

interface ProgressGraderProps {
  onSubmit: (submissionId: string) => void;
}

export default function ProgressGrader({ onSubmit }: ProgressGraderProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState<any>(null);
  const [sse, setSse] = useState<EventSource | null>(null);

  useEffect(() => {
    return () => {
      sse?.close();
    };
  }, [sse]);

  const startGrading = () => {
    setStatus('grading');
    setProgress(0);
    
    const eventSource = new EventSource('/api/submit');
    setSse(eventSource);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.progress !== undefined) {
        setProgress(data.progress);
        setStatus(data.status || 'running');
      }
      
      if (data.final) {
        setResult(data);
        setStatus('complete');
        eventSource.close();
        onSubmit(data.id);
      }
    };
    
    eventSource.onerror = () => {
      setStatus('error');
      eventSource.close();
    };
  };

  const STEPS = [
    { percent: 10, label: '🚀 Docker Sandbox' },
    { percent: 40, label: '🧪 Unit Tests' },
    { percent: 60, label: '🎭 Playwright E2E' },
    { percent: 80, label: '🤖 OpenAI Review' },
    { percent: 100, label: '✅ Complete!' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Production Test Engine
      </h3>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          {STEPS.map((step, i) => (
            <div key={i} className={`flex items-center space-x-1 ${progress >= step.percent ? 'text-emerald-600 font-semibold' : ''}`}>
              <div className={`w-2 h-2 rounded-full ${progress >= step.percent ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <span>{step.label}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right text-sm font-mono mt-1">{progress}%</div>
      </div>

      {/* Status */}
      {status === 'idle' && (
        <div className="text-center py-12">
          <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Ready to run production tests</p>
          <button 
            onClick={startGrading}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 text-lg"
          >
            🚀 Run Production Tests
          </button>
        </div>
      )}

      {status === 'grading' && (
        <div className="text-center py-12">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 mb-4">Running production grading pipeline...</p>
        </div>
      )}

      {status === 'complete' && result && (
        <div className="text-center py-12">
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 mb-4">
            {result.score}%
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">{result.badge}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-sm">
            <div className="p-4 bg-emerald-50 rounded-xl">
              <div className="font-bold text-emerald-700">{result.unitPassed}/{result.unitTotal}</div>
              <div className="text-emerald-600">Unit Tests</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="font-bold text-blue-700">{result.playwrightPassed}</div>
              <div className="text-blue-600">E2E Tests</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="font-bold text-purple-700">{result.eslintScore}%</div>
              <div className="text-purple-600">Code Quality</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-xl">
              <div className="font-bold text-indigo-700">+{result.aiBonus}</div>
              <div className="text-indigo-600">AI Bonus</div>
            </div>
          </div>
          <p className="mt-6 text-gray-700 italic max-w-md mx-auto">{result.feedback}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 mb-4">Grading failed. Please try again.</p>
          <button 
            onClick={startGrading}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

