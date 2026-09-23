import { useState } from 'react'
import { Brain } from 'lucide-react'
import { classifyRegime } from '../api/regimeApi.js'
import useAppStore from '../store/useAppStore.js'
import RegimeChip from '../components/ui/RegimeChip.jsx'
import RegimeConfidenceBar from '../components/charts/RegimeConfidenceBar.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import { REGIME_COLORS, REGIME_ICONS } from '../data/mockRegimes.js'

// Mock classifier for offline use
function mockClassify(params) {
  const { wind_850, z500, olr, slp, vorticity, cape } = params
  if (vorticity > 5 && slp < 1000 && cape > 1500) {
    return {
      regime: 'Monsoon Depression', confidence: 0.88,
      correction_method: 'Analog Ensemble',
      all_scores: { 'Monsoon Depression': 0.88, 'Active Monsoon': 0.06, 'Orographic Rainfall': 0.03, 'Coastal Rainfall': 0.01, 'Break Monsoon': 0.01, 'Western Disturbance': 0.01 },
      key_features: [{ feature: 'vorticity', importance: 0.41 }, { feature: 'slp', importance: 0.34 }, { feature: 'cape', importance: 0.25 }],
      explanation: `Monsoon Depression detected. Vorticity ${vorticity} ×10⁻⁵ s⁻¹ exceeds threshold, SLP ${slp} hPa is below 1000 hPa, and CAPE ${cape} J/kg confirms deep convective instability.`,
      historical_analogs: [
        { date: '2024-08-14', regime: 'Monsoon Depression', observed_rainfall_mm: 187.4, location: 'Odisha' },
        { date: '2023-07-28', regime: 'Monsoon Depression', observed_rainfall_mm: 213.6, location: 'West Bengal' },
        { date: '2024-09-03', regime: 'Monsoon Depression', observed_rainfall_mm: 156.8, location: 'Andhra Pradesh' },
      ],
    }
  }
  if (wind_850 > 10 && olr < 220 && vorticity > 2) {
    return {
      regime: 'Active Monsoon', confidence: 0.87,
      correction_method: 'Quantile Mapping',
      all_scores: { 'Active Monsoon': 0.87, 'Break Monsoon': 0.04, 'Monsoon Depression': 0.04, 'Coastal Rainfall': 0.03, 'Orographic Rainfall': 0.01, 'Western Disturbance': 0.01 },
      key_features: [{ feature: 'wind_850', importance: 0.38 }, { feature: 'olr', importance: 0.32 }, { feature: 'vorticity', importance: 0.30 }],
      explanation: `Active Monsoon detected. 850hPa wind ${wind_850} m/s drives strong moisture flux. OLR ${olr} W/m² confirms deep convection. Positive vorticity ${vorticity} supports cyclonic circulation.`,
      historical_analogs: [
        { date: '2024-07-15', regime: 'Active Monsoon', observed_rainfall_mm: 87.3, location: 'Maharashtra' },
        { date: '2023-08-02', regime: 'Active Monsoon', observed_rainfall_mm: 124.1, location: 'Kerala' },
        { date: '2024-06-28', regime: 'Active Monsoon', observed_rainfall_mm: 63.8, location: 'West Bengal' },
      ],
    }
  }
  return {
    regime: 'Break Monsoon', confidence: 0.72,
    correction_method: 'Linear Regression',
    all_scores: { 'Break Monsoon': 0.72, 'Active Monsoon': 0.12, 'Coastal Rainfall': 0.07, 'Western Disturbance': 0.05, 'Orographic Rainfall': 0.02, 'Monsoon Depression': 0.02 },
    key_features: [{ feature: 'olr', importance: 0.38 }, { feature: 'wind_850', importance: 0.34 }, { feature: 'vorticity', importance: 0.28 }],
    explanation: `Break Monsoon inferred. Wind ${wind_850} m/s below active threshold, OLR ${olr} W/m² above 220 indicates suppressed convection. Weak cyclonic support.`,
    historical_analogs: [
      { date: '2024-08-05', regime: 'Break Monsoon', observed_rainfall_mm: 4.2, location: 'Nagpur, MH' },
      { date: '2023-07-12', regime: 'Break Monsoon', observed_rainfall_mm: 6.8, location: 'Bhopal, MP' },
      { date: '2024-09-18', regime: 'Break Monsoon', observed_rainfall_mm: 2.1, location: 'Jodhpur, RJ' },
    ],
  }
}

// Parameter slider input
function ParamInput({ label, unit, min, max, step, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </label>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
          style={{ backgroundColor: '#eff6ff', color: '#1A6FE8' }}
        >
          {unit}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1"
          style={{
            background: `linear-gradient(to right, #1A6FE8 0%, #1A6FE8 ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`,
          }}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value)
            if (!isNaN(v) && v >= min && v <= max) onChange(v)
          }}
          className="w-20 text-center text-sm font-semibold border rounded px-2 py-1 focus:outline-none focus:border-blue-400"
          style={{ borderColor: '#e2e8f0', color: 'var(--color-text-primary)' }}
        />
      </div>
    </div>
  )
}

// Key features horizontal bar
function FeatureImportanceBar({ features }) {
  return (
    <div className="space-y-2">
      {features.map((f) => (
        <div key={f.feature}>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--color-text-secondary)' }}>{f.feature}</span>
            <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {Math.round(f.importance * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.round(f.importance * 100)}%`,
                backgroundColor: '#1A6FE8',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RegimeClassifier() {
  const { addToast, setClassificationResult, classificationResult } = useAppStore()

  const now = new Date()
  const [params, setParams] = useState({
    wind_850: 12,
    z500: 5760,
    olr: 210,
    slp: 1008,
    vorticity: 3.5,
    cape: 1200,
  })
  const [date, setDate] = useState(now.toISOString().split('T')[0])
  const [time, setTime] = useState(now.toTimeString().slice(0, 5))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(classificationResult)
  const [explExpanded, setExplExpanded] = useState(false)

  const setParam = (key) => (val) => setParams((p) => ({ ...p, [key]: val }))

  const handleClassify = async () => {
    setLoading(true)
    try {
      const res = await classifyRegime({
        ...params,
        datetime: `${date}T${time}:00`,
      })
      setResult(res)
      setClassificationResult(res)
      addToast(`Regime classified: ${res.regime} (${Math.round(res.confidence * 100)}%)`, 'success')
    } catch {
      // Fall back to mock classifier
      const res = mockClassify(params)
      setResult(res)
      setClassificationResult(res)
      addToast(`Regime classified: ${res.regime} (${Math.round(res.confidence * 100)}%) [demo]`, 'info')
    } finally {
      setLoading(false)
    }
  }

  const regimeColor = result ? (REGIME_COLORS[result.regime] || '#64748b') : '#1A6FE8'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* Left panel — inputs */}
      <div className="lg:col-span-2 card p-5 space-y-4">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Atmospheric Parameters
        </h2>

        <ParamInput label="850hPa Wind Speed"          unit="m/s"         min={0}    max={30}   step={0.5} value={params.wind_850}  onChange={setParam('wind_850')} />
        <ParamInput label="500hPa Geopotential Height" unit="m"           min={5500} max={5900} step={10}  value={params.z500}      onChange={setParam('z500')} />
        <ParamInput label="Outgoing Longwave Radiation"unit="W/m²"        min={150}  max={300}  step={5}   value={params.olr}       onChange={setParam('olr')} />
        <ParamInput label="Sea Level Pressure"         unit="hPa"         min={990}  max={1020} step={0.5} value={params.slp}       onChange={setParam('slp')} />
        <ParamInput label="Relative Vorticity"         unit="×10⁻⁵ s⁻¹"  min={-10}  max={10}   step={0.5} value={params.vorticity} onChange={setParam('vorticity')} />
        <ParamInput label="CAPE"                        unit="J/kg"        min={0}    max={3000} step={50}  value={params.cape}      onChange={setParam('cape')} />

        {/* DateTime */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Forecast Date &amp; Time
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 text-sm border rounded px-2 py-1.5 focus:outline-none focus:border-blue-400"
              style={{ borderColor: '#e2e8f0', color: 'var(--color-text-primary)' }}
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-24 text-sm border rounded px-2 py-1.5 focus:outline-none focus:border-blue-400"
              style={{ borderColor: '#e2e8f0', color: 'var(--color-text-primary)' }}
            />
          </div>
        </div>

        {/* Classify button */}
        <button
          onClick={handleClassify}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-white transition-all"
          style={{
            backgroundColor: loading ? '#93c5fd' : '#1A6FE8',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <>
              <LoadingSpinner size={16} color="white" />
              <span>Classifying…</span>
            </>
          ) : (
            <>
              <Brain size={16} />
              <span>Classify Regime</span>
            </>
          )}
        </button>
      </div>

      {/* Right panel — results */}
      <div className="lg:col-span-3 space-y-4">
        {!result ? (
          <div
            className="card p-10 flex flex-col items-center justify-center gap-3 text-center"
            style={{ minHeight: '300px' }}
          >
            <Brain size={40} style={{ color: '#cbd5e1' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Adjust the atmospheric parameters and click
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              "Classify Regime" to see the analysis
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Detected Regime card */}
            <div
              className="card p-5"
              style={{ borderLeft: `4px solid ${regimeColor}` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Detected Regime
                  </p>
                  <div
                    className="text-3xl font-bold leading-tight"
                    style={{ color: regimeColor }}
                  >
                    {result.regime}
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {Math.round(result.confidence * 100)}%
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>confidence</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: '#eff6ff', color: '#1A6FE8' }}
                    >
                      {result.correction_method}
                    </span>
                  </div>
                </div>
                <div className="text-5xl flex-shrink-0">
                  {REGIME_ICONS[result.regime] || '🌦️'}
                </div>
              </div>
            </div>

            {/* Confidence distribution */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Confidence Distribution
              </h3>
              <RegimeConfidenceBar scores={result.all_scores} />
            </div>

            {/* Key Features */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Key Feature Importances
              </h3>
              <FeatureImportanceBar features={result.key_features} />
            </div>

            {/* Historical Analogs */}
            <div className="card p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Historical Analogs
              </h3>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Date</th>
                    <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Location</th>
                    <th className="text-right pb-2" style={{ color: 'var(--color-text-secondary)' }}>Observed (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.historical_analogs.map((a, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td className="py-2 font-mono" style={{ color: 'var(--color-text-secondary)' }}>{a.date}</td>
                      <td className="py-2" style={{ color: 'var(--color-text-primary)' }}>{a.location}</td>
                      <td
                        className="py-2 text-right font-semibold"
                        style={{ color: regimeColor }}
                      >
                        {a.observed_rainfall_mm.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Why this regime accordion */}
            <div className="card overflow-hidden">
              <button
                onClick={() => setExplExpanded((e) => !e)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: 'var(--color-text-primary)' }}
              >
                <span>Why this regime?</span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>
                  {explExpanded ? '−' : '+'}
                </span>
              </button>
              {explExpanded && (
                <div
                  className="px-4 pb-4 text-sm leading-relaxed animate-fade-in"
                  style={{ color: 'var(--color-text-secondary)', borderTop: '1px solid #f1f5f9' }}
                >
                  <p className="pt-3">{result.explanation}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
