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
      const data = await apiClient.get<User>('/auth/me', { cache: 'no-store' })
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

      const gradYear = Number.parseInt(profile.class_year ?? '', 10)
      await apiClient.put(`/users/${user.uid}`, {
        first_name: profile.first_name,
        last_name: profile.last_name,
        personal_email: user.email,
        school_email: profile.email,
        phone: profile.phone_number,
        grad_year: Number.isNaN(gradYear) ? null : gradYear,
      })

      // Refresh the user to get the source of truth from the backend
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
