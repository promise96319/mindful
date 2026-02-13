import { useState, useEffect } from 'react'
import { SearchIcon } from '../../../components/icons'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search journal entries...',
  debounceMs = 300
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, onSearch])

  return (
    <div className="relative">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-card border border-border-light rounded-2xl text-text placeholder:text-text-secondary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  )
}
