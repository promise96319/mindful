interface BodyOutlineProps {
  highlightPart: string
}

const partColors: Record<string, string> = {
  head: 'var(--color-primary, #6366f1)',
  neck: 'var(--color-primary, #6366f1)',
  arms: 'var(--color-primary, #6366f1)',
  chest: 'var(--color-primary, #6366f1)',
  abdomen: 'var(--color-primary, #6366f1)',
  hips: 'var(--color-primary, #6366f1)',
  legs: 'var(--color-primary, #6366f1)',
}

export default function BodyOutline({ highlightPart }: BodyOutlineProps) {
  const defaultStroke = 'currentColor'
  const highlightFill = partColors[highlightPart] || '#6366f1'
  const highlightOpacity = 0.35

  const isHighlighted = (part: string) => part === highlightPart

  return (
    <svg
      viewBox="0 0 200 400"
      className="w-full h-full text-text-secondary/40"
      fill="none"
      strokeWidth={1.5}
    >
      {/* Head */}
      <ellipse
        cx="100" cy="40" rx="25" ry="30"
        stroke={isHighlighted('head') ? highlightFill : defaultStroke}
        fill={isHighlighted('head') ? highlightFill : 'none'}
        fillOpacity={isHighlighted('head') ? highlightOpacity : 0}
        strokeWidth={isHighlighted('head') ? 2.5 : 1.5}
        className="transition-all duration-500"
      />

      {/* Neck & Shoulders */}
      <path
        d="M88 68 L88 80 L50 95 L50 105 L150 105 L150 95 L112 80 L112 68"
        stroke={isHighlighted('neck') ? highlightFill : defaultStroke}
        fill={isHighlighted('neck') ? highlightFill : 'none'}
        fillOpacity={isHighlighted('neck') ? highlightOpacity : 0}
        strokeWidth={isHighlighted('neck') ? 2.5 : 1.5}
        className="transition-all duration-500"
      />

      {/* Arms & Hands */}
      <g
        stroke={isHighlighted('arms') ? highlightFill : defaultStroke}
        fill={isHighlighted('arms') ? highlightFill : 'none'}
        fillOpacity={isHighlighted('arms') ? highlightOpacity : 0}
        strokeWidth={isHighlighted('arms') ? 2.5 : 1.5}
        className="transition-all duration-500"
      >
        {/* Left arm */}
        <path d="M50 105 L30 150 L25 200 L35 200 L42 155 L55 120" />
        {/* Right arm */}
        <path d="M150 105 L170 150 L175 200 L165 200 L158 155 L145 120" />
      </g>

      {/* Chest & Upper Back */}
      <rect
        x="60" y="105" width="80" height="50" rx="5"
        stroke={isHighlighted('chest') ? highlightFill : defaultStroke}
        fill={isHighlighted('chest') ? highlightFill : 'none'}
        fillOpacity={isHighlighted('chest') ? highlightOpacity : 0}
        strokeWidth={isHighlighted('chest') ? 2.5 : 1.5}
        className="transition-all duration-500"
      />

      {/* Abdomen & Lower Back */}
      <rect
        x="65" y="155" width="70" height="45" rx="5"
        stroke={isHighlighted('abdomen') ? highlightFill : defaultStroke}
        fill={isHighlighted('abdomen') ? highlightFill : 'none'}
        fillOpacity={isHighlighted('abdomen') ? highlightOpacity : 0}
        strokeWidth={isHighlighted('abdomen') ? 2.5 : 1.5}
        className="transition-all duration-500"
      />

      {/* Hips & Pelvis */}
      <path
        d="M65 200 L60 230 L80 240 L100 245 L120 240 L140 230 L135 200 Z"
        stroke={isHighlighted('hips') ? highlightFill : defaultStroke}
        fill={isHighlighted('hips') ? highlightFill : 'none'}
        fillOpacity={isHighlighted('hips') ? highlightOpacity : 0}
        strokeWidth={isHighlighted('hips') ? 2.5 : 1.5}
        className="transition-all duration-500"
      />

      {/* Legs & Feet */}
      <g
        stroke={isHighlighted('legs') ? highlightFill : defaultStroke}
        fill={isHighlighted('legs') ? highlightFill : 'none'}
        fillOpacity={isHighlighted('legs') ? highlightOpacity : 0}
        strokeWidth={isHighlighted('legs') ? 2.5 : 1.5}
        className="transition-all duration-500"
      >
        {/* Left leg */}
        <path d="M80 240 L75 300 L70 370 L60 380 L85 380 L82 310 L90 245" />
        {/* Right leg */}
        <path d="M120 240 L125 300 L130 370 L140 380 L115 380 L118 310 L110 245" />
      </g>
    </svg>
  )
}
