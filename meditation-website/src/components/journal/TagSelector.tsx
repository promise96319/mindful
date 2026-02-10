interface TagSelectorProps {
  tags: string[]
  selected: string[]
  onChange: (tags: string[]) => void
}

export default function TagSelector({ tags, selected, onChange }: TagSelectorProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
              isSelected
                ? 'bg-primary text-white border-primary shadow-soft'
                : 'bg-card text-text-secondary border-border-light hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
