import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { t, i18n } = useTranslation('common')
  const { user, signInWithGoogle, signInWithGithub, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [loginMenuOpen, setLoginMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const loginMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (loginMenuRef.current && !loginMenuRef.current.contains(e.target as Node)) {
        setLoginMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-CN' ? 'en' : 'zh-CN'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'text-primary bg-primary/8'
        : 'text-text-secondary hover:text-primary hover:bg-primary/5'
    }`

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-warm shadow-soft border-b border-border-light'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-105">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="8" className="opacity-60" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <div className="absolute inset-0 rounded-xl bg-primary/20 animate-breathe" />
          </div>
          <span className="text-lg font-semibold text-text tracking-tight">
            {t('siteName')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-background-alt/50 rounded-full px-2 py-1.5">
          <NavLink to="/journal" className={navLinkClass}>
            {t('nav.explore')}
          </NavLink>
          <NavLink to="/learn" className={navLinkClass}>
            {t('nav.learn')}
          </NavLink>
          <NavLink to="/tools" className={navLinkClass}>
            {t('nav.tools')}
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            {t('nav.about')}
          </NavLink>
        </div>

        {/* Theme & Language & Auth */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="relative overflow-hidden px-4 py-2 rounded-full text-sm font-medium border border-border text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
          >
            <span className="relative z-10">
              {i18n.language === 'zh-CN' ? 'EN' : '中文'}
            </span>
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-primary/5 transition-all duration-300"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{user.displayName?.[0] || '?'}</span>
                  </div>
                )}
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-2xl border border-border-light shadow-large py-2 animate-scale-in z-50">
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-text hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    {t('nav.profile', { defaultValue: 'Profile' })}
                  </Link>
                  <hr className="my-1 border-border-light" />
                  <button
                    onClick={() => { signOut(); setUserMenuOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
                  >
                    {t('nav.logout', { defaultValue: 'Log out' })}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={loginMenuRef}>
              <button
                onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-primary-dark text-white shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
              >
                {t('nav.login', { defaultValue: 'Log in' })}
              </button>

              {loginMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-2xl border border-border-light shadow-large py-2 animate-scale-in z-50">
                  <button
                    onClick={() => { signInWithGoogle(); setLoginMenuOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-text hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </button>
                  <button
                    onClick={() => { signInWithGithub(); setLoginMenuOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-text hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    GitHub
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2 space-y-2 bg-background-warm/95 backdrop-blur-lg border-b border-border-light">
          <NavLink
            to="/journal"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            {t('nav.explore')}
          </NavLink>
          <NavLink
            to="/learn"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            {t('nav.learn')}
          </NavLink>
          <NavLink
            to="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            {t('nav.tools')}
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            {t('nav.about')}
          </NavLink>

          {/* Mobile Theme Toggle */}
          <div className="pt-3 mt-3 border-t border-border-light">
            <ThemeToggle showLabel className="w-full justify-center px-4 py-3 rounded-xl" />
          </div>
        </div>
      </div>
    </header>
  )
}
