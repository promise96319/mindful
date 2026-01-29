import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import StatsCard from '../components/StatsCard'

export default function Home() {
  const { t } = useTranslation('home')

  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      titleKey: 'features.learn.title',
      descKey: 'features.learn.desc',
      link: '/learn',
      gradient: 'from-primary-light to-primary',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z" />
        </svg>
      ),
      titleKey: 'features.practice.title',
      descKey: 'features.practice.desc',
      link: '/tools',
      gradient: 'from-secondary-light to-secondary',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      titleKey: 'features.track.title',
      descKey: 'features.track.desc',
      link: '/tools/timer',
      gradient: 'from-accent-light to-accent',
    },
  ]

  const quickTools = [
    { key: 'breathing', path: '/tools/breathing', emoji: '🌬️' },
    { key: 'focus', path: '/tools/focus', emoji: '🎯' },
    { key: 'ambient', path: '/tools/ambient', emoji: '🎵' },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-light/20 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-secondary-light/20 blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent-light/10 blur-3xl animate-breathe" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Decorative element */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{t('hero.badge') || 'Begin your mindful journey'}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight tracking-tight opacity-0 animate-fade-in-up stagger-1">
            <span className="text-gradient">{t('hero.title')}</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up stagger-2">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up stagger-3">
            <Link
              to="/learn/basics"
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium overflow-hidden transition-all duration-500 hover:shadow-large hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t('hero.startLearning')}
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>

            <Link
              to="/tools/breathing"
              className="group px-8 py-4 border-2 border-primary/20 text-primary rounded-2xl font-medium hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                {t('hero.tryBreathing')}
                <span className="text-lg">🌬️</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 px-6 -mt-8 relative z-20">
        <div className="max-w-2xl mx-auto">
          <StatsCard />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-4 opacity-0 animate-fade-in-up">
              {t('features.title')}
            </h2>
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary-light via-primary to-secondary mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative p-8 bg-card rounded-3xl border border-border-light hover:border-primary/20 transition-all duration-500 hover:shadow-large opacity-0 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
              >
                {/* Hover gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 group-hover:shadow-medium transition-all duration-500`}>
                  {feature.icon}
                </div>

                <h3 className="relative text-xl font-semibold text-text mb-3 group-hover:text-primary transition-colors duration-300">
                  {t(feature.titleKey)}
                </h3>

                <p className="relative text-text-secondary leading-relaxed">
                  {t(feature.descKey)}
                </p>

                {/* Arrow indicator */}
                <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-background-alt flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-background-alt/50 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-4 opacity-0 animate-fade-in-up">
            {t('quickStart.title')}
          </h2>
          <p className="text-text-secondary mb-12 max-w-xl mx-auto opacity-0 animate-fade-in-up stagger-1">
            {t('quickStart.desc')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up stagger-2">
            {quickTools.map((tool, index) => (
              <Link
                key={tool.key}
                to={tool.path}
                className="group flex items-center gap-3 px-6 py-4 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-border-light hover:border-primary/20"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{tool.emoji}</span>
                <span className="text-text font-medium group-hover:text-primary transition-colors duration-300">
                  {t(`quickStart.${tool.key}`)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
