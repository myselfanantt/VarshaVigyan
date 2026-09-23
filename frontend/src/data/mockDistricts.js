// Mock district data — 30 Indian districts across 6 states
// Used as fallback when backend is unreachable

export const MOCK_DISTRICTS = [
  // Maharashtra
  { id: 'MH_NASHIK', name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, regime: 'Active Monsoon', raw_nwp_mm: 42.5, corrected_mm: 38.2, bias_factor: 0.89, heavy_rain_prob: 0.34, alert_level: 'moderate', t24_raw: 42.5, t24_corrected: 38.2, t48_raw: 38.1, t48_corrected: 33.9, t72_raw: 29.4, t72_corrected: 27.1 },
  { id: 'MH_PUNE', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, regime: 'Active Monsoon', raw_nwp_mm: 67.3, corrected_mm: 59.8, bias_factor: 0.89, heavy_rain_prob: 0.62, alert_level: 'heavy', t24_raw: 67.3, t24_corrected: 59.8, t48_raw: 55.2, t48_corrected: 49.1, t72_raw: 44.6, t72_corrected: 39.7 },
  { id: 'MH_NAGPUR', name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882, regime: 'Break Monsoon', raw_nwp_mm: 8.2, corrected_mm: 9.4, bias_factor: 1.15, heavy_rain_prob: 0.05, alert_level: 'normal', t24_raw: 8.2, t24_corrected: 9.4, t48_raw: 6.1, t48_corrected: 7.0, t72_raw: 4.3, t72_corrected: 4.9 },
  { id: 'MH_AURANGABAD', name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lon: 75.3433, regime: 'Active Monsoon', raw_nwp_mm: 54.1, corrected_mm: 48.1, bias_factor: 0.89, heavy_rain_prob: 0.48, alert_level: 'moderate', t24_raw: 54.1, t24_corrected: 48.1, t48_raw: 47.8, t48_corrected: 42.5, t72_raw: 39.2, t72_corrected: 34.9 },
  { id: 'MH_KOLHAPUR', name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lon: 74.2433, regime: 'Orographic Rainfall', raw_nwp_mm: 118.4, corrected_mm: 144.4, bias_factor: 1.22, heavy_rain_prob: 0.91, alert_level: 'very_heavy', t24_raw: 118.4, t24_corrected: 144.4, t48_raw: 98.7, t48_corrected: 120.4, t72_raw: 76.3, t72_corrected: 93.1 },
  // Kerala
  { id: 'KL_THIRUVANANTHAPURAM', name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lon: 76.9366, regime: 'Coastal Rainfall', raw_nwp_mm: 45.2, corrected_mm: 42.5, bias_factor: 0.94, heavy_rain_prob: 0.38, alert_level: 'moderate', t24_raw: 45.2, t24_corrected: 42.5, t48_raw: 39.8, t48_corrected: 37.4, t72_raw: 31.5, t72_corrected: 29.6 },
  { id: 'KL_KOZHIKODE', name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lon: 75.7804, regime: 'Active Monsoon', raw_nwp_mm: 89.6, corrected_mm: 79.7, bias_factor: 0.89, heavy_rain_prob: 0.78, alert_level: 'heavy', t24_raw: 89.6, t24_corrected: 79.7, t48_raw: 74.3, t48_corrected: 66.1, t72_raw: 61.8, t72_corrected: 55.0 },
  { id: 'KL_THRISSUR', name: 'Thrissur', state: 'Kerala', lat: 10.5276, lon: 76.2144, regime: 'Active Monsoon', raw_nwp_mm: 72.4, corrected_mm: 64.4, bias_factor: 0.89, heavy_rain_prob: 0.65, alert_level: 'heavy', t24_raw: 72.4, t24_corrected: 64.4, t48_raw: 60.1, t48_corrected: 53.5, t72_raw: 48.3, t72_corrected: 43.0 },
  { id: 'KL_IDUKKI', name: 'Idukki', state: 'Kerala', lat: 9.8491, lon: 77.0003, regime: 'Orographic Rainfall', raw_nwp_mm: 134.7, corrected_mm: 164.3, bias_factor: 1.22, heavy_rain_prob: 0.95, alert_level: 'very_heavy', t24_raw: 134.7, t24_corrected: 164.3, t48_raw: 112.4, t48_corrected: 137.1, t72_raw: 88.6, t72_corrected: 108.1 },
  { id: 'KL_WAYANAD', name: 'Wayanad', state: 'Kerala', lat: 11.6854, lon: 76.1320, regime: 'Orographic Rainfall', raw_nwp_mm: 98.3, corrected_mm: 119.9, bias_factor: 1.22, heavy_rain_prob: 0.87, alert_level: 'very_heavy', t24_raw: 98.3, t24_corrected: 119.9, t48_raw: 81.9, t48_corrected: 99.9, t72_raw: 64.7, t72_corrected: 78.9 },
  // Rajasthan
  { id: 'RJ_JAIPUR', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, regime: 'Break Monsoon', raw_nwp_mm: 3.1, corrected_mm: 3.6, bias_factor: 1.15, heavy_rain_prob: 0.02, alert_level: 'normal', t24_raw: 3.1, t24_corrected: 3.6, t48_raw: 2.4, t48_corrected: 2.8, t72_raw: 1.8, t72_corrected: 2.1 },
  { id: 'RJ_JODHPUR', name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lon: 73.0243, regime: 'Break Monsoon', raw_nwp_mm: 1.8, corrected_mm: 2.1, bias_factor: 1.15, heavy_rain_prob: 0.01, alert_level: 'normal', t24_raw: 1.8, t24_corrected: 2.1, t48_raw: 1.2, t48_corrected: 1.4, t72_raw: 0.8, t72_corrected: 0.9 },
  { id: 'RJ_BIKANER', name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lon: 73.3119, regime: 'Western Disturbance', raw_nwp_mm: 12.4, corrected_mm: 12.2, bias_factor: 0.98, heavy_rain_prob: 0.09, alert_level: 'normal', t24_raw: 12.4, t24_corrected: 12.2, t48_raw: 9.8, t48_corrected: 9.6, t72_raw: 7.3, t72_corrected: 7.1 },
  { id: 'RJ_JAISALMER', name: 'Jaisalmer', state: 'Rajasthan', lat: 26.9157, lon: 70.9083, regime: 'Break Monsoon', raw_nwp_mm: 0.4, corrected_mm: 0.5, bias_factor: 1.15, heavy_rain_prob: 0.00, alert_level: 'normal', t24_raw: 0.4, t24_corrected: 0.5, t48_raw: 0.2, t48_corrected: 0.2, t72_raw: 0.1, t72_corrected: 0.1 },
  { id: 'RJ_UDAIPUR', name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lon: 73.7125, regime: 'Active Monsoon', raw_nwp_mm: 38.6, corrected_mm: 34.4, bias_factor: 0.89, heavy_rain_prob: 0.29, alert_level: 'moderate', t24_raw: 38.6, t24_corrected: 34.4, t48_raw: 32.1, t48_corrected: 28.6, t72_raw: 24.7, t72_corrected: 22.0 },
  // West Bengal
  { id: 'WB_KOLKATA', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, regime: 'Monsoon Depression', raw_nwp_mm: 143.2, corrected_mm: 108.8, bias_factor: 0.76, heavy_rain_prob: 0.93, alert_level: 'very_heavy', t24_raw: 143.2, t24_corrected: 108.8, t48_raw: 119.4, t48_corrected: 90.7, t72_raw: 94.1, t72_corrected: 71.5 },
  { id: 'WB_DARJEELING', name: 'Darjeeling', state: 'West Bengal', lat: 27.0360, lon: 88.2627, regime: 'Orographic Rainfall', raw_nwp_mm: 156.8, corrected_mm: 191.3, bias_factor: 1.22, heavy_rain_prob: 0.97, alert_level: 'very_heavy', t24_raw: 156.8, t24_corrected: 191.3, t48_raw: 130.7, t48_corrected: 159.5, t72_raw: 103.1, t72_corrected: 125.8 },
  { id: 'WB_JALPAIGURI', name: 'Jalpaiguri', state: 'West Bengal', lat: 26.5425, lon: 88.7280, regime: 'Monsoon Depression', raw_nwp_mm: 112.6, corrected_mm: 85.6, bias_factor: 0.76, heavy_rain_prob: 0.84, alert_level: 'very_heavy', t24_raw: 112.6, t24_corrected: 85.6, t48_raw: 93.8, t48_corrected: 71.3, t72_raw: 74.9, t72_corrected: 56.9 },
  { id: 'WB_BANKURA', name: 'Bankura', state: 'West Bengal', lat: 23.2324, lon: 87.0753, regime: 'Active Monsoon', raw_nwp_mm: 61.4, corrected_mm: 54.6, bias_factor: 0.89, heavy_rain_prob: 0.57, alert_level: 'moderate', t24_raw: 61.4, t24_corrected: 54.6, t48_raw: 51.2, t48_corrected: 45.6, t72_raw: 40.7, t72_corrected: 36.2 },
  { id: 'WB_PURULIA', name: 'Purulia', state: 'West Bengal', lat: 23.3318, lon: 86.3648, regime: 'Active Monsoon', raw_nwp_mm: 48.9, corrected_mm: 43.5, bias_factor: 0.89, heavy_rain_prob: 0.41, alert_level: 'moderate', t24_raw: 48.9, t24_corrected: 43.5, t48_raw: 40.8, t48_corrected: 36.3, t72_raw: 32.4, t72_corrected: 28.8 },
  // Uttarakhand
  { id: 'UK_DEHRADUN', name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lon: 78.0322, regime: 'Western Disturbance', raw_nwp_mm: 34.7, corrected_mm: 34.0, bias_factor: 0.98, heavy_rain_prob: 0.26, alert_level: 'moderate', t24_raw: 34.7, t24_corrected: 34.0, t48_raw: 28.9, t48_corrected: 28.3, t72_raw: 22.8, t72_corrected: 22.3 },
  { id: 'UK_HARIDWAR', name: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lon: 78.1642, regime: 'Active Monsoon', raw_nwp_mm: 57.3, corrected_mm: 51.0, bias_factor: 0.89, heavy_rain_prob: 0.51, alert_level: 'moderate', t24_raw: 57.3, t24_corrected: 51.0, t48_raw: 47.7, t48_corrected: 42.5, t72_raw: 37.9, t72_corrected: 33.7 },
  { id: 'UK_NAINITAL', name: 'Nainital', state: 'Uttarakhand', lat: 29.3803, lon: 79.4636, regime: 'Orographic Rainfall', raw_nwp_mm: 87.4, corrected_mm: 106.6, bias_factor: 1.22, heavy_rain_prob: 0.79, alert_level: 'heavy', t24_raw: 87.4, t24_corrected: 106.6, t48_raw: 72.8, t48_corrected: 88.8, t72_raw: 57.6, t72_corrected: 70.3 },
  { id: 'UK_CHAMOLI', name: 'Chamoli', state: 'Uttarakhand', lat: 30.4053, lon: 79.3198, regime: 'Orographic Rainfall', raw_nwp_mm: 104.2, corrected_mm: 127.1, bias_factor: 1.22, heavy_rain_prob: 0.88, alert_level: 'very_heavy', t24_raw: 104.2, t24_corrected: 127.1, t48_raw: 86.8, t48_corrected: 105.9, t72_raw: 68.5, t72_corrected: 83.6 },
  { id: 'UK_PITHORAGARH', name: 'Pithoragarh', state: 'Uttarakhand', lat: 29.5824, lon: 80.2180, regime: 'Western Disturbance', raw_nwp_mm: 22.1, corrected_mm: 21.7, bias_factor: 0.98, heavy_rain_prob: 0.15, alert_level: 'normal', t24_raw: 22.1, t24_corrected: 21.7, t48_raw: 18.4, t48_corrected: 18.0, t72_raw: 14.6, t72_corrected: 14.3 },
  // Tamil Nadu
  { id: 'TN_CHENNAI', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, regime: 'Coastal Rainfall', raw_nwp_mm: 38.4, corrected_mm: 36.1, bias_factor: 0.94, heavy_rain_prob: 0.28, alert_level: 'moderate', t24_raw: 38.4, t24_corrected: 36.1, t48_raw: 32.0, t48_corrected: 30.1, t72_raw: 25.3, t72_corrected: 23.8 },
  { id: 'TN_COIMBATORE', name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, regime: 'Orographic Rainfall', raw_nwp_mm: 76.8, corrected_mm: 93.7, bias_factor: 1.22, heavy_rain_prob: 0.72, alert_level: 'heavy', t24_raw: 76.8, t24_corrected: 93.7, t48_raw: 64.0, t48_corrected: 78.1, t72_raw: 50.5, t72_corrected: 61.6 },
  { id: 'TN_MADURAI', name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198, regime: 'Active Monsoon', raw_nwp_mm: 29.7, corrected_mm: 26.4, bias_factor: 0.89, heavy_rain_prob: 0.19, alert_level: 'normal', t24_raw: 29.7, t24_corrected: 26.4, t48_raw: 24.8, t48_corrected: 22.1, t72_raw: 19.6, t72_corrected: 17.4 },
  { id: 'TN_SALEM', name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lon: 78.1460, regime: 'Coastal Rainfall', raw_nwp_mm: 32.1, corrected_mm: 30.2, bias_factor: 0.94, heavy_rain_prob: 0.22, alert_level: 'normal', t24_raw: 32.1, t24_corrected: 30.2, t48_raw: 26.8, t48_corrected: 25.2, t72_raw: 21.2, t72_corrected: 19.9 },
  { id: 'TN_OOTY', name: 'Ooty', state: 'Tamil Nadu', lat: 11.4102, lon: 76.6950, regime: 'Orographic Rainfall', raw_nwp_mm: 91.3, corrected_mm: 111.4, bias_factor: 1.22, heavy_rain_prob: 0.83, alert_level: 'very_heavy', t24_raw: 91.3, t24_corrected: 111.4, t48_raw: 76.1, t48_corrected: 92.8, t72_raw: 60.1, t72_corrected: 73.3 },
]

export const STATES = ['Maharashtra', 'Kerala', 'Rajasthan', 'West Bengal', 'Uttarakhand', 'Tamil Nadu']

export function getDistrictsByState(state) {
  return MOCK_DISTRICTS.filter((d) => d.state === state)
}

export function getAlerts() {
  return MOCK_DISTRICTS
    .filter((d) => d.heavy_rain_prob > 0.60)
    .sort((a, b) => b.heavy_rain_prob - a.heavy_rain_prob)
}
