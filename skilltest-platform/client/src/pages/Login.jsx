import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import useAuthStore from '../stores/authStore'
import toast from 'react-hot-toast'
import { ArrowRight, Mail, Lock, UserPlus } from 'lucide-react'

const Login = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login, register: authRegister, googleLogin } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await (isRegister ? authRegister({ ...data, role }) : login({ ...data, role }))
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`)
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const result = await googleLogin(tokenResponse)
        if (result.success) {
          toast.success(`Welcome ${result.user.name}!`)
          navigate('/dashboard')
        }
      } catch (error) {
        toast.error('Google login failed')
      } finally {
        setLoading(false)
      }
    },
    onError: (error) => {
      toast.error('Google login failed. Please try again.')
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-md w-full space-y-8 glass shadow-2xl p-10 lg:p-12 rounded-4xl">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-text-primary bg-clip-text text-transparent mb-4">
            {isRegister ? 'Join SkillTest' : 'Welcome Back'}
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed">
            {isRegister ? 'Create your account to get started' : 'Sign in to your account'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email/Name */}
          <div>
            <label className="block text-lg font-bold text-text-primary mb-3 flex items-center space-x-2">
              {isRegister ? <UserPlus className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
              <span>{isRegister ? 'Full Name' : 'Email'}</span>
            </label>
            <input
              {...register(isRegister ? 'name' : 'email', { required: true })}
              type={isRegister ? 'text' : 'email'}
              className="w-full px-6 py-5 border-2 border-border rounded-3xl focus:ring-4 ring-primary/20 focus:border-primary shadow-xl text-lg placeholder:text-text-secondary font-semibold h-16"
              placeholder={isRegister ? 'John Doe' : 'you@example.com'}
            />
            {errors[isRegister ? 'name' : 'email'] && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>This field is required</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-bold text-text-primary mb-3 flex items-center space-x-2">
              <Lock className="w-6 h-6" />
              <span>Password</span>
            </label>
            <input
              {...register('password', { required: true })}
              type="password"
              className="w-full px-6 py-5 border-2 border-border rounded-3xl focus:ring-4 ring-primary/20 focus:border-primary shadow-xl text-lg placeholder:text-text-secondary font-semibold h-16"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                Password is required
              </p>
            )}
          </div>

          {/* Role - Register only */}
          {isRegister && (
            <div>
              <label className="block text-lg font-bold text-text-primary mb-3">Account Type</label>
              <select
                {...register('role')}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-6 py-5 border-2 border-border rounded-3xl focus:ring-4 ring-primary/20 focus:border-primary shadow-xl text-lg font-semibold h-16 appearance-none cursor-pointer"
              >
                <option value="student">👨‍💻 Candidate / Student</option>
                <option value="company">🏢 Company / Recruiter</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-50 shadow-2xl hover:shadow-4xl py-6 px-8 rounded-4xl text-xl font-black text-white transition-all duration-300 flex items-center justify-center space-x-4 h-20"
          >
            <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            {loading && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-border" />
          <span className="flex-shrink mx-6 text-text-secondary font-semibold">or continue with</span>
          <div className="flex-grow border-t border-border" />
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={() => googleLoginHandler()}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-4 px-8 py-6 border-2 border-border rounded-4xl shadow-xl hover:shadow-2xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 bg-bg-card backdrop-blur-sm group h-20"
        >
          <svg className="w-10 h-10 group-hover:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.83l2.66-2.07z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="font-semibold text-lg">Continue with Google</span>
        </button>

        {/* Toggle */}
        <div className="text-center pt-6">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xl font-bold text-primary hover:text-primary-dark transition-colors flex items-center space-x-2 mx-auto group"
          >
            <span>{isRegister ? 'Already have account?' : "Don't have an account?"}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

