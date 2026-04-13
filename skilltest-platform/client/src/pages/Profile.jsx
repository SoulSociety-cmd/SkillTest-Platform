import { useEffect, useState } from 'react'
import { useTestStore } from '../stores/testStore'
import SkillBadges from '../components/SkillBadge'
import ProgressBar from '../components/ProgressBar'
import TestCard from '../components/TestCard'
import { 
  User, 
  Award, 
  BarChart3,
  Share2,
  Download 
} from 'lucide-react'
import useAuthStore from '../stores/authStore'

const Profile = () => {
  const { user } = useAuthStore()
  const { fetchTestHistory, submissions, stats } = useTestStore()
  const [profileStats, setProfileStats] = useState({
    testsCompleted: 0,
    avgScore: 0,
    completionRate: 75,
    streak: 5
  })

  useEffect(() => {
    fetchTestHistory()
  }, [])

  useEffect(() => {
    if (submissions.length > 0) {
      const avgScore = submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length
      setProfileStats({
        testsCompleted: submissions.length,
        avgScore: Math.round(avgScore),
        completionRate: 85,
        streak: 7
      })
    }
  }, [submissions])

  const skills = [
    { name: 'JavaScript', level: 'advanced', description: '90% mastery', icon: 'JS' },
    { name: 'React', level: 'expert', description: '95% mastery', icon: 'React' },
    { name: 'Node.js', level: 'intermediate', description: '75% mastery', icon: 'Node' },
    { name: 'Python', level: 'beginner', description: '60% mastery', icon: 'Python' },
    { name: 'Fullstack', level: 'advanced', description: '88% mastery', icon: 'Fullstack' },
  ]

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user?.name}'s SkillTest Profile`,
        url: `${window.location.origin}/profile/${user?._id}`,
        text: `Check out my SkillTest profile! 🚀`
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/profile/${user?._id}`)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl text-white shadow-2xl mb-6">
          <User className="w-8 h-8 mr-3" />
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold">Welcome back!</h1>
            <p className="text-primary-100">{user.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* Overall Stats */}
          <div className="glass p-8 rounded-3xl space-y-6">
            <h2 className="flex items-center space-x-3 text-2xl font-bold text-text-primary">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              <span>Stats</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-text-primary">{profileStats.testsCompleted}</div>
                <div className="text-text-secondary">Tests Completed</div>
              </div>
              <ProgressBar 
                value={profileStats.avgScore} 
                label="Average Score" 
                variant="gradient" 
                size="lg"
                className="mt-2"
              />
              <ProgressBar 
                value={profileStats.completionRate} 
                label="Profile Completion" 
                variant="success"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-lg text-text-primary flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Share Profile</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={shareProfile}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="px-4 py-3 bg-bg-secondary border border-border rounded-2xl font-semibold hover:bg-primary/10 transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Skills & History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skills Badges */}
          <div className="glass p-8 rounded-3xl">
            <h2 className="flex items-center space-x-3 text-2xl font-bold text-text-primary mb-8">
              <Award className="w-9 h-9 text-amber-500 shadow-lg" />
              <span>Verified Skills</span>
            </h2>
            <SkillBadges skills={skills} />
          </div>

          {/* Recent Tests */}
          <div className="glass p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text-primary flex items-center space-x-3">
                <BarChart3 className="w-8 h-8" />
                <span>Test History</span>
              </h2>
              <span className="text-sm text-text-secondary">{submissions.length} tests</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submissions.slice(0, 4).map((submission) => (
                <TestCard 
                  key={submission._id} 
                  test={submission.test} 
                  variant="profile"
                />
              ))}
              {submissions.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl opacity-20 mb-4">📊</div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">No tests completed yet</h3>
                  <p className="text-text-secondary mb-6">Complete your first test to see your progress here</p>
                  <a href="/dashboard" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold hover:shadow-xl">
                    Browse Tests →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

