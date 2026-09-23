import apiClient from './axios.js'

/**
 * POST /bias-correction/correct
 * Apply regime-specific bias correction to selected districts.
 */
export async function correctBias(districtIds, regime, leadTime) {
  const response = await apiClient.post('/bias-correction/correct', {
    district_ids: districtIds,
    regime,
    lead_time: leadTime,
  })
  return response.data
}

/**
 * GET /bias-correction/methods
 * Fetch all available bias correction methods and their parameters.
 */
export async function getMethods() {
  const response = await apiClient.get('/bias-correction/methods')
  return response.data
}
