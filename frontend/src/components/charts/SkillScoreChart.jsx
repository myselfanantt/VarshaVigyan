import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceArea,
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
            {p.value?.toFixed(3)}
          </span>
        </div>
      ))}
      {payload.length === 2 && (
        <p className="mt-1 text-[10px]" style={{ color: '#18A86B' }}>
          Improvement: +{((payload[1]?.value - payload[0]?.value) * 100).toFixed(1)}%
        </p>
      )}
    </div>
  )
}

export default function SkillScoreChart({ data }) {
  if (!data || data.length === 0) return null

  // Use date strings for tick display — abbreviate if many points
  const tickInterval = data.length > 20 ? 4 : data.length > 10 ? 2 : 0

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        {/* Improvement shading between the two lines */}
        <defs>
          <linearGradient id="improvementGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#18A86B" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#18A86B" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          interval={tickInterval}
          tickFormatter={(val) => val.slice(5)} // Show MM-DD only
        />
        <YAxis
          domain={[0, 0.85]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v.toFixed(2)}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          formatter={(v) => <span style={{ color: 'var(--color-text-secondary)' }}>{v}</span>}
        />
        {/* Shaded improvement area */}
        <ReferenceArea
          x1={data[0]?.date}
          x2={data[data.length - 1]?.date}
          y1={data.reduce((s, d) => s + d.ets_raw, 0) / data.length}
          y2={data.reduce((s, d) => s + d.ets_corrected, 0) / data.length}
          fill="url(#improvementGrad)"
        />
        <Line
          type="monotone"
          dataKey="ets_raw"
          name="Raw NWP ETS"
          stroke="#E84E1A"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="ets_corrected"
          name="Corrected ETS"
          stroke="#18A86B"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
