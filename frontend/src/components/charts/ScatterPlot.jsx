import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="card px-3 py-2 text-xs shadow-lg">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0]?.fill }} />
        <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {payload[0]?.name}
        </span>
      </div>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Observed: <strong>{d.x?.toFixed(1)} mm</strong>
      </p>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Forecast: <strong>{d.y?.toFixed(1)} mm</strong>
      </p>
    </div>
  )
}

export default function ScatterPlot({ data }) {
  if (!data || data.length === 0) return null

  const maxVal = Math.ceil(Math.max(...data.map((d) => Math.max(d.observed, d.raw_nwp, d.corrected))) / 10) * 10 + 10

  // Transform data for scatter series
  const rawData = data.map((d) => ({ x: d.observed, y: d.raw_nwp }))
  const correctedData = data.map((d) => ({ x: d.observed, y: d.corrected }))

  // 1:1 perfect line endpoints
  const line1to1 = [{ x: 0, y: 0 }, { x: maxVal, y: maxVal }]

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 40, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          type="number"
          dataKey="x"
          name="Observed"
          domain={[0, maxVal]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          label={{
            value: 'Observed (mm)',
            position: 'insideBottom',
            offset: -25,
            fontSize: 12,
            fill: '#64748b',
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Forecast"
          domain={[0, maxVal]}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          label={{
            value: 'Forecast (mm)',
            angle: -90,
            position: 'insideLeft',
            offset: 10,
            fontSize: 12,
            fill: '#64748b',
          }}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          formatter={(v) => <span style={{ color: 'var(--color-text-secondary)' }}>{v}</span>}
        />
        {/* 1:1 perfect forecast reference line */}
        <ReferenceLine
          segment={line1to1}
          stroke="#0D1B2A"
          strokeDasharray="6 3"
          strokeWidth={1.5}
          label={{
            value: 'Perfect (1:1)',
            fontSize: 10,
            fill: '#64748b',
            position: 'insideTopLeft',
          }}
        />
        <Scatter
          name="Raw NWP"
          data={rawData}
          fill="#94A3B8"
          fillOpacity={0.65}
          r={4}
        />
        <Scatter
          name="Corrected"
          data={correctedData}
          fill="#1A6FE8"
          fillOpacity={0.75}
          r={4}
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
