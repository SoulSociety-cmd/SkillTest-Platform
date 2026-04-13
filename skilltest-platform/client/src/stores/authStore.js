import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { api } from '../utils/api'
import { mountStoreDevtool } from 'simple-zustand-devtools'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,
      
      login: async (credentials, role = 'student') => {
        try {
          set({ loading: true })
          const endpoint = credentials.password ? '/auth/login' : '/auth/google'
          const res = await api.post(endpoint, credentials)
          
          const { token, user } = res.data
          localStorage.setItem('token', token)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          set({ user, token, loading: false })
          return { success: true, user }
        } catch (error) {
          set({ loading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Login failed' 
          }
        }
      },
      
      googleLogin: async (credential) => {
        try {
          set({ loading: true })
          const res = await api.post('/auth/google', { credential })
          const { token, user } = res.data
          
          localStorage.setItem('token', token)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          set({ user, token, loading: false })
          return { success: true, user }
        } catch (error) {
          set({ loading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Google login failed' 
          }
        }
      },
      
      register: async (data) => {
        try {
          set({ loading: true })
          const res = await api.post('/auth/register', data)
          const { token, user } = res.data
          
          localStorage.setItem('token', token)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          set({ user, token, loading: false })
          return { success: true, user }
        } catch (error) {
          set({ loading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Registration failed' 
          }
        }
      },
      
      fetchUser: async () => {
        try {
          set({ loading: true })
          const res = await api.get('/users/me')
          set({ user: res.data, loading: false })
          return res.data
        } catch (error) {
          get().logout()
          return null
        }
      },
      
      logout: () => {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        set({ user: null, token: null, loading: false })
      },
      
      init: () => {
        const token = localStorage.getItem('token')
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          get().fetchUser()
        } else {
          set({ loading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
)

if (typeof window !== 'undefined') {
  mountStoreDevtool('AuthStore', useAuthStore)
}

export default useAuthStore