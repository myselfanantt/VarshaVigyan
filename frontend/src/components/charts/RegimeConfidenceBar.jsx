import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, LabelList,
} from 'recharts'
import { REGIME_COLORS } from '../../data/mockRegimes.js'

export default function RegimeConfidenceBar({ scores }) {
  if (!scores) return null

  // Build sorted array from scores object
  const data = Object.entries(scores)
    .map(([regime, value]) => ({ regime, value: parseFloat((value * 100).toFixed(1)) }))
    .sort((a, b) => b.value - a.value)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const { regime, value } = payload[0].payload
    return (
      <div className="card px-3 py-2 text-xs shadow-lg">
        <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{regime}</p>
        <p style={{ color: 'var(--color-text-secondary)' }}>Confidence: <strong>{value}%</strong></p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
        barSize={16}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="regime"
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 3, 3, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.regime}
              fill={REGIME_COLORS[entry.regime] || '#94a3b8'}
            />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => `${v}%`}
            style={{ fontSize: '11px', fill: '#64748b', fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
