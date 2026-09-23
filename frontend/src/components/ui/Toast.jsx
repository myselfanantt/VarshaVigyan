import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import useAppStore from '../../store/useAppStore.js'

const TYPE_CONFIG = {
  success: { icon: CheckCircle,    border: '#18A86B', iconColor: '#18A86B', bg: '#f0fdf4' },
  error:   { icon: XCircle,        border: '#DC2626', iconColor: '#DC2626', bg: '#fef2f2' },
  info:    { icon: Info,           border: '#1A6FE8', iconColor: '#1A6FE8', bg: '#eff6ff' },
  warning: { icon: AlertTriangle,  border: '#F59E0B', iconColor: '#F59E0B', bg: '#fffbeb' },
}

function ToastItem({ toast }) {
  const removeToast = useAppStore((s) => s.removeToast)
  const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info
  const Icon = config.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast.id, removeToast])

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-[380px] animate-slide-in-up"
      style={{
        backgroundColor: config.bg,
        borderLeft: `4px solid ${config.border}`,
        border: `1px solid ${config.border}30`,
        borderLeftWidth: '4px',
        borderLeftColor: config.border,
      }}
    >
      <Icon size={16} style={{ color: config.iconColor }} className="flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors"
      >
        <X size={13} style={{ color: 'var(--color-text-secondary)' }} />
      </button>
    </div>
  )
}

export default function Toast() {
  const toasts = useAppStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
