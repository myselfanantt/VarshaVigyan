import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Brain, Sliders, Map, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import useAppStore from '../../store/useAppStore.js'

const NAV_ITEMS = [
  { id: 'dashboard',          label: 'Dashboard',           icon: LayoutDashboard, path: '/dashboard' },
  { id: 'regime-classifier',  label: 'Regime Classifier',   icon: Brain,            path: '/regime-classifier' },
  { id: 'bias-correction',    label: 'Bias Correction',     icon: Sliders,          path: '/bias-correction' },
  { id: 'forecast-map',       label: 'Forecast Map',        icon: Map,              path: '/forecast-map' },
  { id: 'verification',       label: 'Verification Report', icon: BarChart3,        path: '/verification' },
  { id: 'settings',           label: 'Settings',            icon: Settings,         path: '/settings' },
]

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar, setPage, user, logout } = useAppStore()

  const handleNav = (item) => {
    setPage(item.id)
    navigate(item.path)
    if (onMobileClose) onMobileClose()
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const sidebarWidth = sidebarCollapsed ? '64px' : '240px'

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full z-50 flex flex-col transition-sidebar',
          'md:relative md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
        style={{
          width: sidebarWidth,
          backgroundColor: 'var(--color-sidebar-bg)',
          borderRight: '1px solid #1A2744',
          minWidth: sidebarCollapsed ? '64px' : '240px',
        }}
      >
        {/* Logo / Brand */}
        <div
          className="flex items-center gap-3 px-4 py-5 border-b"
          style={{ borderColor: '#1A2744' }}
        >
          {/* Custom RainSense Logo */}
          <div className="flex-shrink-0">
            <img
              src="/images/rainsense_logo.png"
              alt="RainSense AI Logo"
              className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5"
            />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="text-white font-bold text-sm leading-tight truncate">VarshaVigyan</div>
              <div className="text-[10px] truncate" style={{ color: '#5B7BA3' }}>NCMRWF | MoES</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 relative group',
                  active
                    ? 'text-white'
                    : 'hover:bg-[#1A2744]/70',
                )}
                style={{
                  backgroundColor: active ? 'var(--color-sidebar-active-bg)' : 'transparent',
                  color: active ? 'white' : 'var(--color-sidebar-text)',
                  borderLeft: active ? '3px solid #1A6FE8' : '3px solid transparent',
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded text-xs text-white bg-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t pb-1" style={{ borderColor: '#1A2744' }}>
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center py-2.5 transition-colors hover:bg-[#1A2744]/70"
            style={{ color: 'var(--color-sidebar-text)' }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed
              ? <ChevronRight size={16} />
              : (
                <div className="flex items-center gap-2 px-4 w-full">
                  <ChevronLeft size={16} />
                  <span className="text-xs">Collapse</span>
                </div>
              )
            }
          </button>
        </div>

        {/* User info */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-t"
          style={{ borderColor: '#1A2744' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: '#1A6FE8' }}
          >
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'RS'}
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <div className="text-white text-xs font-semibold truncate">
                  {user?.name || 'Dr. Rajesh Sharma'}
                </div>
                <div className="text-[10px] truncate" style={{ color: '#5B7BA3' }}>
                  {user?.role || 'Senior Meteorologist'}
                </div>
              </div>
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="p-1.5 rounded hover:bg-[#1A2744] text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
