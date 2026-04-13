import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { useTestStore } from '../stores/testStore'
import ProgressBar from '../components/ProgressBar'
import TestCard from '../components/TestCard'
import { 
  DocumentPlusIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  UsersIcon,
  TrendingUpIcon 
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { 
    tests, 
    stats, 
    loading, 
    fetchDashboardData 
  } = useTestStore()

  useEffect(() => {
    if (user) {
      fetchDashboardData(user.role)
    }
  }, [user, fetchDashboardData])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 shadow-xl"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12 lg:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-text-primary via-slate-600 to-slate-800 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">{user?.name}</span>!
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          {user?.role === 'company' 
            ? 'Manage your skill tests and hiring pipeline' 
            : 'Discover & ace real-world coding challenges'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16">
        {/* Tests Count */}
        <div className="glass p-6 sm:p-8 rounded-3xl hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-2xl group-hover:scale-105 transition-all">
              <DocumentPlusIcon className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-1">Total Tests</p>
            <p className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-text-primary bg-clip-text text-transparent">
              {stats.totalTests || stats.availableTests || 0}
            </p>
          </div>
        </div>

        {/* Average Score */}
        <div className="glass p-6 sm:p-8 rounded-3xl hover:shadow-xl transition-all">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl">
              <ChartBarIcon className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <ProgressBar 
            value={user?.role === 'company' ? 78 : 85} 
            label="Performance" 
            variant={user?.role === 'company' ? 'success' : 'gradient'}
            size="lg"
            className="mb-4"
          />
          <p className="text-sm text-text-secondary text-center">{user?.role === 'company' ? 'Hiring Success' : 'Avg Score'}</p>
        </div>

        {/* Quick Action */}
        <div className="glass p-6 sm:p-8 rounded-3xl hover:shadow-xl group transition-all">
          <div className="flex items-center mb-6">
            {user.role === 'company' ? (
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl">
                <UsersIcon className="w-8 h-8 text-orange-600" />
              </div>
            ) : (
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl">
                <TrendingUpIcon className="w-8 h-8 text-purple-600" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-text-primary mb-3">{user.role === 'company' ? '42 Candidates' : 'Level Up'}</h3>
            <p className="text-text-secondary mb-6">{user.role === 'company' ? 'Waiting review' : 'Next milestone'}</p>
            <Link 
              to={user.role === 'company' ? '/company-dashboard' : '/profile'}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group-hover:bg-primary-700"
            >
              View {user.role === 'company' ? 'Candidates' : 'Profile'}
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {user.role === 'company' ? (
          <Link
            to="/create-test"
            className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-600 text-white p-12 lg:p-16 text-center"
          >
            <div className="relative z-10">
              <DocumentPlusIcon className="mx-auto w-24 h-24 mb-8 opacity-90 group-hover:opacity-100 group-hover:rotate-6 transition-all duration-700" />
              <h2 className="text-3xl lg:text-4xl font-black mb-6 drop-shadow-2xl">Create New Test</h2>
              <p className="text-xl lg:text-2xl text-primary-100/90 mb-10 leading-relaxed max-w-md mx-auto">
                Build custom coding assessments with AI grading & sandbox execution
              </p>
              <span className="text-2xl font-bold tracking-wide">Create Test →</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
          </Link>
        ) : (
          <div className="group rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-500 text-white p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <AcademicCapIcon className="mx-auto w-24 h-24 mb-8 opacity-90 group-hover:scale-110 transition-all duration-700" />
              <h2 className="text-3xl lg:text-4xl font-black mb-6 drop-shadow-2xl">Find Top Talent</h2>
              <p className="text-xl lg:text-2xl mb-10 leading-relaxed max-w-md mx-auto">
                Ace real-world challenges from leading companies. Showcase your skills.
              </p>
              <div className="text-4xl lg:text-5xl font-black text-emerald-100/90 drop-shadow-2xl tracking-tight">
                Ready to shine?
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10" />
          </div>
        )}
      </div>

      {/* Tests Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">Recent {user.role === 'company' ? 'Tests' : 'Challenges'}</h2>
            <p className="text-text-secondary text-lg">{user.role === 'company' ? 'Your published assessments' : 'Handpicked tests for you'}</p>
          </div>
          <Link 
            to="/dashboard" 
            className="hidden lg:inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${user.role === 'company' ? 3 : 2} gap-6`}>
          {tests.map((test) => (
            <TestCard key={test._id} test={test} />
          ))}
          
          {tests.length === 0 && (
            <div className="col-span-full glass p-20 rounded-3xl text-center group hover:shadow-xl transition-all">
              <div className="text-8xl opacity-20 group-hover:opacity-40 mb-8 mx-auto">🎯</div>
              <h3 className="text-3xl font-bold text-text-primary mb-4">
                {user.role === 'company' 
                  ? 'No tests yet. Create your first one!'
                  : 'No tests available yet'
                }
              </h3>
              <p className="text-xl text-text-secondary mb-10 max-w-md mx-auto">
                {user.role === 'company' 
                  ? 'Get started by creating your first skill assessment.'
                  : 'Check back soon for new challenges from top companies.'
                }
              </p>
              {user.role === 'company' && (
                <Link 
                  to="/create-test"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
                >
                  Create First Test
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

