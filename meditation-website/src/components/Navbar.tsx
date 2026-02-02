import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { t, i18n } = useTranslation('common')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

        {/* Theme & Language Toggle */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
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
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2 space-y-2 bg-background-warm/95 backdrop-blur-lg border-b border-border-light">
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
