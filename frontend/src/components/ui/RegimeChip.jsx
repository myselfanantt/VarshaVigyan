import { REGIME_COLORS, REGIME_ICONS } from '../../data/mockRegimes.js'

export default function RegimeChip({ regime, size = 'sm' }) {
  const color = REGIME_COLORS[regime] || '#64748B'
  const icon = REGIME_ICONS[regime] || '🌦️'

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      <span>{regime}</span>
    </span>
  )
}
