import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MoodSelector from './MoodSelector'
import TagSelector from './TagSelector'
import {
  BODY_TAGS_ZH, BODY_TAGS_EN,
  MIND_TAGS_ZH, MIND_TAGS_EN,
} from '../../types/journal'
import type { JournalEntry } from '../../types/journal'

interface JournalFormProps {
  initialData?: Partial<JournalEntry>
  toolName?: string
  duration?: number
  onSubmit: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export default function JournalForm({ initialData, toolName = '', duration = 0, onSubmit, onCancel }: JournalFormProps) {
  const { t, i18n } = useTranslation('journal')
  const isZh = i18n.language === 'zh-CN'

  const [mood, setMood] = useState(initialData?.mood ?? 3)
  const [bodyTags, setBodyTags] = useState<string[]>(initialData?.bodyTags ?? [])
  const [mindTags, setMindTags] = useState<string[]>(initialData?.mindTags ?? [])
  const [freeText, setFreeText] = useState(initialData?.freeText ?? '')
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? false)
  const [isAnonymous, setIsAnonymous] = useState(initialData?.isAnonymous ?? false)

  const bodyTagsList = isZh ? BODY_TAGS_ZH : BODY_TAGS_EN
  const mindTagsList = isZh ? MIND_TAGS_ZH : MIND_TAGS_EN

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      date: initialData?.date ?? new Date().toISOString().split('T')[0],
      toolUsed: initialData?.toolUsed ?? toolName,
      duration: initialData?.duration ?? duration,
      mood,
      focus: 3, // Default value for backward compatibility
      bodyTags,
      mindTags,
      freeText,
      isPublic,
      isAnonymous,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mood */}
      <div>
        <label className="block text-sm font-semibold text-text mb-3">
          {t('mood', { defaultValue: 'Mood' })}
        </label>
        <MoodSelector value={mood} onChange={setMood} />
      </div>

      {/* Body Tags */}
      <div>
        <label className="block text-sm font-semibold text-text mb-3">
          {t('bodyFeel', { defaultValue: 'Body Sensations' })}
        </label>
        <TagSelector tags={bodyTagsList} selected={bodyTags} onChange={setBodyTags} />
      </div>

      {/* Mind Tags */}
      <div>
        <label className="block text-sm font-semibold text-text mb-3">
          {t('mindState', { defaultValue: 'Mental State' })}
        </label>
        <TagSelector tags={mindTagsList} selected={mindTags} onChange={setMindTags} />
      </div>

      {/* Free Text */}
      <div>
        <label className="block text-sm font-semibold text-text mb-3">
          {t('notes', { defaultValue: 'Notes' })}
        </label>
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          rows={4}
          placeholder={t('notesPlaceholder', { defaultValue: 'How was your practice today?' })}
          className="w-full p-4 rounded-2xl border-2 border-border-light bg-card text-text placeholder-text-tertiary focus:border-primary focus:outline-none transition-all duration-300 resize-none"
        />
      </div>

      {/* Share to Community */}
      <div className="bg-background-alt rounded-2xl p-5 border-2 border-border-light">
        <div className="flex items-start gap-3 mb-3">
          <label className="flex items-center gap-3 cursor-pointer flex-1 group">
            <div className="relative">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 rounded-lg accent-primary cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-text group-hover:text-primary transition-colors">
                {t('shareToComm', { defaultValue: 'Share to Community' })}
              </div>
              <div className="text-xs text-text-tertiary mt-0.5">
                {t('shareToCommDesc', { defaultValue: 'Let others see your meditation journey' })}
              </div>
            </div>
          </label>
        </div>

        {isPublic && (
          <div className="ml-8 pt-3 border-t border-border-light">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-text-secondary group-hover:text-text transition-colors">
                  {t('postAnonymously', { defaultValue: 'Post Anonymously' })}
                </span>
                <div className="text-xs text-text-tertiary mt-0.5">
                  {t('postAnonymouslyDesc', { defaultValue: 'Hide your name and avatar' })}
                </div>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]"
        >
          {t('save', { defaultValue: 'Save' })}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-border text-text-secondary rounded-2xl font-medium hover:border-primary/30 hover:bg-background-alt transition-all duration-300"
        >
          {t('cancel', { defaultValue: 'Cancel' })}
        </button>
      </div>
    </form>
  )
}
