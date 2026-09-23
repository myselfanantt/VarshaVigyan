// Mock regime data for frontend

export const REGIME_COLORS = {
  'Active Monsoon':     '#18A86B',
  'Break Monsoon':      '#F59E0B',
  'Monsoon Depression': '#E84E1A',
  'Coastal Rainfall':   '#1A6FE8',
  'Orographic Rainfall':'#7C3AED',
  'Western Disturbance':'#64748B',
}

export const REGIME_ICONS = {
  'Active Monsoon':     '🌧️',
  'Break Monsoon':      '⛅',
  'Monsoon Depression': '🌀',
  'Coastal Rainfall':   '🌊',
  'Orographic Rainfall':'⛰️',
  'Western Disturbance':'💨',
}

export const ALL_REGIMES = Object.keys(REGIME_COLORS)

// Generate 14-day regime history going backwards from today
function buildRegimeHistory() {
  const sequence = [
    { regime: 'Active Monsoon',     confidence: 0.87 },
    { regime: 'Active Monsoon',     confidence: 0.91 },
    { regime: 'Monsoon Depression', confidence: 0.85 },
    { regime: 'Monsoon Depression', confidence: 0.92 },
    { regime: 'Active Monsoon',     confidence: 0.78 },
    { regime: 'Break Monsoon',      confidence: 0.71 },
    { regime: 'Break Monsoon',      confidence: 0.79 },
    { regime: 'Active Monsoon',     confidence: 0.83 },
    { regime: 'Coastal Rainfall',   confidence: 0.74 },
    { regime: 'Active Monsoon',     confidence: 0.88 },
    { regime: 'Orographic Rainfall',confidence: 0.76 },
    { regime: 'Active Monsoon',     confidence: 0.82 },
    { regime: 'Western Disturbance',confidence: 0.69 },
    { regime: 'Break Monsoon',      confidence: 0.65 },
  ]
  const today = new Date()
  return sequence.map((item, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    return {
      date: d.toISOString().split('T')[0],
      ...item,
    }
  })
}

export const MOCK_REGIME_HISTORY = buildRegimeHistory()

// Generate 30-day daily ETS data
function buildDailyETS() {
  const baseRaw = [
    0.28, 0.31, 0.27, 0.33, 0.29, 0.35, 0.38, 0.32, 0.30, 0.36,
    0.34, 0.29, 0.31, 0.37, 0.41, 0.38, 0.33, 0.36, 0.40, 0.44,
    0.39, 0.42, 0.37, 0.40, 0.43, 0.46, 0.41, 0.44, 0.48, 0.45,
  ]
  const today = new Date()
  return baseRaw.map((raw, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (29 - i))
    return {
      date: d.toISOString().split('T')[0],
      ets_raw: raw,
      ets_corrected: parseFloat((raw + 0.18 + i * 0.002).toFixed(3)),
    }
  })
}

export const MOCK_DAILY_ETS = buildDailyETS()
