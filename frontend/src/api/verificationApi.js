import apiClient from './axios.js'

/**
 * GET /verification/metrics
 * Fetch regime-level skill score metrics for the specified period and regime filter.
 */
export async function getMetrics(period = 'month', regime = 'all') {
  const response = await apiClient.get('/verification/metrics', {
    params: { period, regime },
  })
  return response.data
}

/**
 * GET /verification/scatter
 * Fetch scatter plot data: observed vs raw NWP vs corrected.
 */
export async function getScatterData() {
  const response = await apiClient.get('/verification/scatter')
  return response.data
}

/**
 * GET /verification/daily-ets
 * Fetch daily ETS time series for the specified period.
 */
export async function getDailyETS(period = 'month') {
  const response = await apiClient.get('/verification/daily-ets', {
    params: { period },
  })
  return response.data
}
