import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import ThemeToggle from './ThemeToggle'
import { 
  Bell, 
  User, 
  ChevronDown, 
  Menu,
  X,
  Home,
  User as UserIcon,
  Building2,
  Award
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { isDark } = useThemeStore()
  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    ...(user?.role === 'company' 
      ? [{ name: 'Company', href: '/company-dashboard', icon: Building2 }]
      : []
    ),
    ...(user?.role === 'company' 
      ? [{ name: 'Create Test', href: '/create-test', icon: Award }]
      : []
    )
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsOpen(false)
  }

  return (
    <nav className="glass backdrop-blur-xl shadow-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex-shrink-0 flex items-center group">
            <div className="flex items-center h-12 w-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-xl group-hover:scale-105 transition-all">
              <span className="text-white font-bold text-xl drop-shadow-lg">S</span>
            </div>
            <span className="ml-4 text-2xl font-bold bg-gradient-to-r from-text-primary bg-clip-text text-transparent hidden lg:block">
              SkillTest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-2xl font-semibold transition-all relative
                  ${
                    location.pathname === item.href
                      ? 'bg-primary/10 text-primary shadow-md shadow-primary/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="w-px h-6 bg-border mx-2 lg:mx-4" />

            {/* Notifications */}
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-2xl transition-all relative group">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3 group cursor-pointer p-2 rounded-2xl hover:bg-bg-secondary transition-all">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="hidden lg:block">
                <div className="font-semibold text-text-primary">{user?.name}</div>
                <div className="text-xs uppercase font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {user?.role === 'company' ? 'Company' : 'Student'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-text-secondary transition-transform group-hover:rotate-180" />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle className="p-2" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-2xl hover:bg-bg-secondary transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold w-full
                  ${
                    location.pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }
                  transition-all
                `}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="px-4 py-3">
              <ThemeToggle />
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
