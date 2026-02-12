import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // The AuthContext handles the token from URL params
    // Once user is loaded or loading is done, redirect
    if (!loading) {
      navigate(user ? '/' : '/login', { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary">Completing sign in...</p>
      </div>
    </div>
  )
}
