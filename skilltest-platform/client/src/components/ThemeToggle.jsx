import { useThemeStore } from '../stores/themeStore'
import { 
  Moon, 
  Sun, 
  Monitor,
  Circle 
} from 'lucide-react'

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-2xl bg-bg-secondary border border-border 
        hover:bg-primary/10 hover:border-primary/50 hover:shadow-lg
        transition-all duration-300 group
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Toggle ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Active Theme Icon */}
      <div className="relative w-6 h-6">
        {/* Sun */}
        <Sun 
          className={`
            w-5 h-5 absolute transition-all duration-300 
            ${isDark ? 'opacity-20 scale-75 -rotate-90' : 'opacity-100 scale-100 rotate-0'}
            text-amber-400 shadow-lg
          `}
        />
        
        {/* Moon */}
        <Moon 
          className={`
            w-5 h-5 absolute transition-all duration-300 
            ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-20 scale-75 rotate-90'}
            text-slate-400 drop-shadow-lg
          `}
        />
        
        {/* Glow Effect */}
        <div className={`
          absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-50
          transition-opacity duration-300
          ${isDark 
            ? 'bg-gradient-to-r from-slate-400/30 to-slate-600/20 shadow-slate-500/20' 
            : 'bg-gradient-to-r from-amber-400/40 to-orange-400/30 shadow-amber-500/30'
          }
        `} />
        
        {/* System Preference Indicator */}
        {!isDark && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full ring-2 ring-white/50 animate-ping">
            <Monitor className="w-2 h-2 text-blue-100" />
          </div>
        )}
      </div>
      
      {/* Toggle Indicator */}
      <div className={`
        absolute -bottom-1 -right-1 w-2 h-2 rounded-full
        border-2 border-bg-card shadow-md
        transition-all duration-200
        ${isDark ? 'bg-slate-900 shadow-slate-900/50 translate-x-1' : 'bg-amber-400 shadow-amber-400/50 -translate-x-1'}
      `} />
    </button>
  )
}

export default ThemeToggle

