import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BellRing, Menu, User, Settings, LogOut, AlertTriangle, CheckCircle2,
  Info, ExternalLink, ShieldCheck, X
} from 'lucide-react'
import useAppStore from '../../store/useAppStore.js'

const PAGE_TITLES = {
  '/dashboard':         'Dashboard',
  '/regime-classifier': 'Regime Classifier',
  '/bias-correction':   'Bias Correction',
  '/forecast-map':      'Forecast Map',
  '/verification':      'Verification Report',
  '/settings':          'Settings',
}

const INITIAL_ALERTS = [
  {
    id: 1,
    title: 'Extreme Rainfall Alert (Monsoon Low)',
    desc: 'Heavy precipitation predicted over Ratnagiri & Sindhudurg (>125mm/24h).',
    time: '10 mins ago',
    type: 'critical',
    read: false,
  },
  {
    id: 2,
    title: 'Bias Correction Algorithm Updated',
    desc: 'Regime-conditioned quantile mapping model retrained with IMD 0.125° station data.',
    time: '1 hour ago',
    type: 'info',
    read: false,
  },
  {
    id: 3,
    title: '00Z Model Ingestion Complete',
    desc: 'GFS numerical weather prediction grid successfully ingested & post-processed.',
    time: '3 hours ago',
    type: 'success',
    read: false,
  },
]

export default function TopBar({ onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { modelRun, setModelRun, addToast, user, logout } = useAppStore()
  
  const [clock, setClock] = useState('')
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [alertsList, setAlertsList] = useState(INITIAL_ALERTS)

  const alertsRef = useRef(null)
  const profileRef = useRef(null)

  const currentTitle = PAGE_TITLES[location.pathname] || 'Dashboard'

  // Live clock — updates every second
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const options = { day: '2-digit', month: 'short', year: 'numeric' }
      const datePart = now.toLocaleDateString('en-IN', options)
      const timePart = now.toLocaleTimeString('en-IN', { hour12: false })
      setClock(`${datePart} | ${timePart} IST`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) {
        setAlertsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleModelRun = (run) => {
    setModelRun(run)
    addToast(`Switched to ${run} model run`, 'info')
  }

  const unreadCount = alertsList.filter(a => !a.read).length

  const markAllRead = () => {
    setAlertsList(alertsList.map(a => ({ ...a, read: true })))
    addToast('Marked all alerts as read', 'info')
  }

  const handleAlertClick = (alert) => {
    setAlertsList(alertsList.map(a => a.id === alert.id ? { ...a, read: true } : a))
    setAlertsOpen(false)
    navigate('/forecast-map')
  }

  return (
    <header
      className="flex items-center justify-between px-6 h-16 flex-shrink-0 relative z-30"
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      {/* Left — hamburger (mobile) + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
        <div>
          <h1
            className="font-semibold leading-tight"
            style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}
          >
            {currentTitle}
          </h1>
          <p className="text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
            VarshaVigyan / {currentTitle}
          </p>
        </div>
      </div>

      {/* Center — Model Run selector */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          Model Run:
        </span>
        {['00Z', '12Z'].map((run) => (
          <button
            key={run}
            onClick={() => handleModelRun(run)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer"
            style={{
              backgroundColor: modelRun === run ? '#1A6FE8' : 'white',
              color: modelRun === run ? 'white' : 'var(--color-text-secondary)',
              borderColor: modelRun === run ? '#1A6FE8' : '#E2E8F0',
            }}
          >
            {run}
          </button>
        ))}
      </div>

      {/* Right — clock + bell + avatar */}
      <div className="flex items-center gap-4">
        <span
          className="hidden lg:block text-xs font-medium tabular-nums"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {clock}
        </span>

        {/* ─── ALERT / NOTIFICATIONS DROPDOWN ───────────────────────────────────── */}
        <div className="relative" ref={alertsRef}>
          <button
            onClick={() => {
              setAlertsOpen(!alertsOpen)
              setProfileOpen(false)
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative cursor-pointer"
            title="Weather Alerts & System Notifications"
          >
            <BellRing size={18} style={{ color: 'var(--color-text-secondary)' }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: '#DC2626' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {alertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">Alerts & Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {alertsList.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => handleAlertClick(alert)}
                    className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-3 ${
                      !alert.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {alert.type === 'critical' ? (
                        <AlertTriangle size={18} className="text-red-500" />
                      ) : alert.type === 'success' ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <Info size={18} className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-900">{alert.title}</h4>
                        <span className="text-[10px] text-gray-400">{alert.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-snug">{alert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
                <button
                  onClick={() => {
                    setAlertsOpen(false)
                    navigate('/verification')
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View Full Weather Skill & Metrics Report →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── PROFILE DROPDOWN MENU ──────────────────────────────────────────────── */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen)
              setAlertsOpen(false)
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
            style={{ backgroundColor: '#1A6FE8' }}
            title="User Profile Menu"
          >
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'DR'}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: '#1A6FE8' }}
                  >
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'DR'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {user?.name || 'Dr. Rajesh Sharma'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.role || 'Senior Meteorologist'}
                    </div>
                    <div className="text-[10px] text-blue-600 font-semibold truncate mt-0.5">
                      {user?.agency || 'NCMRWF / MoES'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/settings')
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors font-medium"
                >
                  <User size={15} className="text-gray-500" />
                  <span>Account Profile & Roles</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    navigate('/settings')
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors font-medium"
                >
                  <Settings size={15} className="text-gray-500" />
                  <span>System Preferences</span>
                </button>
              </div>

              {/* Logout Button */}
              <div className="pt-1 border-t border-gray-100">
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    logout()
                    navigate('/login')
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors font-semibold"
                >
                  <LogOut size={15} className="text-red-500" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
