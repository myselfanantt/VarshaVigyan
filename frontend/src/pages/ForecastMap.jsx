import { useState, useEffect, useRef } from 'react'
import IndiaMap from '../components/map/IndiaMap.jsx'
import DistrictPopup from '../components/map/DistrictPopup.jsx'
import RegimeChip from '../components/ui/RegimeChip.jsx'
import AlertSeverityChip from '../components/ui/AlertSeverityChip.jsx'
import { getMapData } from '../api/forecastApi.js'
import { MOCK_DISTRICTS } from '../data/mockDistricts.js'

const DATES = ['Today', 'Tomorrow', 'Day +2']

export default function ForecastMap() {
  const [districts, setDistricts] = useState(MOCK_DISTRICTS)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedDate, setSelectedDate] = useState(0)
  const [leadTime, setLeadTime] = useState(24)
  const [layer, setLayer] = useState('rainfall')
  const [animating, setAnimating] = useState(false)
  const animRef = useRef(null)

  useEffect(() => {
    getMapData().then(setDistricts).catch(() => setDistricts(MOCK_DISTRICTS))
  }, [])

  // Animation cycle through dates
  useEffect(() => {
    if (animating) {
      animRef.current = setInterval(() => {
        setSelectedDate((d) => (d + 1) % 3)
      }, 1500)
    } else {
      clearInterval(animRef.current)
    }
    return () => clearInterval(animRef.current)
  }, [animating])

  // Get corrected_mm for selected lead time
  const districtWithLeadTime = districts.map((d) => ({
    ...d,
    corrected_mm:
      leadTime === 24 ? d.t24_corrected ?? d.corrected_mm
      : leadTime === 48 ? d.t48_corrected ?? d.corrected_mm
      : d.t72_corrected ?? d.corrected_mm,
    raw_nwp_mm:
      leadTime === 24 ? d.t24_raw ?? d.raw_nwp_mm
      : leadTime === 48 ? d.t48_raw ?? d.raw_nwp_mm
      : d.t72_raw ?? d.raw_nwp_mm,
  }))

  // Top 15 districts sorted by corrected rainfall
  const top15 = [...districtWithLeadTime]
    .sort((a, b) => (b.corrected_mm || 0) - (a.corrected_mm || 0))
    .slice(0, 15)

  const handleDistrictClick = (d) => {
    // Find full district data
    const full = MOCK_DISTRICTS.find((x) => x.id === d.id || x.name === d.name) || d
    setSelectedDistrict(full)
  }

  const MEDAL = ['🥇', '🥈', '🥉']

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date pills */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Date</label>
            <div className="flex gap-1.5">
              {DATES.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(i)}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                  style={{
                    borderColor: selectedDate === i ? '#1A6FE8' : '#e2e8f0',
                    backgroundColor: selectedDate === i ? '#1A6FE8' : 'white',
                    color: selectedDate === i ? 'white' : 'var(--color-text-secondary)',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Lead time */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Lead Time</label>
            <div className="flex gap-1.5">
              {[24, 48, 72].map((lt) => (
                <button
                  key={lt}
                  onClick={() => setLeadTime(lt)}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                  style={{
                    borderColor: leadTime === lt ? '#1A6FE8' : '#e2e8f0',
                    backgroundColor: leadTime === lt ? '#1A6FE8' : 'white',
                    color: leadTime === lt ? 'white' : 'var(--color-text-secondary)',
                  }}
                >
                  T+{lt}h
                </button>
              ))}
            </div>
          </div>

          {/* Layer selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Layer</label>
            <div className="flex gap-1.5">
              {[
                { id: 'rainfall', label: 'Rainfall Amount' },
                { id: 'probability', label: 'Heavy Rain Prob.' },
                { id: 'regime', label: 'Regime' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayer(l.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                  style={{
                    borderColor: layer === l.id ? '#1A6FE8' : '#e2e8f0',
                    backgroundColor: layer === l.id ? '#1A6FE8' : 'white',
                    color: layer === l.id ? 'white' : 'var(--color-text-secondary)',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animate button */}
          <button
            onClick={() => setAnimating((a) => !a)}
            className="ml-auto text-xs px-4 py-2 rounded-lg font-semibold border transition-colors"
            style={{
              borderColor: animating ? '#DC2626' : '#1A6FE8',
              color: animating ? '#DC2626' : '#1A6FE8',
              backgroundColor: animating ? '#fef2f2' : '#eff6ff',
            }}
          >
            {animating ? '⏹ Stop' : '▶ Animate'}
          </button>

          {animating && (
            <span
              className="text-xs px-2 py-1 rounded font-semibold"
              style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
            >
              {DATES[selectedDate]} — Auto-cycling
            </span>
          )}
        </div>
      </div>

      {/* Map + District Popup */}
      <div
        className="relative"
        style={{ display: 'flex', gap: '16px' }}
      >
        <div
          className="card overflow-hidden"
          style={{
            flex: 1,
            height: '440px',
            transition: 'flex 0.3s ease',
          }}
        >
          <IndiaMap
            onStateClick={handleDistrictClick}
            selectedLayer={layer}
            layerData={districtWithLeadTime}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* Selected district popup outside map to avoid Leaflet z-index issues */}
      {selectedDistrict && (
        <DistrictPopup
          district={selectedDistrict}
          onClose={() => setSelectedDistrict(null)}
        />
      )}

      {/* Top 15 districts table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Top 15 Districts by Forecasted Rainfall — T+{leadTime}h
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>#</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>District</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>State</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>Regime</th>
                <th className="px-3 py-2.5 text-right" style={{ color: 'var(--color-text-secondary)' }}>Raw NWP</th>
                <th className="px-3 py-2.5 text-right" style={{ color: 'var(--color-text-secondary)' }}>Corrected</th>
                <th className="px-3 py-2.5" style={{ color: 'var(--color-text-secondary)' }}>Heavy Rain Prob.</th>
                <th className="px-3 py-2.5 text-left" style={{ color: 'var(--color-text-secondary)' }}>Alert</th>
              </tr>
            </thead>
            <tbody>
              {top15.map((d, i) => (
                <tr
                  key={d.id}
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                  style={{ borderBottom: '1px solid #f8fafc' }}
                  onClick={() => setSelectedDistrict(MOCK_DISTRICTS.find((x) => x.id === d.id) || d)}
                >
                  <td className="px-3 py-2.5">
                    <span>{i < 3 ? MEDAL[i] : i + 1}</span>
                  </td>
                  <td className="px-3 py-2.5 font-semibold" style={{ color: 'var(--color-text-primary)' }}>{d.name}</td>
                  <td className="px-3 py-2.5" style={{ color: 'var(--color-text-secondary)' }}>{d.state}</td>
                  <td className="px-3 py-2.5"><RegimeChip regime={d.regime} /></td>
                  <td className="px-3 py-2.5 text-right" style={{ color: '#94a3b8' }}>{d.raw_nwp_mm?.toFixed(1)} mm</td>
                  <td className="px-3 py-2.5 text-right font-semibold" style={{ color: '#1A6FE8' }}>{d.corrected_mm?.toFixed(1)} mm</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100" style={{ maxWidth: '80px' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${Math.round((d.heavy_rain_prob || 0) * 100)}%`,
                            backgroundColor: (d.heavy_rain_prob || 0) > 0.8 ? '#DC2626' : (d.heavy_rain_prob || 0) > 0.6 ? '#E84E1A' : '#F59E0B',
                          }}
                        />
                      </div>
                      <span style={{ color: 'var(--color-text-secondary)', minWidth: '32px' }}>
                        {Math.round((d.heavy_rain_prob || 0) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5"><AlertSeverityChip level={d.alert_level} variant="outline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
