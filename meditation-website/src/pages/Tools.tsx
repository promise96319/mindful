import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { WindIcon, EyeIcon, HeartIcon, SunIcon, ClockIcon, SpeakerWaveIcon, WrenchIcon, ChevronRightIcon, TargetIcon, MusicNoteIcon, SparklesIcon } from '../components/icons'
import type { ReactNode } from 'react'

interface Tool {
  path: string
  icon: ReactNode
  titleKey: string
  descKey: string
  gradient: string
  bgGradient: string
}

export default function Tools() {
  const { t } = useTranslation('tools')
  const location = useLocation()
  const isIndex = location.pathname === '/tools'

  const tools: Tool[] = [
    {
      path: 'breathing',
      icon: <WindIcon className="w-7 h-7" />,
      titleKey: 'breathing.title',
      descKey: 'breathing.desc',
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-500/5 to-blue-500/5',
    },
    {
      path: 'focus',
      icon: <EyeIcon className="w-7 h-7" />,
      titleKey: 'focus.title',
      descKey: 'focus.desc',
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-500/5 to-purple-500/5',
    },
    {
      path: 'relaxation',
      icon: <HeartIcon className="w-7 h-7" />,
      titleKey: 'relaxation.title',
      descKey: 'relaxation.desc',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/5 to-teal-500/5',
    },
    {
      path: 'meditation',
      icon: <SunIcon className="w-7 h-7" />,
      titleKey: 'meditation.title',
      descKey: 'meditation.desc',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/5 to-orange-500/5',
    },
    {
      path: 'timer',
      icon: <ClockIcon className="w-7 h-7" />,
      titleKey: 'timer.title',
      descKey: 'timer.desc',
      gradient: 'from-slate-500 to-gray-600',
      bgGradient: 'from-slate-500/5 to-gray-600/5',
    },
    {
      path: 'ambient',
      icon: <SpeakerWaveIcon className="w-7 h-7" />,
      titleKey: 'ambient.title',
      descKey: 'ambient.desc',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/5 to-emerald-500/5',
    },
    {
      path: 'body-scan',
      icon: <TargetIcon className="w-7 h-7" />,
      titleKey: 'bodyScan.title',
      descKey: 'bodyScan.desc',
      gradient: 'from-rose-500 to-pink-500',
      bgGradient: 'from-rose-500/5 to-pink-500/5',
    },
    {
      path: 'music-library',
      icon: <MusicNoteIcon className="w-7 h-7" />,
      titleKey: 'musicLibrary.title',
      descKey: 'musicLibrary.desc',
      gradient: 'from-indigo-500 to-blue-600',
      bgGradient: 'from-indigo-500/5 to-blue-600/5',
    },
    {
      path: 'visualization',
      icon: <SparklesIcon className="w-7 h-7" />,
      titleKey: 'visualization.title',
      descKey: 'visualization.desc',
      gradient: 'from-fuchsia-500 to-purple-600',
      bgGradient: 'from-fuchsia-500/5 to-purple-600/5',
    },
  ]

  if (isIndex) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6 animate-fade-in-up">
            <WrenchIcon className="w-4 h-4" />
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
              className="group relative p-6 bg-card rounded-3xl border border-border-light hover:border-transparent transition-all duration-500 overflow-hidden opacity-0 animate-fade-in-up cursor-pointer"
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
              <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-soft">
                <ChevronRightIcon className="w-4 h-4 text-text" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return <Outlet />
}
