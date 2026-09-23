import apiClient from './axios.js'

/**
 * GET /forecast/districts
 * Fetch district forecasts, optionally filtered by state and lead time.
 */
export async function getDistricts(state = null, leadTime = 24) {
  const params = { lead_time: leadTime }
  if (state) params.state = state
  const response = await apiClient.get('/forecast/districts', { params })
  return response.data
}

/**
 * GET /forecast/map
 * Fetch lightweight map data for all 30 districts.
 */
export async function getMapData() {
  const response = await apiClient.get('/forecast/map')
  return response.data
}

/**
 * GET /forecast/alerts
 * Fetch districts with heavy_rain_prob > 0.60, sorted by probability descending.
 */
export async function getAlerts() {
  const response = await apiClient.get('/forecast/alerts')
  return response.data
}
