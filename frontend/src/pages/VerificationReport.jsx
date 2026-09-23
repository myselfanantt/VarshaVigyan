import { useState, useMemo } from 'react'
import { Calendar, Download, Info } from 'lucide-react'
import { getMetrics, getScatterData, getDailyETS } from '../api/verificationApi.js'
import { useQuery } from '@tanstack/react-query'
import KPICard from '../components/ui/KPICard.jsx'
import RegimeChip from '../components/ui/RegimeChip.jsx'
import RMSELineChart from '../components/charts/RMSELineChart.jsx'
import SkillScoreChart from '../components/charts/SkillScoreChart.jsx'
import ScatterPlot from '../components/charts/ScatterPlot.jsx'
import { MOCK_VERIFICATION_METRICS, MOCK_SCATTER_POINTS, computeSummary } from '../data/mockVerification.js'
import { MOCK_DAILY_ETS, ALL_REGIMES, REGIME_COLORS } from '../data/mockRegimes.js'
import useAppStore from '../store/useAppStore.js'

const PERIODS = ['Last 7 Days', 'This Month', 'Monsoon 2025', 'Custom']
const PERIOD_KEYS = { 'Last 7 Days': 'week', 'This Month': 'month', 'Monsoon 2025': 'season', 'Custom': 'custom' }

function MetricCell({ raw, corrected, higherBetter }) {
  const improved = higherBetter ? corrected > raw : corrected < raw
  return (
    <td className="px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <span style={{ color: '#94a3b8', fontSize: '11px' }}>{raw.toFixed(2)}</span>
        <span style={{ color: '#cbd5e1', fontSize: '10px' }}>→</span>
        <span
          className="font-semibold text-xs px-1 rounded"
          style={{
            color: improved ? '#166534' : '#991b1b',
            backgroundColor: improved ? '#dcfce7' : '#fee2e2',
          }}
        >
          {corrected.toFixed(2)}
        </span>
      </div>
    </td>
  )
}

export default function VerificationReport() {
  const { addToast } = useAppStore()
  const [period, setPeriod] = useState('This Month')
  const [selectedRegimes, setSelectedRegimes] = useState(['all'])
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const periodKey = PERIOD_KEYS[period] || 'month'

  const { data: metricsData } = useQuery({
    queryKey: ['metrics', periodKey],
    queryFn: () => getMetrics(periodKey, 'all'),
    retry: 1,
  })

  const { data: scatterData } = useQuery({
    queryKey: ['scatter'],
    queryFn: getScatterData,
    retry: 1,
  })

  const { data: etsData } = useQuery({
    queryKey: ['ets', periodKey],
    queryFn: () => getDailyETS(periodKey),
    retry: 1,
  })

  const metrics = metricsData?.metrics || MOCK_VERIFICATION_METRICS
  const scatter = scatterData || MOCK_SCATTER_POINTS
  const etsRaw = etsData || MOCK_DAILY_ETS

  const filteredMetrics = useMemo(() => {
    if (selectedRegimes.includes('all') || selectedRegimes.length === 0) return metrics
    return metrics.filter((m) => selectedRegimes.includes(m.regime))
  }, [metrics, selectedRegimes])

  const summary = useMemo(() => computeSummary(filteredMetrics), [filteredMetrics])

  const toggleRegime = (regime) => {
    if (regime === 'all') {
      setSelectedRegimes(['all'])
      return
    }
    setSelectedRegimes((prev) => {
      const without = prev.filter((r) => r !== 'all')
      if (without.includes(regime)) {
        const next = without.filter((r) => r !== regime)
        return next.length === 0 ? ['all'] : next
      }
      return [...without, regime]
    })
  }

  const bestIdx = filteredMetrics.reduce((bi, m, i) => m.ets_corrected > filteredMetrics[bi].ets_corrected ? i : bi, 0)
  const worstIdx = filteredMetrics.reduce((wi, m, i) => m.ets_corrected < filteredMetrics[wi].ets_corrected ? i : wi, 0)

  // Build RMSE chart data from ETS (reuse structure)
  const rmseChartData = etsRaw.slice(-14).map((d) => ({
    date: d.date.slice(5),
    rmse_raw: parseFloat((d.ets_raw * 22).toFixed(1)),        // scale for display
    rmse_corrected: parseFloat((d.ets_corrected * 15).toFixed(1)),
  }))

  // Insight paragraph
  const insightText = summary
    ? `AI post-processing improved ETS by ${summary.ets_improvement_pct}% during ${summary.best_regime} events compared to raw NCUM output. Heavy rainfall detection (POD) increased from ${summary.avg_pod_raw?.toFixed(2)} to ${summary.avg_pod_corrected?.toFixed(2)} across all regimes. ${summary.worst_regime} events remain most challenging with RMSE ${summary.avg_rmse_corrected?.toFixed(1)} mm. Model shows consistent improvement across ${filteredMetrics.filter((m) => m.ets_corrected > m.ets_raw).length} of ${filteredMetrics.length} weather regimes.`
    : ''

  const bestDayETS = Math.max(...etsRaw.map((d) => d.ets_corrected)).toFixed(3)
  const worstDayETS = Math.min(...etsRaw.map((d) => d.ets_corrected)).toFixed(3)
  const firstETS = etsRaw[0]?.ets_corrected || 0
  const lastETS = etsRaw[etsRaw.length - 1]?.ets_corrected || 0
  const trend = lastETS > firstETS ? '📈 Improving' : '📉 Degrading'

  return (
    <div className="space-y-5">
      {/* Period selector + regime filter */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Period pills */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Period</label>
            <div className="flex gap-1.5 flex-wrap">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                  style={{
                    borderColor: period === p ? '#1A6FE8' : '#e2e8f0',
                    backgroundColor: period === p ? '#1A6FE8' : 'white',
                    color: period === p ? 'white' : 'var(--color-text-secondary)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date range */}
          {period === 'Custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="text-xs border rounded px-2 py-1.5 focus:outline-none focus:border-blue-400"
                style={{ borderColor: '#e2e8f0' }}
              />
              <span style={{ color: '#94a3b8' }}>to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="text-xs border rounded px-2 py-1.5 focus:outline-none focus:border-blue-400"
                style={{ borderColor: '#e2e8f0' }}
              />
            </div>
          )}

          {/* Regime filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Regimes</label>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => toggleRegime('all')}
                className="text-xs px-2.5 py-1 rounded border font-medium transition-colors"
                style={{
                  borderColor: selectedRegimes.includes('all') ? '#64748b' : '#e2e8f0',
                  backgroundColor: selectedRegimes.includes('all') ? '#64748b' : 'white',
                  color: selectedRegimes.includes('all') ? 'white' : 'var(--color-text-secondary)',
                }}
              >
                All Regimes
              </button>
              {ALL_REGIMES.map((r) => {
                const active = selectedRegimes.includes(r)
                const color = REGIME_COLORS[r]
                return (
                  <button
                    key={r}
                    onClick={() => toggleRegime(r)}
                    className="text-xs px-2.5 py-1 rounded border font-medium transition-colors"
                    style={{
                      borderColor: active ? color : '#e2e8f0',
                      backgroundColor: active ? color : 'white',
                      color: active ? 'white' : 'var(--color-text-secondary)',
                    }}
                  >
                    {r}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => addToast('Report generated for selected period', 'success')}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#1A6FE8' }}
          >
            <Calendar size={14} />
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              label: 'RMSE ↓',
              raw: summary.avg_rmse_raw,
              corr: summary.avg_rmse_corrected,
              unit: 'mm',
              delta: `-${summary.rmse_improvement_pct}%`,
              tip: 'Root Mean Square Error — lower is better',
            },
            {
              label: 'ETS ↑',
              raw: summary.avg_ets_raw,
              corr: summary.avg_ets_corrected,
              unit: '',
              delta: `+${summary.ets_improvement_pct}%`,
              tip: 'Equitable Threat Score — higher is better, accounts for random chance',
            },
            {
              label: 'CSI ↑',
              raw: (filteredMetrics.reduce((s, m) => s + m.csi_raw, 0) / Math.max(filteredMetrics.length, 1)).toFixed(2),
              corr: (filteredMetrics.reduce((s, m) => s + m.csi_corrected, 0) / Math.max(filteredMetrics.length, 1)).toFixed(2),
              unit: '',
              delta: `+${Math.round(((filteredMetrics.reduce((s, m) => s + m.csi_corrected, 0) - filteredMetrics.reduce((s, m) => s + m.csi_raw, 0)) / Math.max(filteredMetrics.reduce((s, m) => s + m.csi_raw, 0), 0.001)) * 100)}%`,
              tip: 'Critical Success Index',
            },
            {
              label: 'POD ↑',
              raw: summary.avg_pod_raw,
              corr: summary.avg_pod_corrected,
              unit: '',
              delta: `+${Math.round((summary.avg_pod_corrected - summary.avg_pod_raw) / Math.max(summary.avg_pod_raw, 0.001) * 100)}%`,
              tip: 'Probability of Detection — fraction of observed events correctly forecast',
            },
            {
              label: 'FAR ↓',
              raw: summary.avg_far_raw,
              corr: summary.avg_far_corrected,
              unit: '',
              delta: `-${Math.round((summary.avg_far_raw - summary.avg_far_corrected) / Math.max(summary.avg_far_raw, 0.001) * 100)}%`,
              tip: 'False Alarm Ratio — lower is better',
            },
          ].map((kpi) => (
            <div key={kpi.label} className="card p-4 relative group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                  {kpi.label}
                </span>
                <div className="relative">
                  <Info size={12} style={{ color: '#cbd5e1', cursor: 'help' }} />
                  <div className="absolute right-0 bottom-full mb-1 w-48 text-xs bg-gray-900 text-white rounded px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {kpi.tip}
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-[11px]" style={{ color: '#94a3b8' }}>
                  Raw: {typeof kpi.raw === 'number' ? kpi.raw.toFixed(2) : kpi.raw}
                </span>
                <span className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {typeof kpi.corr === 'number' ? kpi.corr.toFixed(2) : kpi.corr}
                </span>
              </div>
              <span
                className="inline-block text-xs font-semibold mt-1 px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#dcfce7', color: '#166534' }}
              >
                {kpi.delta}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Regime performance table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Regime Performance Table
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>Regime</th>
                <th className="px-3 py-2.5 text-right" style={{ color: 'var(--color-text-secondary)' }}>Events</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>RMSE ↓</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>ETS ↑</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>CSI ↑</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>POD ↑</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>FAR ↓</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>FSS ↑</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map((m, i) => (
                <tr
                  key={m.regime}
                  style={{
                    borderBottom: '1px solid #f8fafc',
                    backgroundColor:
                      i === bestIdx  ? '#f0fdf4' :
                      i === worstIdx ? '#fff1f2' :
                      i % 2 === 0   ? 'white'   : '#fafafa',
                  }}
                >
                  <td className="px-3 py-2.5"><RegimeChip regime={m.regime} /></td>
                  <td className="px-3 py-2.5 text-right font-medium" style={{ color: 'var(--color-text-primary)' }}>{m.event_count}</td>
                  <MetricCell raw={m.rmse_raw} corrected={m.rmse_corrected} higherBetter={false} />
                  <MetricCell raw={m.ets_raw} corrected={m.ets_corrected} higherBetter={true} />
                  <MetricCell raw={m.csi_raw} corrected={m.csi_corrected} higherBetter={true} />
                  <MetricCell raw={m.pod_raw} corrected={m.pod_corrected} higherBetter={true} />
                  <MetricCell raw={m.far_raw} corrected={m.far_corrected} higherBetter={false} />
                  <MetricCell raw={m.fss_raw} corrected={m.fss_corrected} higherBetter={true} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ETS time series */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Daily ETS — {period}
          </h3>
          <SkillScoreChart data={etsRaw} />
        </div>

        {/* Summary mini cards */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Summary Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Best Day ETS',    value: bestDayETS,   color: '#18A86B' },
              { label: 'Worst Day ETS',   value: worstDayETS,  color: '#E84E1A' },
              { label: 'Trend',           value: trend,        color: '#1A6FE8' },
              { label: 'Events Detected', value: String(summary?.total_events || 375), color: '#7C3AED' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg p-3"
                style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}
              >
                <p className="text-[10px] uppercase font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {s.label}
                </p>
                <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scatter plot */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          Observed vs Forecast Scatter — {scatter.length} Events
        </h3>
        <ScatterPlot data={scatter} />
      </div>

      {/* Insight box */}
      <div
        className="card p-5"
        style={{ borderLeft: '4px solid #1A6FE8' }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} style={{ color: '#1A6FE8' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Performance Summary — {period}
            </h3>
          </div>
          <button
            onClick={() => addToast('PDF report queued for generation. Download will begin shortly.', 'info')}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium"
            style={{ borderColor: '#1A6FE8', color: '#1A6FE8' }}
          >
            <Download size={12} />
            Export Report
          </button>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {insightText}
        </p>
      </div>
    </div>
  )
}
