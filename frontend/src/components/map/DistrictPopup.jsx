import { X } from 'lucide-react'
import RegimeChip from '../ui/RegimeChip.jsx'
import AlertSeverityChip from '../ui/AlertSeverityChip.jsx'

// Circular SVG gauge for heavy rain probability
function ProbabilityGauge({ value }) {
  const pct = Math.round(value * 100)
  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  const color = pct >= 80 ? '#DC2626' : pct >= 60 ? '#E84E1A' : pct >= 40 ? '#F59E0B' : '#18A86B'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="700" fill={color}>
          {pct}%
        </text>
      </svg>
      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Heavy Rain Probability</span>
    </div>
  )
}

export default function DistrictPopup({ district, onClose }) {
  if (!district) return null

  const CELL_COLORS = {
    normal:     { bg: 'transparent',  text: '#18A86B' },
    moderate:   { bg: '#fef9c3',      text: '#92400e' },
    heavy:      { bg: '#ffedd5',      text: '#c2410c' },
    very_heavy: { bg: '#fee2e2',      text: '#b91c1c' },
  }

  const getCellStyle = (mm) => {
    if (mm < 15) return CELL_COLORS.normal
    if (mm < 64.5) return CELL_COLORS.moderate
    if (mm < 115.5) return CELL_COLORS.heavy
    return CELL_COLORS.very_heavy
  }

  const leadTimes = [
    { label: 'T+24h', raw: district.t24_raw, corr: district.t24_corrected },
    { label: 'T+48h', raw: district.t48_raw, corr: district.t48_corrected },
    { label: 'T+72h', raw: district.t72_raw, corr: district.t72_corrected },
  ]

  return (
    <div
      className="animate-slide-in-right"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '320px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        zIndex: 1000,
        overflowY: 'auto',
        borderLeft: '1px solid #e2e8f0',
      }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between p-5"
        style={{ borderBottom: '1px solid #f1f5f9' }}
      >
        <div>
          <h2
            className="font-bold text-lg leading-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {district.name}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {district.state}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <RegimeChip regime={district.regime} />
            <AlertSeverityChip level={district.alert_level} variant="outline" />
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <X size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* 3-day forecast table */}
        <div>
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            3-Day Forecast
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pb-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Lead Time</th>
                <th className="text-right pb-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Raw NWP</th>
                <th className="text-right pb-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>Corrected</th>
              </tr>
            </thead>
            <tbody>
              {leadTimes.map((lt) => {
                const corrStyle = getCellStyle(lt.corr)
                return (
                  <tr key={lt.label} className="border-t" style={{ borderColor: '#f1f5f9' }}>
                    <td className="py-2 font-medium text-xs">{lt.label}</td>
                    <td className="py-2 text-right text-xs" style={{ color: '#94a3b8' }}>
                      {lt.raw?.toFixed(1)} mm
                    </td>
                    <td
                      className="py-2 text-right text-xs font-semibold rounded px-1"
                      style={{ backgroundColor: corrStyle.bg, color: corrStyle.text }}
                    >
                      {lt.corr?.toFixed(1)} mm
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Heavy rain probability gauge */}
        <div className="flex justify-center py-2">
          <ProbabilityGauge value={district.heavy_rain_prob || 0} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3" style={{ backgroundColor: '#f8fafc' }}>
            <div className="text-[10px] uppercase font-semibold mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              Bias Factor
            </div>
            <div className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
              ×{district.bias_factor?.toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: '#f8fafc' }}>
            <div className="text-[10px] uppercase font-semibold mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              Alert Level
            </div>
            <AlertSeverityChip level={district.alert_level} />
          </div>
        </div>

        {/* Coordinates */}
        <div className="text-xs" style={{ color: 'var(--color-text-secondary)', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
          📍 {district.lat?.toFixed(4)}°N, {district.lon?.toFixed(4)}°E
        </div>
      </div>
    </div>
  )
}
