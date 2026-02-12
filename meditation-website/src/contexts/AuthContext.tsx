import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { setAccessToken, getAccessToken } from '../lib/api'
import type { AppUser } from '../types/user'
import { migrateLocalRecords } from '../services/apiService'

export interface AuthContextType {
  user: AppUser | null
  loading: boolean
  loginModalOpen: boolean
  signInWithGoogle: () => void
  signInWithGithub: () => void
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  promptLogin: () => void
  closeLoginModal: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginModalOpen: false,
  signInWithGoogle: () => {},
  signInWithGithub: () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  signOut: async () => {},
  promptLogin: () => {},
  closeLoginModal: () => {},
})

const MIGRATION_KEY = 'mindful_data_migrated'

async function tryMigrateLocalData() {
  if (localStorage.getItem(MIGRATION_KEY)) return
  const raw = localStorage.getItem('practiceHistory')
  if (!raw) {
    localStorage.setItem(MIGRATION_KEY, 'true')
    return
  }
  try {
    const records = JSON.parse(raw) as { date: string; tool: string; duration: number }[]
    if (records.length > 0) {
      await migrateLocalRecords(records)
    }
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(MIGRATION_KEY, 'true')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const promptLogin = useCallback(() => {
    setLoginModalOpen(true)
  }, [])

  const closeLoginModal = useCallback(() => {
    setLoginModalOpen(false)
  }, [])

  const handleAuthResponse = useCallback(async (data: { accessToken: string; user: AppUser }) => {
    setAccessToken(data.accessToken)
    setUser(data.user)
    setLoginModalOpen(false)
    await tryMigrateLocalData()
  }, [])

  // On mount, try to restore session from refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })
        if (res.ok) {
          const json = await res.json()
          const data = json.data as { accessToken: string; user: AppUser }
          setAccessToken(data.accessToken)
          setUser(data.user)
        }
      } catch {
        // no session to restore
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  // Handle OAuth callback token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token && window.location.pathname === '/auth/callback') {
      setAccessToken(token)
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          setUser(json.data as AppUser)
          tryMigrateLocalData()
          window.history.replaceState({}, '', '/')
        })
        .catch(() => {
          setAccessToken(null)
        })
        .finally(() => setLoading(false))
    }
  }, [])

  const signInWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google'
  }, [])

  const signInWithGithub = useCallback(() => {
    window.location.href = '/api/auth/github'
  }, [])

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }))
      throw new Error(err.message || 'Login failed')
    }
    const json = await res.json()
    await handleAuthResponse(json.data as { accessToken: string; user: AppUser })
  }, [handleAuthResponse])

  const registerWithEmail = useCallback(async (email: string, password: string, displayName: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
      credentials: 'include',
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Registration failed' }))
      throw new Error(err.message || 'Registration failed')
    }
    const json = await res.json()
    await handleAuthResponse(json.data as { accessToken: string; user: AppUser })
  }, [handleAuthResponse])

  const signOut = useCallback(async () => {
    const token = getAccessToken()
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      })
    } catch {
      // ignore logout errors
    }
    setAccessToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginModalOpen,
        signInWithGoogle,
        signInWithGithub,
        loginWithEmail,
        registerWithEmail,
        signOut,
        promptLogin,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
