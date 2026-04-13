import { create } from 'zustand'
import { api } from '../utils/api'

export const useTestStore = create((set, get) => ({
  tests: [],
  submissions: [],
  stats: {},
  currentTest: null,
  loading: false,
  
  // Dashboard data
  fetchDashboardData: async (role) => {
    try {
      set({ loading: true })
      const endpoint = role === 'company' ? '/tests?company=true&limit=5' : '/tests?limit=5'
      const res = await api.get(endpoint)
      
      set({ 
        tests: res.data, 
        stats: role === 'company' 
          ? { totalTests: res.data.length } 
          : { availableTests: res.data.length },
        loading: false 
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      set({ loading: false })
    }
  },
  
  // Single test
  fetchTest: async (testId) => {
    try {
      const res = await api.get(`/tests/${testId}`)
      set({ currentTest: res.data })
      return res.data
    } catch (error) {
      console.error('Failed to fetch test:', error)
    }
  },
  
  // Company dashboard
  fetchCompanyStats: async () => {
    try {
      const [testsRes, submissionsRes] = await Promise.all([
        api.get('/tests?company=true'),
        api.get('/submissions?company=true&limit=10')
      ])
      set({
        tests: testsRes.data,
        submissions: submissionsRes.data,
        stats: {
          totalTests: testsRes.data.length,
          totalCandidates: submissionsRes.data.length,
          avgScore: submissionsRes.data.reduce((sum, s) => sum + (s.score || 0), 0) / submissionsRes.data.length || 0
        }
      })
    } catch (error) {
      console.error('Failed to fetch company stats:', error)
    }
  },
  
  // Profile history
  fetchTestHistory: async (limit = 10) => {
    try {
      const res = await api.get(`/submissions?user=true&limit=${limit}&sort=-submittedAt`)
      set({ submissions: res.data })
    } catch (error) {
      console.error('Failed to fetch test history:', error)
    }
  },
  
  createTest: async (testData) => {
    try {
      const res = await api.post('/tests', testData)
      set((state) => ({
        tests: [...state.tests, res.data]
      }))
      return res.data
    } catch (error) {
      console.error('Failed to create test:', error)
      throw error
    }
  },
  
  updateAnswers: (testId, questionIndex, code) => {
    set((state) => ({
      currentTest: {
        ...state.currentTest,
        questions: state.currentTest.questions.map((q, i) =>
          i === parseInt(questionIndex) ? { ...q, userAnswer: code } : q
        )
      }
    }))
  },
  
  clearTest: () => set({ currentTest: null }),
  
  setLoading: (loading) => set({ loading })
}))
