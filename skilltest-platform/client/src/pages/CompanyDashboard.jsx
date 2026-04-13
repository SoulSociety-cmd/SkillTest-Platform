import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useTestStore } from '../stores/testStore'
import ProgressBar from '../components/ProgressBar'
import TestCard from '../components/TestCard'
import { 
  Users, 
  TrendingUp, 
  FileText,
  Filter,
  BarChart3 
} from 'lucide-react'

const CompanyDashboard = () => {
  const { user } = useAuthStore()
  const { fetchCompanyStats, tests, submissions, stats, loading } = useTestStore()

  useEffect(() => {
    fetchCompanyStats()
  }, [fetchCompanyStats])

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12 space-y-12">
      {/* Header */}
      <div className="glass p-8 rounded-3xl mb-12">
        <div className="flex items-center justify-between flex-col lg:flex-row lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-text-primary bg-clip-text text-transparent mb-2">
              Company Dashboard
            </h1>
            <p className="text-xl text-text-secondary">
              {user?.companyName || 'Your Company'} • {stats.totalCandidates || 0}+ candidates tested
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl">
              Create Test
            </button>
            <button className="p-3 bg-bg-secondary border border-border rounded-2xl hover:bg-primary/10 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass p-8 rounded-3xl text-center">
          <Users className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-text-primary mb-1">{stats.totalCandidates || 0}</div>
          <div className="text-text-secondary">Total Candidates</div>
        </div>
        
        <div className="glass p-8 rounded-3xl text-center">
          <FileText className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-text-primary mb-1">{stats.totalTests || 0}</div>
          <div className="text-text-secondary">Active Tests</div>
        </div>
        
        <div className="glass p-8 rounded-3xl text-center">
          <TrendingUp className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-text-primary mb-1">
            {stats.avgScore ? Math.round(stats.avgScore) + '%' : '0%'}
          </div>
          <div className="text-text-secondary">Avg Score</div>
        </div>
        
        <div className="glass p-8 rounded-3xl text-center">
          <BarChart3 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <ProgressBar 
            value={75} 
            label="Hiring Pipeline" 
            variant="gradient"
            size="lg"
            className="mt-4"
          />
        </div>
      </div>

      {/* Recent Tests & Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Tests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary flex items-center space-x-3">
              <FileText className="w-8 h-8" />
              <span>Your Tests</span>
            </h2>
            <span className="text-sm text-text-secondary bg-bg-secondary px-3 py-1 rounded-xl">
              {tests.length} active
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {tests.slice(0, 3).map((test) => (
              <TestCard key={test._id} test={test} />
            ))}
          </div>
        </div>

        {/* Top Candidates */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary flex items-center space-x-3">
            <Users className="w-8 h-8" />
            <span>Top Candidates</span>
          </h2>
          
          <div className="space-y-4">
            {submissions.slice(0, 5).map((submission, index) => (
              <div key={submission._id} className="glass p-6 rounded-2xl flex items-center justify-between group hover:shadow-xl transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{submission.user?.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-text-secondary">
                      <span>{submission.test?.title}</span>
                      <span>•</span>
                      <span>{Math.round(submission.score || 0)}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ProgressBar 
                    value={submission.score || 0} 
                    size="sm" 
                    className="w-24" 
                    showValue={false}
                  />
                  <button className="p-2 hover:bg-primary/10 rounded-xl transition-all group-hover:scale-110">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboard

