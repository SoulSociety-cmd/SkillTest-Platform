import { Link } from 'react-router-dom'
import { Clock, Star, Users, Play } from 'lucide-react'
import { useTestStore } from '../stores/testStore'

const TestCard = ({ test, variant = 'dashboard' }) => {
  const { updateAnswers } = useTestStore()
  
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'from-green-400 to-green-500 bg-green-100 dark:bg-green-900/50',
      medium: 'from-yellow-400 to-yellow-500 bg-yellow-100 dark:bg-yellow-900/50',
      hard: 'from-red-400 to-red-500 bg-red-100 dark:bg-red-900/50'
    }
    return colors[difficulty] || colors.medium
  }

  const formatDuration = (minutes) => {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  return (
    <Link
      to={`/test/${test._id}`}
      className="group relative bg-bg-card p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-border hover:border-primary/50 overflow-hidden h-full flex flex-col"
    >
      {/* Difficulty Badge */}
      <div className={`absolute top-6 right-6 px-4 py-2 rounded-2xl text-sm font-bold text-white shadow-lg group-hover:scale-105 transition-transform ${getDifficultyColor(test.difficulty)}`}>
        {test.difficulty?.toUpperCase()}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 pt-4">
        <div className="flex-1 pr-4">
          <h3 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {test.title}
          </h3>
          <p className="text-text-secondary line-clamp-2 mb-6">{test.description}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-6 space-x-6">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-text-secondary p-2 bg-bg-secondary rounded-xl">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(test.duration)}</span>
          </div>
          <div className="flex items-center space-x-1 text-text-secondary p-2 bg-bg-secondary rounded-xl">
            <Star className="w-4 h-4" />
            <span>{test.questions?.length || 0} Questions</span>
          </div>
        </div>
        
        {variant === 'dashboard' && test.submissionsCount && (
          <div className="flex items-center space-x-1 text-sm text-text-secondary p-2 bg-bg-secondary rounded-xl">
            <Users className="w-4 h-4" />
            <span>{test.submissionsCount} took</span>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="mt-auto flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-2 text-sm font-semibold text-primary/80 group-hover:text-primary">
          <span>Start Test</span>
          <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10" />
    </Link>
  )
}

export default TestCard

