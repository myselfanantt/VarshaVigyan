import { TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

export default function KPICard({ title, value, subtitle, trend, icon: Icon, accentColor }) {
  const isPositive = trend?.positive ?? true
  const isUp = trend?.direction === 'up'
  // Green when: positive & up, or positive & down (metric improves by going down like RMSE)
  const trendGreen = isPositive
  const TrendIcon = isUp ? TrendingUp : TrendingDown

  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between">
        <span
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {title}
        </span>
        {Icon && (
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${accentColor}18` }}
          >
            <Icon size={18} style={{ color: accentColor }} />
          </div>
        )}
      </div>

      {/* Value */}
      <div
        className="text-[28px] font-bold leading-none"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {value}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {subtitle}
        </span>
        {trend && (
          <div
            className={clsx(
              'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded',
              trendGreen
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600',
            )}
          >
            <TrendIcon size={11} />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  )
}
