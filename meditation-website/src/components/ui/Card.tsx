import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hover = true, onClick }: CardProps) {
  const baseStyles = 'bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-soft)] transition-all duration-300'
  const hoverStyles = hover ? 'hover:-translate-y-1 hover:shadow-[var(--shadow-large)] cursor-pointer' : ''
  const clickableStyles = onClick ? 'cursor-pointer' : ''

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
