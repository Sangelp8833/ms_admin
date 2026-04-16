import { create } from 'zustand'

interface AuthState {
  token: string | null
  adminId: string | null
  email: string | null
  setAuth: (token: string, adminId: string, email: string) => void
  clearAuth: () => void
}

const TOKEN_KEY = 'admin_token'

export const useAuthStore = create<AuthState>((set) => ({
  token:   localStorage.getItem(TOKEN_KEY),
  adminId: localStorage.getItem('admin_id'),
  email:   localStorage.getItem('admin_email'),

  setAuth: (token, adminId, email) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem('admin_id', adminId)
    localStorage.setItem('admin_email', email)
    set({ token, adminId, email })
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('admin_id')
    localStorage.removeItem('admin_email')
    set({ token: null, adminId: null, email: null })
  },
}))
