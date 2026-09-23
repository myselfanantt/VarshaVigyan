import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine,
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

export default function BiasComparisonChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
        barCategoryGap="30%"
        barGap={4}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="district"
          tick={{ fontSize: 11, fill: '#64748b' }}
          angle={-45}
          textAnchor="end"
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          unit=" mm"
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '4px' }}
          formatter={(v) => <span style={{ color: 'var(--color-text-secondary)' }}>{v}</span>}
        />
        {/* Heavy rain threshold */}
        <ReferenceLine
          y={64}
          stroke="#F59E0B"
          strokeDasharray="5 3"
          label={{
            value: 'Heavy (64mm)',
            fontSize: 10,
            fill: '#F59E0B',
            position: 'insideTopRight',
          }}
        />
        {/* Very heavy rain threshold */}
        <ReferenceLine
          y={115}
          stroke="#DC2626"
          strokeDasharray="5 3"
          label={{
            value: 'Very Heavy (115mm)',
            fontSize: 10,
            fill: '#DC2626',
            position: 'insideTopRight',
          }}
        />
        <Bar dataKey="raw_nwp" name="Raw NWP" fill="#94A3B8" radius={[3, 3, 0, 0]} />
        <Bar dataKey="corrected" name="Corrected" fill="#1A6FE8" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
