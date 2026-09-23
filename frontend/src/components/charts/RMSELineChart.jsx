import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>{p.name}:</span>
          <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {p.value?.toFixed(1)} mm
          </span>
        </div>
      ))}
    </div>
  )
}

export default function RMSELineChart({ data, title }) {
  return (
    <div>
      {title && (
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
            unit=" mm"
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            formatter={(value) => (
              <span style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="rmse_raw"
            name="Raw NWP"
            stroke="#E84E1A"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="rmse_corrected"
            name="Corrected"
            stroke="#1A6FE8"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
