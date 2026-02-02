import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SeedlingIcon, WindIcon, TargetIcon, HeartIcon, LotusIcon, SparklesIcon, BookOpenIcon, ChevronRightIcon } from '../components/icons'
import type { ReactNode } from 'react'

interface Chapter {
  path: string
  icon: ReactNode
  titleKey: string
  gradient: string
}

export default function Learn() {
  const { t } = useTranslation('learn')
  const location = useLocation()
  const isIndex = location.pathname === '/learn'

  const chapters: Chapter[] = [
    { path: 'basics', icon: <SeedlingIcon className="w-7 h-7" />, titleKey: 'chapters.basics', gradient: 'from-emerald-500 to-green-500' },
    { path: 'breathing', icon: <WindIcon className="w-7 h-7" />, titleKey: 'chapters.breathing', gradient: 'from-cyan-500 to-blue-500' },
    { path: 'focus', icon: <TargetIcon className="w-7 h-7" />, titleKey: 'chapters.focus', gradient: 'from-violet-500 to-purple-500' },
    { path: 'relaxation', icon: <HeartIcon className="w-7 h-7" />, titleKey: 'chapters.relaxation', gradient: 'from-pink-500 to-rose-500' },
    { path: 'meditation', icon: <LotusIcon className="w-7 h-7" />, titleKey: 'chapters.meditation', gradient: 'from-amber-500 to-orange-500' },
    { path: 'advanced', icon: <SparklesIcon className="w-7 h-7" />, titleKey: 'chapters.advanced', gradient: 'from-indigo-500 to-blue-600' },
  ]

  if (isIndex) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-sm font-medium mb-6 animate-fade-in-up">
            <BookOpenIcon className="w-4 h-4" />
            <span>{t('badge') || 'Learning Path'}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 opacity-0 animate-fade-in-up stagger-1">
            {t('title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up stagger-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid gap-4">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.path}
              to={chapter.path}
              className="group flex items-center gap-5 p-6 bg-card rounded-2xl border border-border-light hover:border-primary/20 hover:shadow-medium transition-all duration-500 opacity-0 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${0.1 + index * 0.08}s`, animationFillMode: 'forwards' }}
            >
              {/* Icon */}
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${chapter.gradient} text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-soft`}>
                {chapter.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-text-muted">
                    {t('chapter')} {index + 1}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-text group-hover:text-primary transition-colors duration-300">
                  {t(chapter.titleKey)}
                </h2>
              </div>

              {/* Arrow */}
              <div className="w-10 h-10 rounded-full bg-background-alt flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-all duration-300">
                <ChevronRightIcon className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex gap-10">
      {/* Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <nav className="sticky top-28 space-y-2 bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border-light">
          <p className="px-4 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
            {t('chapters.title') || 'Chapters'}
          </p>
          {chapters.map((chapter) => {
            const isActive = location.pathname.includes(chapter.path)
            return (
              <Link
                key={chapter.path}
                to={`/learn/${chapter.path}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium shadow-soft'
                    : 'text-text-secondary hover:bg-background-alt hover:text-text'
                }`}
              >
                <span className="text-current">{chapter.icon}</span>
                <span className="text-sm">{t(chapter.titleKey)}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
