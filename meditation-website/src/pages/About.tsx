import { useTranslation } from 'react-i18next'
import { BookOpenIcon, LotusIcon, ChartBarIcon } from '../components/icons'
import type { ReactNode } from 'react'

// Info Icon
function InfoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  )
}

// Lightning Icon
function LightningIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  )
}

// Globe Icon
function GlobeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  )
}

// Rocket Icon
function RocketIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  )
}

// Sparkles Icon
function SparklesIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

interface Feature {
  icon: ReactNode
  text: string
}

export default function About() {
  const { t } = useTranslation('common')

  const features: Feature[] = [
    { icon: <BookOpenIcon className="w-6 h-6 text-primary" />, text: t('about.features.item1') },
    { icon: <LotusIcon className="w-6 h-6 text-secondary" />, text: t('about.features.item2') },
    { icon: <ChartBarIcon className="w-6 h-6 text-accent" />, text: t('about.features.item3') },
    { icon: <GlobeIcon className="w-6 h-6 text-primary" />, text: t('about.features.item4') },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in-up">
          <InfoIcon className="w-4 h-4" />
          <span>About Us</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 opacity-0 animate-fade-in-up stagger-1">
          {t('about.title')}
        </h1>
      </div>

      <div className="space-y-12">
        {/* Mission Section */}
        <section className="opacity-0 animate-fade-in-up stagger-2">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
              <LightningIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text mb-3">
                {t('about.mission.title')}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {t('about.mission.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="opacity-0 animate-fade-in-up stagger-3">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center shrink-0">
              <SparklesIcon className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-xl font-semibold text-text pt-3">
              {t('about.features.title')}
            </h2>
          </div>

          <div className="grid gap-4 pl-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-border-light hover:border-primary/20 hover:shadow-soft transition-all duration-300 cursor-default"
              >
                <span className="shrink-0 mt-0.5">{feature.icon}</span>
                <span className="text-text-secondary leading-relaxed">{feature.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="opacity-0 animate-fade-in-up stagger-4">
          <div className="p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-3xl border border-primary/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center shrink-0">
                <RocketIcon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text mb-3">
                  {t('about.start.title')}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {t('about.start.content')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative element */}
        <div className="flex justify-center pt-8 opacity-0 animate-fade-in-up stagger-5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-secondary/30 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-accent/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
