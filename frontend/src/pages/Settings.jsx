import { useState } from 'react'
import { User, Cpu, Bell, Database } from 'lucide-react'
import useAppStore from '../store/useAppStore.js'
import RegimeChip from '../components/ui/RegimeChip.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'
import { ALL_REGIMES } from '../data/mockRegimes.js'

const CORRECTION_METHODS = [
  'Quantile Mapping',
  'Linear Regression',
  'Analog Ensemble',
  'Spatial Interpolation',
  'Topographic Scaling',
  'Climatological Bias',
]

const DATA_SOURCES = [
  { name: 'NCUM Output',       type: 'NWP Model',    lastSync: '06:00 IST today',   nextSync: '18:00 IST today',  status: 'online' },
  { name: 'IMD Observed',      type: 'Ground Truth', lastSync: '05:30 IST today',   nextSync: '17:30 IST today',  status: 'online' },
  { name: 'ERA5 Archive',      type: 'Reanalysis',   lastSync: '2026-09-22',        nextSync: 'Daily 02:00 IST',  status: 'online' },
  { name: 'District GeoJSON',  type: 'Geospatial',   lastSync: '2026-09-01',        nextSync: 'Monthly',          status: 'online' },
]

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-5 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#eff6ff' }}
        >
          <Icon size={16} style={{ color: '#1A6FE8' }} />
        </div>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, id }) {
  return (
    <label className="toggle-switch" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-slider" />
    </label>
  )
}

export default function Settings() {
  const { addToast, user } = useAppStore()

  // ── User profile state ─────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    fullName: user?.name || 'Dr. Rajesh Sharma',
    designation: user?.role || 'Senior Meteorologist',
    organization: user?.agency || 'NCMRWF, MoES',
    email: user?.email || 'demo@ncmrwf.gov.in',
    employeeId: 'NCMRWF-2019-047',
    department: 'Medium Range Forecasting',
  })

  // ── Model config state ─────────────────────────────────────────────────
  const [nwpModel, setNwpModel] = useState('NCUM-12')
  const [regimeMethods, setRegimeMethods] = useState(
    Object.fromEntries(ALL_REGIMES.map((r, i) => [r, CORRECTION_METHODS[i % CORRECTION_METHODS.length]]))
  )
  const [heavyThreshold, setHeavyThreshold] = useState(64)
  const [veryHeavyThreshold, setVeryHeavyThreshold] = useState(115)

  // ── Notification state ─────────────────────────────────────────────────
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [dashboardAlerts, setDashboardAlerts] = useState(true)
  const [leadTimeNotif, setLeadTimeNotif] = useState('24 hours before')
  const [severityMatrix, setSeverityMatrix] = useState({
    normal:     { email: false, sms: false, dashboard: true  },
    moderate:   { email: true,  sms: false, dashboard: true  },
    heavy:      { email: true,  sms: true,  dashboard: true  },
    very_heavy: { email: true,  sms: true,  dashboard: true  },
  })

  // ── Sync loading state ─────────────────────────────────────────────────
  const [syncingSource, setSyncingSource] = useState(null)

  const handleSync = (sourceName) => {
    setSyncingSource(sourceName)
    setTimeout(() => {
      setSyncingSource(null)
      addToast(`${sourceName} synced successfully`, 'success')
    }, 2000)
  }

  const toggleSeverityCell = (level, channel) => {
    setSeverityMatrix((m) => ({
      ...m,
      [level]: { ...m[level], [channel]: !m[level][channel] },
    }))
  }

  const saveAll = () => {
    addToast('All settings saved successfully', 'success')
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* ── User Profile ─────────────────────────────────────────────────── */}
      <SectionCard title="User Profile" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'fullName',      label: 'Full Name' },
            { key: 'designation',   label: 'Designation' },
            { key: 'organization',  label: 'Organization' },
            { key: 'email',         label: 'Email' },
            { key: 'employeeId',    label: 'Employee ID', readonly: true },
          ].map(({ key, label, readonly }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</label>
              <input
                type="text"
                value={profile[key]}
                readOnly={readonly}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                style={{
                  borderColor: '#e2e8f0',
                  color: 'var(--color-text-primary)',
                  backgroundColor: readonly ? '#f8fafc' : 'white',
                }}
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Department</label>
            <select
              value={profile.department}
              onChange={(e) => setProfile((p) => ({ ...p, department: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              style={{ borderColor: '#e2e8f0', color: 'var(--color-text-primary)' }}
            >
              <option>Medium Range Forecasting</option>
              <option>Short Range Forecasting</option>
              <option>Climate Research</option>
              <option>Model Development</option>
              <option>Data Assimilation</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => addToast('Profile saved successfully', 'success')}
          className="mt-4 px-4 py-2 text-sm font-semibold text-white rounded-lg"
          style={{ backgroundColor: '#1A6FE8' }}
        >
          Save Profile
        </button>
      </SectionCard>

      {/* ── Model Configuration ───────────────────────────────────────────── */}
      <SectionCard title="Model Configuration" icon={Cpu}>
        <div className="space-y-5">
          {/* NWP Model Source */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>NWP Model Source</label>
            <select
              value={nwpModel}
              onChange={(e) => setNwpModel(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              style={{ borderColor: '#e2e8f0', color: 'var(--color-text-primary)' }}
            >
              <option>NCUM-12</option>
              <option>NCUM-6</option>
              <option>GFS 0.25°</option>
              <option>ECMWF IFS</option>
            </select>
          </div>

          {/* Regime-specific correction methods */}
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Bias Correction Method per Regime
            </label>
            <div className="space-y-2">
              {ALL_REGIMES.map((regime) => (
                <div key={regime} className="flex items-center gap-3 py-1.5" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <div className="flex-1">
                    <RegimeChip regime={regime} />
                  </div>
                  <select
                    value={regimeMethods[regime]}
                    onChange={(e) => setRegimeMethods((m) => ({ ...m, [regime]: e.target.value }))}
                    className="border rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                    style={{ borderColor: '#e2e8f0', color: 'var(--color-text-primary)' }}
                  >
                    {CORRECTION_METHODS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Thresholds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Heavy Rain Threshold
                </label>
                <span className="text-sm font-bold" style={{ color: '#E84E1A' }}>{heavyThreshold} mm</span>
              </div>
              <input
                type="range"
                min={50} max={100} step={1}
                value={heavyThreshold}
                onChange={(e) => setHeavyThreshold(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: `linear-gradient(to right, #E84E1A 0%, #E84E1A ${((heavyThreshold - 50) / 50) * 100}%, #e2e8f0 ${((heavyThreshold - 50) / 50) * 100}%, #e2e8f0 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px]" style={{ color: '#94a3b8' }}>
                <span>50 mm</span><span>100 mm</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Very Heavy Threshold
                </label>
                <span className="text-sm font-bold" style={{ color: '#DC2626' }}>{veryHeavyThreshold} mm</span>
              </div>
              <input
                type="range"
                min={100} max={200} step={5}
                value={veryHeavyThreshold}
                onChange={(e) => setVeryHeavyThreshold(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  background: `linear-gradient(to right, #DC2626 0%, #DC2626 ${((veryHeavyThreshold - 100) / 100) * 100}%, #e2e8f0 ${((veryHeavyThreshold - 100) / 100) * 100}%, #e2e8f0 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px]" style={{ color: '#94a3b8' }}>
                <span>100 mm</span><span>200 mm</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => addToast('Model configuration saved', 'success')}
          className="mt-4 px-4 py-2 text-sm font-semibold text-white rounded-lg"
          style={{ backgroundColor: '#1A6FE8' }}
        >
          Save Configuration
        </button>
      </SectionCard>

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      <SectionCard title="Notifications" icon={Bell}>
        <div className="space-y-5">
          {/* Main toggles */}
          <div className="flex items-center gap-8 flex-wrap">
            {[
              { label: 'Email Alerts', checked: emailAlerts, onChange: setEmailAlerts, id: 'email-toggle' },
              { label: 'SMS Alerts',   checked: smsAlerts,   onChange: setSmsAlerts,   id: 'sms-toggle'   },
              { label: 'Dashboard',    checked: dashboardAlerts, onChange: setDashboardAlerts, id: 'dash-toggle' },
            ].map(({ label, checked, onChange, id }) => (
              <div key={label} className="flex items-center gap-2">
                <Toggle checked={checked} onChange={onChange} id={id} />
                <label htmlFor={id} className="text-sm cursor-pointer" style={{ color: 'var(--color-text-primary)' }}>
                  {label}
                </label>
              </div>
            ))}
          </div>

          {/* Severity matrix */}
          <div>
            <label className="text-xs font-medium block mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Alert Severity Matrix
            </label>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left py-2" style={{ color: 'var(--color-text-secondary)' }}>Severity</th>
                  <th className="text-center py-2" style={{ color: 'var(--color-text-secondary)' }}>Email</th>
                  <th className="text-center py-2" style={{ color: 'var(--color-text-secondary)' }}>SMS</th>
                  <th className="text-center py-2" style={{ color: 'var(--color-text-secondary)' }}>Dashboard</th>
                </tr>
              </thead>
              <tbody>
                {['normal', 'moderate', 'heavy', 'very_heavy'].map((level) => (
                  <tr key={level} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td className="py-2 capitalize font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {level.replace('_', ' ')}
                    </td>
                    {['email', 'sms', 'dashboard'].map((ch) => (
                      <td key={ch} className="py-2 text-center">
                        <Toggle
                          id={`${level}-${ch}`}
                          checked={severityMatrix[level][ch]}
                          onChange={() => toggleSeverityCell(level, ch)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lead time */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Alert Lead Time</label>
            <select
              value={leadTimeNotif}
              onChange={(e) => setLeadTimeNotif(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              style={{ borderColor: '#e2e8f0', color: 'var(--color-text-primary)' }}
            >
              <option>24 hours before</option>
              <option>48 hours before</option>
              <option>72 hours before</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => addToast('Notification preferences saved', 'success')}
          className="mt-4 px-4 py-2 text-sm font-semibold text-white rounded-lg"
          style={{ backgroundColor: '#1A6FE8' }}
        >
          Save Preferences
        </button>
      </SectionCard>

      {/* ── Data Source Status ────────────────────────────────────────────── */}
      <SectionCard title="Data Sources" icon={Database}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Source</th>
                <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Type</th>
                <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Last Sync</th>
                <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Next Sync</th>
                <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Status</th>
                <th className="text-left pb-2" style={{ color: 'var(--color-text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map((src) => (
                <tr key={src.name} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td className="py-2.5 font-medium" style={{ color: 'var(--color-text-primary)' }}>{src.name}</td>
                  <td className="py-2.5" style={{ color: 'var(--color-text-secondary)' }}>{src.type}</td>
                  <td className="py-2.5 font-mono" style={{ color: 'var(--color-text-secondary)' }}>{src.lastSync}</td>
                  <td className="py-2.5 font-mono" style={{ color: 'var(--color-text-secondary)' }}>{src.nextSync}</td>
                  <td className="py-2.5">
                    <span
                      className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit"
                      style={{ backgroundColor: '#dcfce7', color: '#166534' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      Online
                    </span>
                  </td>
                  <td className="py-2.5">
                    <button
                      onClick={() => handleSync(src.name)}
                      disabled={syncingSource === src.name}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border font-medium disabled:opacity-60"
                      style={{ borderColor: '#1A6FE8', color: '#1A6FE8' }}
                    >
                      {syncingSource === src.name
                        ? <><LoadingSpinner size={12} color="#1A6FE8" /> Syncing…</>
                        : 'Sync Now'
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Save All */}
      <button
        onClick={saveAll}
        className="w-full py-3 text-sm font-semibold text-white rounded-lg"
        style={{ backgroundColor: '#1A6FE8' }}
      >
        Save All Settings
      </button>
    </div>
  )
}
