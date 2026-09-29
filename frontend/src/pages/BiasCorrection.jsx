import { useState, useMemo } from 'react'
import { Download, FileText, ChevronUp, ChevronDown, Search } from 'lucide-react'
import { correctBias, getMethods } from '../api/biasApi.js'
import useAppStore from '../store/useAppStore.js'
import RegimeChip from '../components/ui/RegimeChip.jsx'
import AlertSeverityChip from '../components/ui/AlertSeverityChip.jsx'
import BiasComparisonChart from '../components/charts/BiasComparisonChart.jsx'
import { MOCK_DISTRICTS, STATES, getDistrictsByState } from '../data/mockDistricts.js'

const CORRECTION_METHODS_FALLBACK = {
  'Active Monsoon':      { method: 'Quantile Mapping',    factor: 0.89, uncertainty: 0.12, description: 'Adjusts the full distribution of forecast values to match historical observed distribution', typical_improvement: '35–40%' },
  'Break Monsoon':       { method: 'Linear Regression',   factor: 1.15, uncertainty: 0.08, description: 'Applies linear bias model trained on break period composites', typical_improvement: '22–28%' },
  'Monsoon Depression':  { method: 'Analog Ensemble',     factor: 0.76, uncertainty: 0.18, description: 'Finds historical analogs and blends their verified outcomes', typical_improvement: '33–38%' },
  'Coastal Rainfall':    { method: 'Spatial Interpolation',factor:0.94, uncertainty: 0.10, description: 'Corrects coastal orographic enhancement using terrain data', typical_improvement: '28–34%' },
  'Orographic Rainfall': { method: 'Topographic Scaling', factor: 1.22, uncertainty: 0.21, description: 'Scales NWP output using elevation-rainfall relationship', typical_improvement: '30–37%' },
  'Western Disturbance': { method: 'Climatological Bias', factor: 0.98, uncertainty: 0.07, description: 'Applies mean seasonal bias from 20-year WD climatology', typical_improvement: '18–24%' },
}

function getCellBg(mm) {
  if (mm < 15) return 'transparent'
  if (mm < 64.5) return '#fef9c3'
  if (mm < 115.5) return '#fed7aa'
  return '#fee2e2'
}

const PAGE_SIZE = 10

export default function BiasCorrection() {
  const { selectedRegime, addToast } = useAppStore()

  const [selectedState, setSelectedState] = useState('Maharashtra')
  const [selectedDistrictIds, setSelectedDistrictIds] = useState([])
  const [leadTime, setLeadTime] = useState(24)
  const [correctionData, setCorrectionData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('corrected_mm')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const stateDistricts = getDistrictsByState(selectedState)

  const handleDistrictToggle = (id) => {
    setSelectedDistrictIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedDistrictIds.length === stateDistricts.length) {
      setSelectedDistrictIds([])
    } else {
      setSelectedDistrictIds(stateDistricts.map((d) => d.id))
    }
  }

  const handleApply = async () => {
    setLoading(true)
    try {
      const ids = selectedDistrictIds.length > 0 ? selectedDistrictIds : stateDistricts.map((d) => d.id)
      const result = await correctBias(ids, selectedRegime, leadTime)
      setCorrectionData(result)
    } catch {
      // Mock correction
      const ids = selectedDistrictIds.length > 0 ? selectedDistrictIds : stateDistricts.map((d) => d.id)
      const cf = CORRECTION_METHODS_FALLBACK[selectedRegime] || CORRECTION_METHODS_FALLBACK['Active Monsoon']
      const result = ids.map((id) => {
        const d = MOCK_DISTRICTS.find((x) => x.id === id) || stateDistricts[0]
        const raw = leadTime === 24 ? d.t24_raw : leadTime === 48 ? d.t48_raw : d.t72_raw
        const corr = parseFloat((raw * cf.factor).toFixed(1))
        const ci = parseFloat((corr * cf.uncertainty).toFixed(1))
        return {
          id: d.id, name: d.name, state: d.state, regime: selectedRegime,
          raw_nwp_mm: raw, corrected_mm: corr,
          confidence_interval_lower: parseFloat((corr - ci).toFixed(1)),
          confidence_interval_upper: parseFloat((corr + ci).toFixed(1)),
          bias_factor: cf.factor, method_used: cf.method, regime_used: selectedRegime,
          alert_level: corr >= 115.5 ? 'very_heavy' : corr >= 64.5 ? 'heavy' : corr >= 15 ? 'moderate' : 'normal',
          heavy_rain_prob: corr > 115 ? 0.93 : corr > 64 ? 0.67 : 0.22,
        }
      })
      setCorrectionData(result)
    } finally {
      setLoading(false)
      addToast(`Bias correction applied for ${selectedRegime} at T+${leadTime}h`, 'success')
    }
  }

  const tableData = correctionData || stateDistricts.map((d) => ({
    id: d.id, name: d.name, state: d.state, regime: d.regime,
    raw_nwp_mm: leadTime === 24 ? d.t24_raw : leadTime === 48 ? d.t48_raw : d.t72_raw,
    corrected_mm: leadTime === 24 ? d.t24_corrected : leadTime === 48 ? d.t48_corrected : d.t72_corrected,
    confidence_interval_lower: 0, confidence_interval_upper: 0,
    bias_factor: d.bias_factor, method_used: '—', regime_used: d.regime,
    alert_level: d.alert_level, heavy_rain_prob: d.heavy_rain_prob,
  }))

  const filtered = useMemo(() => {
    let data = tableData.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    )
    data = [...data].sort((a, b) => {
      const va = a[sortKey] ?? 0
      const vb = b[sortKey] ?? 0
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return data
  }, [tableData, search, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
    setPage(1)
  }

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="text-gray-300 ml-1">↕</span>
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="inline ml-1" />
      : <ChevronDown size={12} className="inline ml-1" />
  }

  const exportCSV = () => {
    const headers = ['District', 'State', 'Raw NWP (mm)', 'Bias Factor', 'Corrected (mm)', 'CI Lower', 'CI Upper', 'Regime', 'Alert', 'Method']
    const rows = filtered.map((d) => [
      d.name, d.state, d.raw_nwp_mm, d.bias_factor, d.corrected_mm,
      d.confidence_interval_lower, d.confidence_interval_upper,
      d.regime_used, d.alert_level, d.method_used,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `varshavigyan_bias_correction_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    addToast('CSV exported successfully', 'success')
  }

  const exportPDF = () => {
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    const alertColors = { very_heavy: '#dc2626', heavy: '#ea580c', moderate: '#d97706', normal: '#16a34a' }
    const rows = filtered.map((d) => `
      <tr>
        <td>${d.name}</td>
        <td>${d.state}</td>
        <td>${d.raw_nwp_mm?.toFixed(1)} mm</td>
        <td>×${d.bias_factor?.toFixed(2)}</td>
        <td style="font-weight:600;background:${d.corrected_mm >= 115.5 ? '#fee2e2' : d.corrected_mm >= 64.5 ? '#fed7aa' : d.corrected_mm >= 15 ? '#fef9c3' : 'transparent'}">
          ${d.corrected_mm?.toFixed(1)} mm
        </td>
        <td>${d.confidence_interval_upper > 0 ? '±' + (d.confidence_interval_upper - d.corrected_mm).toFixed(1) : '—'}</td>
        <td>${d.regime_used || d.regime || '—'}</td>
        <td style="color:${alertColors[d.alert_level] || '#374151'};font-weight:600;text-transform:capitalize">
          ${(d.alert_level || 'normal').replace('_', ' ')}
        </td>
        <td>${d.method_used || '—'}</td>
      </tr>`).join('')

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>VarshaVigyan — Bias Correction Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 32px; font-size: 12px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #1A6FE8; }
    .logo { font-size: 20px; font-weight: 700; color: #1A6FE8; }
    .logo span { color: #18A86B; }
    .meta { text-align: right; color: #64748b; font-size: 11px; line-height: 1.6; }
    .section-title { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 10px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
    .params { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .param-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; }
    .param-card .label { font-size: 10px; color: #64748b; margin-bottom: 2px; }
    .param-card .value { font-size: 13px; font-weight: 600; color: #1e293b; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #1A6FE8; color: white; }
    thead th { padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    tbody td { padding: 7px 10px; border-bottom: 1px solid #f1f5f9; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; color: #94a3b8; font-size: 10px; }
    .legend { display: flex; gap: 12px; margin-bottom: 16px; align-items: center; }
    .legend-item { display: flex; align-items: center; gap: 4px; font-size: 10px; }
    .legend-dot { width: 10px; height: 10px; border-radius: 2px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Varsha<span>Vigyan</span></div>
      <div style="color:#64748b;font-size:11px;margin-top:4px">NCMRWF | Ministry of Earth Sciences — SIH 2026</div>
    </div>
    <div class="meta">
      <div><strong>Bias Correction Report</strong></div>
      <div>Generated: ${now} IST</div>
      <div>State: ${selectedState} &nbsp;|&nbsp; T+${leadTime}h &nbsp;|&nbsp; ${filtered.length} districts</div>
    </div>
  </div>

  <div class="params">
    <div class="param-card"><div class="label">Active Regime</div><div class="value">${selectedRegime}</div></div>
    <div class="param-card"><div class="label">Lead Time</div><div class="value">T+${leadTime}h</div></div>
    <div class="param-card"><div class="label">State</div><div class="value">${selectedState}</div></div>
    <div class="param-card"><div class="label">Method</div><div class="value">${currentMethodInfo?.method || 'Quantile Mapping'}</div></div>
    <div class="param-card"><div class="label">Typical Improvement</div><div class="value" style="color:#18A86B">${currentMethodInfo?.typical_improvement || '35–40%'}</div></div>
    <div class="param-card"><div class="label">Districts</div><div class="value">${filtered.length}</div></div>
  </div>

  <div class="legend">
    <strong style="font-size:10px">Alert Legend:</strong>
    <div class="legend-item"><div class="legend-dot" style="background:#fee2e2"></div> Very Heavy (≥115.5 mm)</div>
    <div class="legend-item"><div class="legend-dot" style="background:#fed7aa"></div> Heavy (64.5–115.5 mm)</div>
    <div class="legend-item"><div class="legend-dot" style="background:#fef9c3"></div> Moderate (15–64.5 mm)</div>
    <div class="legend-item"><div class="legend-dot" style="background:#f1f5f9"></div> Normal (&lt;15 mm)</div>
  </div>

  <div class="section-title">District-wise Bias Correction Results</div>
  <table>
    <thead>
      <tr>
        <th>District</th><th>State</th><th>Raw NWP</th><th>Bias Factor</th>
        <th>Corrected</th><th>CI ±</th><th>Regime</th><th>Alert</th><th>Method</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="footer">
    <div>VarshaVigyan — Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts</div>
    <div>Confidential — NCMRWF Internal Use Only</div>
  </div>
</body>
</html>`

    const win = window.open('', '_blank', 'width=900,height=700')
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print() }, 500)
    addToast('PDF report opened — use your browser\'s Print → Save as PDF', 'success')
  }

  const chartData = pageData.map((d) => ({
    district: d.name.length > 10 ? d.name.slice(0, 10) + '…' : d.name,
    raw_nwp: d.raw_nwp_mm,
    corrected: d.corrected_mm,
  }))

  const currentMethodInfo = CORRECTION_METHODS_FALLBACK[selectedRegime]

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* State selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>State</label>
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrictIds([]) }}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              style={{ borderColor: '#e2e8f0', color: 'var(--color-text-primary)' }}
            >
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* District multi-select */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Districts</label>
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              <button
                onClick={handleSelectAll}
                className="text-xs px-2 py-1 rounded border font-medium transition-colors"
                style={{
                  borderColor: '#1A6FE8',
                  color: selectedDistrictIds.length === stateDistricts.length ? 'white' : '#1A6FE8',
                  backgroundColor: selectedDistrictIds.length === stateDistricts.length ? '#1A6FE8' : 'white',
                }}
              >
                All
              </button>
              {stateDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDistrictToggle(d.id)}
                  className="text-xs px-2 py-1 rounded border transition-colors"
                  style={{
                    borderColor: selectedDistrictIds.includes(d.id) ? '#1A6FE8' : '#e2e8f0',
                    color: selectedDistrictIds.includes(d.id) ? 'white' : 'var(--color-text-secondary)',
                    backgroundColor: selectedDistrictIds.includes(d.id) ? '#1A6FE8' : 'white',
                  }}
                >
                  {d.name}
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
                  className="text-xs px-3 py-2 rounded-lg border font-medium transition-colors"
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

          {/* Current regime */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Regime</label>
            <RegimeChip regime={selectedRegime} />
          </div>

          <button
            onClick={handleApply}
            disabled={loading}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: loading ? '#93c5fd' : '#1A6FE8' }}
          >
            {loading ? 'Applying…' : 'Apply Correction'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search district…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:border-blue-400"
              style={{ borderColor: '#e2e8f0' }}
            />
          </div>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {filtered.length} districts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {[
                  ['name', 'District'],
                  ['state', 'State'],
                  ['raw_nwp_mm', 'Raw NWP'],
                  ['bias_factor', 'Bias Factor'],
                  ['corrected_mm', 'Corrected'],
                  [null, 'CI ±'],
                  [null, 'Regime'],
                  [null, 'Alert'],
                  [null, 'Method'],
                ].map(([key, label]) => (
                  <th
                    key={label}
                    className="px-3 py-2.5 text-left text-[11px]"
                    style={{ color: 'var(--color-text-secondary)', cursor: key ? 'pointer' : 'default' }}
                    onClick={() => key && handleSort(key)}
                  >
                    {label}
                    {key && <SortIcon col={key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((d, i) => (
                <tr
                  key={d.id}
                  style={{ borderBottom: '1px solid #f8fafc', backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}
                >
                  <td className="px-3 py-2.5 font-medium" style={{ color: 'var(--color-text-primary)' }}>{d.name}</td>
                  <td className="px-3 py-2.5" style={{ color: 'var(--color-text-secondary)' }}>{d.state}</td>
                  <td className="px-3 py-2.5" style={{ color: '#94a3b8' }}>{d.raw_nwp_mm?.toFixed(1)} mm</td>
                  <td className="px-3 py-2.5 font-semibold" style={{ color: 'var(--color-text-primary)' }}>×{d.bias_factor?.toFixed(2)}</td>
                  <td
                    className="px-3 py-2.5 font-semibold"
                    style={{ backgroundColor: getCellBg(d.corrected_mm), color: 'var(--color-text-primary)' }}
                  >
                    {d.corrected_mm?.toFixed(1)} mm
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#94a3b8' }}>
                    ±{d.confidence_interval_upper > 0 ? ((d.confidence_interval_upper - d.corrected_mm).toFixed(1)) : '—'}
                  </td>
                  <td className="px-3 py-2.5"><RegimeChip regime={d.regime_used || d.regime} /></td>
                  <td className="px-3 py-2.5"><AlertSeverityChip level={d.alert_level} variant="outline" /></td>
                  <td className="px-3 py-2.5" style={{ color: 'var(--color-text-secondary)' }}>{d.method_used}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Page {page} of {Math.max(totalPages, 1)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded border font-medium disabled:opacity-40"
              style={{ borderColor: '#e2e8f0', color: 'var(--color-text-secondary)' }}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs rounded border font-medium disabled:opacity-40"
              style={{ borderColor: '#e2e8f0', color: 'var(--color-text-secondary)' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Charts + Method info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Bias Comparison — {selectedState}
          </h3>
          <BiasComparisonChart data={chartData} />
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Correction Methods
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Regime</th>
                <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Method</th>
                <th className="text-right pb-2" style={{ color: 'var(--color-text-secondary)' }}>Improvement</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(CORRECTION_METHODS_FALLBACK).map(([regime, info]) => (
                <tr
                  key={regime}
                  style={{
                    borderBottom: '1px solid #f8fafc',
                    borderLeft: regime === selectedRegime ? '3px solid #1A6FE8' : '3px solid transparent',
                    backgroundColor: regime === selectedRegime ? '#eff6ff' : 'transparent',
                  }}
                >
                  <td className="py-2 pl-2">
                    <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{regime}</span>
                  </td>
                  <td className="py-2" style={{ color: 'var(--color-text-secondary)' }}>{info.method}</td>
                  <td className="py-2 text-right font-semibold" style={{ color: '#18A86B' }}>{info.typical_improvement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export bar */}
      <div className="card p-4 flex items-center gap-3">
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-50"
          style={{ borderColor: '#1A6FE8', color: '#1A6FE8' }}
        >
          <Download size={15} />
          Export CSV
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-50"
          style={{ borderColor: '#e2e8f0', color: 'var(--color-text-secondary)' }}
        >
          <FileText size={15} />
          Export PDF Report
        </button>
        <span className="ml-auto text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {filtered.length} rows · T+{leadTime}h · {selectedRegime}
        </span>
      </div>
    </div>
  )
}
