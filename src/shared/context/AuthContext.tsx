/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { apiClient, API_VERSION } from '../services/apiClient'
import type { User, AuthContextType } from '../types/auth'
import { normalizeUser } from '../models/user'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthed = user !== null

  const refreshUser = useCallback(async () => {
    try {
      // Always get the UID from /auth/me
      const authMe = await apiClient.get<{ uid: string }>(`/auth/me`, { cache: 'no-store' })
      const uid = authMe?.uid
      if (!uid) throw new Error('No UID available')
      localStorage.setItem('uid', uid)
      const data = await apiClient.get<User>(`/users/${uid}`, { cache: 'no-store' })
      setUser(normalizeUser(data))
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = () => {
    const ctaHref = `${API_VERSION}/auth/google`
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const popup = window.open(
      ctaHref,
      'capy-auth',
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`,
    )

    if (popup) {
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer)
          refreshUser()
        }
      }, 500)
    }
  }

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      setUser(null)
    }
  }

  const saveProfile = useCallback<AuthContextType['saveProfile']>(
    async (profile) => {
      if (!user) return

      // Only send fields that are present in the model
      const updatedUser: Partial<User> = {
        first_name: profile.first_name ?? user.first_name,
        last_name: profile.last_name ?? user.last_name,
        grad_year: typeof profile.grad_year === 'number' ? profile.grad_year : user.grad_year,
        personal_email: profile.personal_email ?? user.personal_email,
        school_email: profile.school_email ?? user.school_email,
        phone: profile.phone ?? user.phone,
        role: profile.role ?? user.role,
      }

      await apiClient.put(`/users/${user.uid}`, updatedUser)
      await refreshUser()
    },
    [user, refreshUser],
  )

  return (
    <AuthContext.Provider
      value={{ user, isAuthed, isLoading, login, logout, refreshUser, saveProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
