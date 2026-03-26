/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { apiClient } from '../services/apiClient'
import type { User, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const PROFILE_OVERRIDES_KEY = 'capy-profile-overrides'

type ProfileOverrides = Pick<
  User,
  | 'email'
  | 'first_name'
  | 'last_name'
  | 'rcsid'
  | 'organizations'
  | 'class_year'
  | 'major'
  | 'phone_number'
  | 'rin'
  | 'interests'
>
type StoredOverrides = Record<string, ProfileOverrides>

const readStoredOverrides = (): StoredOverrides => {
  if (typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(PROFILE_OVERRIDES_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as StoredOverrides
  } catch {
    return {}
  }
}

const writeStoredOverrides = (overrides: StoredOverrides) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PROFILE_OVERRIDES_KEY, JSON.stringify(overrides))
}

const mergeUserWithOverrides = (user: User): User => {
  const overrides = readStoredOverrides()[user.uid]
  if (!overrides) {
    return {
      ...user,
      rcsid: user.rcsid ?? user.email.split('@')[0],
      organizations: user.organizations ?? [],
      class_year: user.class_year ?? '',
      major: user.major ?? '',
      phone_number: user.phone_number ?? '',
      rin: user.rin ?? '',
      interests: user.interests ?? '',
    }
  }

  return {
    ...user,
    ...overrides,
    rcsid: overrides.rcsid ?? user.rcsid ?? user.email.split('@')[0],
    organizations: overrides.organizations ?? user.organizations ?? [],
    class_year: overrides.class_year ?? user.class_year ?? '',
    major: overrides.major ?? user.major ?? '',
    phone_number: overrides.phone_number ?? user.phone_number ?? '',
    rin: overrides.rin ?? user.rin ?? '',
    interests: overrides.interests ?? user.interests ?? '',
  }
}

const mergeProfileOverrides = (currentUser: User, profile: ProfileOverrides): User => ({
  ...currentUser,
  ...profile,
  rcsid: profile.rcsid ?? currentUser.rcsid ?? currentUser.email.split('@')[0],
  organizations: profile.organizations ?? currentUser.organizations ?? [],
  class_year: profile.class_year ?? currentUser.class_year ?? '',
  major: profile.major ?? currentUser.major ?? '',
  phone_number: profile.phone_number ?? currentUser.phone_number ?? '',
  rin: profile.rin ?? currentUser.rin ?? '',
  interests: profile.interests ?? currentUser.interests ?? '',
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthed = user !== null

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiClient.get<User>('/auth/me')
      setUser(mergeUserWithOverrides(data))
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
    const ctaHref = '/api/v1/auth/google'
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

      const overrides = readStoredOverrides()
      overrides[user.uid] = {
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        rcsid: profile.rcsid,
        organizations: profile.organizations ?? [],
        class_year: profile.class_year ?? '',
        major: profile.major ?? '',
        phone_number: profile.phone_number ?? '',
        rin: profile.rin ?? '',
        interests: profile.interests ?? '',
      }
      writeStoredOverrides(overrides)
      setUser((currentUser) =>
        currentUser ? mergeProfileOverrides(currentUser, overrides[user.uid]) : currentUser,
      )
    },
    [user],
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
