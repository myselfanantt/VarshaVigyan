import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Cloud, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'
import KPICard from '../components/ui/KPICard.jsx'
import RegimeChip from '../components/ui/RegimeChip.jsx'
import AlertSeverityChip from '../components/ui/AlertSeverityChip.jsx'
import RMSELineChart from '../components/charts/RMSELineChart.jsx'
import IndiaMap from '../components/map/IndiaMap.jsx'
import { getMapData, getAlerts } from '../api/forecastApi.js'
import { MOCK_DISTRICTS, getAlerts as mockGetAlerts } from '../data/mockDistricts.js'
import { MOCK_REGIME_HISTORY, REGIME_COLORS } from '../data/mockRegimes.js'
import { MOCK_RMSE_DATA } from '../data/mockForecast.js'

export default function Dashboard() {
  const [demoMode, setDemoMode] = useState(false)
  const [selectedStateInfo, setSelectedStateInfo] = useState(null)

  // Fetch map data — fall back to mock on error
  const { data: mapData } = useQuery({
    queryKey: ['mapData'],
    queryFn: getMapData,
    onError: () => setDemoMode(true),
    retry: 1,
    onSuccess: () => setDemoMode(false),
  })

  const { data: alertsData } = useQuery({
    queryKey: ['alerts'],
    queryFn: getAlerts,
    retry: 1,
  })

  const districts = mapData || MOCK_DISTRICTS
  const alerts = alertsData || mockGetAlerts()

  const handleStateClick = (stateData) => {
    // Find top 3 districts for this state
    const name = stateData.state_name || stateData.state
    const stateDists = MOCK_DISTRICTS.filter((d) => d.state === name).slice(0, 3)
    setSelectedStateInfo({ name, districts: stateDists, regime: stateData.regime })
  }

  return (
    <div className="space-y-5">
      {demoMode && (
        <div className="demo-banner rounded-lg text-xs py-2 px-4 flex items-center gap-2">
          <span>🔶</span>
          <span>Backend unreachable — displaying demo data. Outputs are for demonstration purposes only.</span>
        </div>
      )}

      {/* ── Row 1: KPI Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Current Regime"
          value={<RegimeChip regime="Active Monsoon" size="md" />}
          subtitle="Confidence: 87%"
          icon={Cloud}
          accentColor="#18A86B"
        />
        <KPICard
          title="Forecast RMSE"
          value="4.2 mm"
          subtitle="Raw NWP: 6.8 mm"
          trend={{ direction: 'down', value: '38% improved', positive: true }}
          icon={TrendingDown}
          accentColor="#1A6FE8"
        />
        <KPICard
          title="Heavy Rain Districts"
          value={String(alerts.length)}
          subtitle="Maharashtra, Kerala, WB"
          trend={{ direction: 'up', value: '+3 from yesterday', positive: false }}
          icon={AlertTriangle}
          accentColor="#E84E1A"
        />
        <KPICard
          title="Model Run Status"
          value="00Z Complete"
          subtitle="Next run: 18:00 IST"
          icon={CheckCircle}
          accentColor="#18A86B"
        />
      </div>

      {/* ── Row 2: Map + Alerts ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              India Forecast Map
            </h2>
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#eff6ff', color: '#1A6FE8' }}>
              Live · {new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' })} IST
            </span>
          </div>
          <div style={{ height: '340px' }}>
            <IndiaMap
              onStateClick={handleStateClick}
              layerData={districts}
            />
          </div>
          {selectedStateInfo && (
            <div
              className="mt-3 p-3 rounded-lg animate-fade-in"
              style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                📍 {selectedStateInfo.name} — Top Districts
              </p>
              <div className="space-y-1">
                {selectedStateInfo.districts.map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--color-text-secondary)' }}>{d.name}</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {d.corrected_mm?.toFixed(1)} mm
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Alerts */}
        <div className="lg:col-span-2 card p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} style={{ color: '#E84E1A' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Active Alerts
            </h2>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: '#DC2626' }}
            >
              {alerts.length}
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
              <CheckCircle size={28} style={{ color: '#18A86B' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>No active alerts</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {alerts.slice(0, 12).map((d) => (
                <div
                  key={d.id}
                  className="p-2.5 rounded-lg"
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {d.name}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{d.state}</p>
                    </div>
                    <AlertSeverityChip level={d.alert_level} />
                  </div>
                  {/* Probability bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-200">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.round(d.heavy_rain_prob * 100)}%`,
                          backgroundColor:
                            d.heavy_rain_prob > 0.8 ? '#DC2626'
                            : d.heavy_rain_prob > 0.6 ? '#E84E1A'
                            : '#F59E0B',
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text-secondary)', minWidth: '28px' }}>
                      {Math.round(d.heavy_rain_prob * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: RMSE Chart + Regime History ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* RMSE Chart */}
        <div className="card p-4">
          <RMSELineChart
            data={MOCK_RMSE_DATA}
            title="RMSE Improvement — Last 14 Days"
          />
        </div>

        {/* Regime History */}
        <div className="card p-4">
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Regime History — Last 14 Days
          </h2>
          <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: '240px' }}>
            {MOCK_REGIME_HISTORY.map((item) => {
              const color = REGIME_COLORS[item.regime] || '#94a3b8'
              return (
                <div key={item.date} className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-mono flex-shrink-0"
                    style={{ color: 'var(--color-text-secondary)', width: '76px' }}
                  >
                    {item.date}
                  </span>
                  <div
                    className="flex-1 flex items-center justify-between px-2.5 py-1 rounded"
                    style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <span className="text-xs font-medium" style={{ color }}>
                      {item.regime}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
