import { create } from 'zustand'

let toastIdCounter = 0

const useAppStore = create((set, get) => ({
  // ─── Navigation & UI state ──────────────────────────────────────────────
  currentPage: 'dashboard',
  sidebarCollapsed: false,

  // ─── Forecast settings ──────────────────────────────────────────────────
  selectedRegime: 'Active Monsoon',
  selectedState: 'Maharashtra',
  selectedDistrict: null,
  leadTime: '24',
  modelRun: '00Z',

  // ─── Classification result from Regime Classifier page ─────────────────
  classificationResult: null,

  // ─── Toast notifications ────────────────────────────────────────────────
  toasts: [],

  // ─── Actions ────────────────────────────────────────────────────────────

  setPage: (page) => set({ currentPage: page }),

  setRegime: (regime) => set({ selectedRegime: regime }),

  setSelectedState: (state) => set({ selectedState: state }),

  setSelectedDistrict: (district) => set({ selectedDistrict: district }),

  setLeadTime: (lt) => set({ leadTime: lt }),

  setModelRun: (run) => set({ modelRun: run }),

  setClassificationResult: (result) => set({ classificationResult: result }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  addToast: (message, type = 'info') => {
    const id = ++toastIdCounter
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id, message, type, createdAt: Date.now() },
      ],
    }))
    return id
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  // ─── Auth state ────────────────────────────────────────────────────────
  isAuthenticated: true,
  user: {
    name: 'Dr. Rajesh Sharma',
    role: 'Senior Meteorologist',
    agency: 'NCMRWF / MoES',
    email: 'demo@ncmrwf.gov.in'
  },

  login: (email, password) => {
    set({
      isAuthenticated: true,
      user: {
        name: email.split('@')[0].toUpperCase() || 'Dr. Rajesh Sharma',
        role: 'Meteorologist',
        agency: 'NCMRWF / MoES',
        email: email || 'demo@ncmrwf.gov.in'
      }
    })
    get().addToast('Successfully signed in to RainSense AI', 'success')
  },

  logout: () => {
    set({ isAuthenticated: false, user: null })
    get().addToast('Logged out of RainSense AI', 'info')
  },
}))

export default useAppStore
