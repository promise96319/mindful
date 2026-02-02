import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import StatsCard from '../components/StatsCard'
import { BookOpenIcon, PlayCircleIcon, ChartBarIcon, WindIcon, TargetIcon, MusicNoteIcon, ArrowRightIcon, ChevronRightIcon } from '../components/icons'

export default function Home() {
  const { t } = useTranslation('home')

  const features = [
    {
      icon: <BookOpenIcon className="w-7 h-7" />,
      titleKey: 'features.learn.title',
      descKey: 'features.learn.desc',
      link: '/learn',
      gradient: 'from-primary-light to-primary',
    },
    {
      icon: <PlayCircleIcon className="w-7 h-7" />,
      titleKey: 'features.practice.title',
      descKey: 'features.practice.desc',
      link: '/tools',
      gradient: 'from-secondary-light to-secondary',
    },
    {
      icon: <ChartBarIcon className="w-7 h-7" />,
      titleKey: 'features.track.title',
      descKey: 'features.track.desc',
      link: '/tools/timer',
      gradient: 'from-accent-light to-accent',
    },
  ]

  const quickTools = [
    { key: 'breathing', path: '/tools/breathing', icon: <WindIcon className="w-6 h-6" /> },
    { key: 'focus', path: '/tools/focus', icon: <TargetIcon className="w-6 h-6" /> },
    { key: 'ambient', path: '/tools/ambient', icon: <MusicNoteIcon className="w-6 h-6" /> },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-breathe" />
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
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium overflow-hidden transition-all duration-500 hover:shadow-large hover:scale-[1.02] cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t('hero.startLearning')}
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>

            <Link
              to="/tools/breathing"
              className="group px-8 py-4 border-2 border-primary/20 text-primary rounded-2xl font-medium hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2">
                {t('hero.tryBreathing')}
                <WindIcon className="w-5 h-5" />
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
                className="group relative p-8 bg-card rounded-3xl border border-border-light hover:border-primary/20 transition-all duration-500 hover:shadow-large opacity-0 animate-fade-in-up overflow-hidden cursor-pointer"
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
                  <ChevronRightIcon className="w-5 h-5 text-primary" />
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
                className="group flex items-center gap-3 px-6 py-4 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-border-light hover:border-primary/20 cursor-pointer"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <span className="text-primary group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
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
