import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Learn() {
  const { t } = useTranslation('learn')
  const location = useLocation()
  const isIndex = location.pathname === '/learn'

  const chapters = [
    { path: 'basics', icon: '🌱', titleKey: 'chapters.basics', color: 'from-green-100 to-green-50' },
    { path: 'breathing', icon: '🌬️', titleKey: 'chapters.breathing', color: 'from-blue-100 to-blue-50' },
    { path: 'focus', icon: '🎯', titleKey: 'chapters.focus', color: 'from-purple-100 to-purple-50' },
    { path: 'relaxation', icon: '🧘', titleKey: 'chapters.relaxation', color: 'from-pink-100 to-pink-50' },
    { path: 'meditation', icon: '🪷', titleKey: 'chapters.meditation', color: 'from-amber-100 to-amber-50' },
    { path: 'advanced', icon: '✨', titleKey: 'chapters.advanced', color: 'from-indigo-100 to-indigo-50' },
  ]

  if (isIndex) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-sm font-medium mb-6 animate-fade-in-up">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
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
              className="group flex items-center gap-5 p-6 bg-card rounded-2xl border border-border-light hover:border-primary/20 hover:shadow-medium transition-all duration-500 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.08}s`, animationFillMode: 'forwards' }}
            >
              {/* Icon */}
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${chapter.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500`}>
                <span className="text-3xl">{chapter.icon}</span>
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
                <svg
                  className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium shadow-soft'
                    : 'text-text-secondary hover:bg-background-alt hover:text-text'
                }`}
              >
                <span className="text-xl">{chapter.icon}</span>
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
