import { useTranslation } from 'react-i18next'
import { MOOD_ICONS, MOOD_LABELS_ZH, MOOD_LABELS_EN } from '../../types/journal'

interface MoodSelectorProps {
  value: number
  onChange: (mood: number) => void
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const { i18n } = useTranslation()
  const labels = i18n.language === 'zh-CN' ? MOOD_LABELS_ZH : MOOD_LABELS_EN

  return (
    <div className="flex justify-between gap-2">
      {MOOD_ICONS.map((icon, index) => {
        const mood = index + 1
        const isSelected = value === mood
        return (
          <button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 border-2 ${
              isSelected
                ? 'bg-primary/10 border-primary scale-105 shadow-soft'
                : 'bg-card border-border-light hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            <span className={`text-2xl transition-transform duration-300 ${isSelected ? 'scale-125' : ''}`}>
              {icon}
            </span>
            <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-text-secondary'}`}>
              {labels[index]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
