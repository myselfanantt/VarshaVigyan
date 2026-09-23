import apiClient from './axios.js'

/**
 * POST /regime/classify
 * Classify atmospheric parameters into a weather regime.
 */
export async function classifyRegime(params) {
  const response = await apiClient.post('/regime/classify', params)
  return response.data
}

/**
 * GET /regime/history
 * Return the last 14 days of regime classification history.
 */
export async function getRegimeHistory() {
  const response = await apiClient.get('/regime/history')
  return response.data
}
