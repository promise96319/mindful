import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Tools() {
  const { t } = useTranslation('tools')
  const location = useLocation()
  const isIndex = location.pathname === '/tools'

  const tools = [
    {
      path: 'breathing',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      emoji: '🌬️',
      titleKey: 'breathing.title',
      descKey: 'breathing.desc',
      gradient: 'from-blue-400/80 to-cyan-400/80',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      path: 'focus',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      emoji: '🎯',
      titleKey: 'focus.title',
      descKey: 'focus.desc',
      gradient: 'from-purple-400/80 to-pink-400/80',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      path: 'relaxation',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      emoji: '🧘',
      titleKey: 'relaxation.title',
      descKey: 'relaxation.desc',
      gradient: 'from-emerald-400/80 to-teal-400/80',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
    {
      path: 'meditation',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
      emoji: '🪷',
      titleKey: 'meditation.title',
      descKey: 'meditation.desc',
      gradient: 'from-amber-400/80 to-orange-400/80',
      bgGradient: 'from-amber-50 to-orange-50',
    },
    {
      path: 'timer',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      emoji: '⏱️',
      titleKey: 'timer.title',
      descKey: 'timer.desc',
      gradient: 'from-slate-400/80 to-gray-500/80',
      bgGradient: 'from-slate-50 to-gray-50',
    },
    {
      path: 'ambient',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ),
      emoji: '🎵',
      titleKey: 'ambient.title',
      descKey: 'ambient.desc',
      gradient: 'from-green-400/80 to-emerald-500/80',
      bgGradient: 'from-green-50 to-emerald-50',
    },
  ]

  if (isIndex) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6 animate-fade-in-up">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
            <span>{t('badge') || 'Practice Tools'}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 opacity-0 animate-fade-in-up stagger-1">
            {t('title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up stagger-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group relative p-6 bg-card rounded-3xl border border-border-light hover:border-transparent transition-all duration-500 overflow-hidden opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.08}s`, animationFillMode: 'forwards' }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} text-white flex items-center justify-center mb-5 shadow-soft group-hover:scale-110 group-hover:shadow-medium transition-all duration-500`}>
                {tool.icon}
              </div>

              {/* Content */}
              <h2 className="relative text-xl font-semibold text-text mb-2 group-hover:text-text transition-colors duration-300">
                {t(tool.titleKey)}
              </h2>
              <p className="relative text-text-secondary text-sm leading-relaxed">
                {t(tool.descKey)}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-soft">
                <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return <Outlet />
}
