import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function LearnChapter() {
  const { chapter } = useParams<{ chapter: string }>()
  const { t } = useTranslation('learn')

  const chapterIcons: Record<string, string> = {
    basics: '🌱',
    breathing: '🌬️',
    focus: '🎯',
    relaxation: '🧘',
    meditation: '🪷',
    advanced: '✨',
  }

  const chapterContent: Record<string, { sections: { title: string; content: string }[] }> = {
    basics: {
      sections: [
        {
          title: t('basics.title'),
          content: t('basics.intro'),
        },
      ],
    },
    breathing: {
      sections: [
        {
          title: t('breathing.title'),
          content: t('breathing.intro'),
        },
      ],
    },
    focus: {
      sections: [
        {
          title: t('focus.title'),
          content: t('focus.intro'),
        },
      ],
    },
    relaxation: {
      sections: [
        {
          title: t('relaxation.title'),
          content: t('relaxation.intro'),
        },
      ],
    },
    meditation: {
      sections: [
        {
          title: t('meditation.title'),
          content: t('meditation.intro'),
        },
      ],
    },
    advanced: {
      sections: [
        {
          title: t('advanced.title'),
          content: t('advanced.intro'),
        },
      ],
    },
  }

  const currentChapter = chapter ? chapterContent[chapter] : null
  const currentIcon = chapter ? chapterIcons[chapter] : ''

  if (!currentChapter) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-background-alt flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-text-secondary mb-6">Chapter not found</p>
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Learning Center
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl animate-fade-in-up">
      {/* Mobile back link */}
      <Link
        to="/learn"
        className="lg:hidden inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-colors duration-300"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>All Chapters</span>
      </Link>

      {currentChapter.sections.map((section, index) => (
        <section key={index} className="mb-12">
          {/* Header with icon */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-light/30 to-secondary-light/30 flex items-center justify-center">
              <span className="text-3xl">{currentIcon}</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text">
                {section.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-text-secondary leading-relaxed text-lg">
              {section.content}
            </p>
          </div>
        </section>
      ))}

      {/* Coming soon card */}
      <div className="mt-16 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border border-primary/10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-text-secondary">
          More content coming soon...
        </p>
        <p className="text-text-muted text-sm mt-2">
          We're working hard to bring you more learning materials
        </p>
      </div>
    </article>
  )
}
