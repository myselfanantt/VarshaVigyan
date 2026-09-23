const LEVEL_CONFIG = {
  normal:     { label: 'Normal',      bg: '#18A86B', light: '#dcfce7' },
  moderate:   { label: 'Moderate',    bg: '#F59E0B', light: '#fef9c3' },
  heavy:      { label: 'Heavy',       bg: '#E84E1A', light: '#ffedd5' },
  very_heavy: { label: 'Very Heavy',  bg: '#DC2626', light: '#fee2e2' },
}

export default function AlertSeverityChip({ level, variant = 'filled' }) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.normal

  if (variant === 'outline') {
    return (
      <span
        className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded"
        style={{
          color: config.bg,
          backgroundColor: config.light,
          border: `1px solid ${config.bg}40`,
        }}
      >
        {config.label}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded text-white"
      style={{ backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  )
}
