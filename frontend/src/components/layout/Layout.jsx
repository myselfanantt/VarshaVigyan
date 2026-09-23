import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import useAppStore from '../../store/useAppStore.js'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)

  const sidebarWidth = sidebarCollapsed ? '64px' : '240px'

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <div
        className="flex flex-col flex-1 min-w-0 overflow-hidden"
        style={{ marginLeft: '0' }}
      >
        {/* TopBar */}
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
