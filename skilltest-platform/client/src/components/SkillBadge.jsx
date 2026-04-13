import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { BadgeCheck, Zap, Shield, Code2 } from 'lucide-react'

const SkillBadges = ({ skills, layout = 'grid' }) => {
  const skillIcons = {
    javascript: Code2,
    react: <Code2 className="rotate-12" />,
    python: Shield,
    nodejs: Zap,
    'fullstack': BadgeCheck
  }

  const getLevelColor = (level) => {
    const colors = {
      beginner: 'from-blue-400 to-blue-500 ring-blue-200/50 dark:ring-blue-800/50',
      intermediate: 'from-emerald-400 to-emerald-500 ring-emerald-200/50 dark:ring-emerald-800/50',
      advanced: 'from-purple-400 to-purple-500 ring-purple-200/50 dark:ring-purple-800/50',
      expert: 'from-orange-400 to-orange-500 ring-orange-200/50 dark:ring-orange-800/50'
    }
    return colors[level] || colors.beginner
  }

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${layout === 'row' ? 'flex flex-wrap gap-3' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
        {skills.map((skill, index) => (
          <Tooltip key={skill.name || index}>
            <TooltipTrigger asChild>
              <div className={`group relative p-4 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-gradient-to-br bg-bg-card border border-border hover:border-primary/50 w-full h-24 flex flex-col items-center justify-center hover:scale-[1.02] ${getLevelColor(skill.level)}`}>
                <div className="w-10 h-10 mb-3 p-2 bg-white/20 dark:bg-black/20 rounded-2xl group-hover:bg-white/40 backdrop-blur-sm shadow-inner flex items-center justify-center">
                  {skill.icon || skillIcons[skill.name.toLowerCase()] || <Code2 className="w-6 h-6 opacity-80" />}
                </div>
                <div className="text-center">
                  <span className="font-bold text-sm bg-gradient-to-r from-text-primary bg-clip-text text-transparent drop-shadow-sm">
                    {skill.name}
                  </span>
                  <div className="flex items-center justify-center mt-1 space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-ping" />
                    <span className="text-xs font-medium capitalize text-text-secondary">
                      {skill.level}
                    </span>
                  </div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10 animate-pulse" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-bg-card border border-border shadow-2xl rounded-2xl px-4 py-2 text-sm font-medium text-text-primary">
              {skill.description || `${skill.name} - ${skill.level} level verified`}
              <div className="w-2 h-2 bg-primary-500 rounded-full mx-auto mt-1 animate-ping" />
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

export default SkillBadges

