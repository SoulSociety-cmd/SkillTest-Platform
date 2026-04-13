import { CheckCircle, AlertCircle } from 'lucide-react'

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  label, 
  variant = 'primary', 
  size = 'md',
  showValue = true,
  animated = true,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const getVariantColors = (variant) => {
    const colors = {
      primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-primary-700 dark:from-primary-400 dark:to-primary-500',
      success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-emerald-700 dark:from-emerald-400 dark:to-emerald-500',
      warning: 'bg-gradient-to-r from-orange-500 to-orange-600 text-orange-700 dark:from-orange-400 dark:to-orange-500',
      error: 'bg-gradient-to-r from-red-500 to-red-600 text-red-700 dark:from-red-400 dark:to-red-500',
      gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-500 text-white shadow-lg shadow-purple-500/25'
    }
    return colors[variant] || colors.primary
  }

  const getSizeClasses = (size) => {
    const sizes = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
      xl: 'h-6'
    }
    return sizes[size] || sizes.md
  }

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-sm font-medium">
          <span className="text-text-primary">{label}</span>
          {showValue && (
            <span className="font-bold text-text-primary">
              {percentage.toFixed(0)}%
              {percentage === 100 && <CheckCircle className="w-4 h-4 ml-1 text-emerald-500 inline" />}
              {percentage < 30 && <AlertCircle className="w-4 h-4 ml-1 text-orange-500 inline" />}
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-bg-secondary rounded-full overflow-hidden shadow-inner">
        <div 
          className={`
            ${getSizeClasses(size)} 
            ${getVariantColors(variant)} 
            rounded-full shadow-md transition-all duration-1000 ease-out
            ${animated ? 'animate-slide-in' : ''}
            flex items-center justify-center text-xs font-bold
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax={max}
        >
          {showValue && percentage === 100 && (
            <CheckCircle className="w-4 h-4" />
          )}
        </div>
      </div>
      
      {showValue && !label && (
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>0%</span>
          <span className="font-mono font-bold">{percentage.toFixed(0)}%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar

