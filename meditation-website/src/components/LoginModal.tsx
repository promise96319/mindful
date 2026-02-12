import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'

export default function LoginModal() {
  const { t } = useTranslation('common')
  const {
    loginModalOpen,
    closeLoginModal,
    loginWithEmail,
    registerWithEmail,
    signInWithGoogle,
    signInWithGithub,
  } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loginModalOpen) return null

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setDisplayName('')
    setError('')
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password)
      } else {
        await registerWithEmail(email, password, displayName)
      }
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    resetForm()
    setMode('login')
    closeLoginModal()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background rounded-3xl shadow-large border border-border-light p-8 animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-text-secondary hover:text-text hover:bg-background-alt transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center shadow-soft">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="8" className="opacity-60" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text">
            {mode === 'login'
              ? t('login.title', { defaultValue: 'Welcome Back' })
              : t('register.title', { defaultValue: 'Create Account' })}
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            {t('login.subtitle', { defaultValue: 'Sign in to save your meditation data' })}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-border text-text hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 font-medium text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {t('login.google', { defaultValue: 'Continue with Google' })}
          </button>
          <button
            onClick={signInWithGithub}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-border text-text hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 font-medium text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
            {t('login.github', { defaultValue: 'Continue with GitHub' })}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border-light" />
          <span className="text-xs text-text-secondary">{t('login.or', { defaultValue: 'or' })}</span>
          <div className="flex-1 h-px bg-border-light" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('login.namePlaceholder', { defaultValue: 'Display name' })}
              required
              className="w-full px-4 py-3 rounded-2xl border border-border bg-background-alt text-text placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors text-sm"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('login.emailPlaceholder', { defaultValue: 'Email' })}
            required
            className="w-full px-4 py-3 rounded-2xl border border-border bg-background-alt text-text placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('login.passwordPlaceholder', { defaultValue: 'Password (min 6 characters)' })}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-2xl border border-border bg-background-alt text-text placeholder:text-text-tertiary focus:border-primary focus:outline-none transition-colors text-sm"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 text-sm"
          >
            {submitting
              ? '...'
              : mode === 'login'
                ? t('login.submit', { defaultValue: 'Sign In' })
                : t('register.submit', { defaultValue: 'Create Account' })}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-sm text-text-secondary mt-6">
          {mode === 'login'
            ? t('login.noAccount', { defaultValue: "Don't have an account?" })
            : t('register.hasAccount', { defaultValue: 'Already have an account?' })}
          {' '}
          <button onClick={switchMode} className="text-primary font-medium hover:underline">
            {mode === 'login'
              ? t('login.toRegister', { defaultValue: 'Sign up' })
              : t('register.toLogin', { defaultValue: 'Sign in' })}
          </button>
        </p>
      </div>
    </div>
  )
}
