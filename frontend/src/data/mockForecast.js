// Mock forecast data for charts and tables

// 14-day RMSE data derived from regime history
export const MOCK_RMSE_DATA = [
  { date: 'Sep 10', rmse_raw: 7.2, rmse_corrected: 4.6 },
  { date: 'Sep 11', rmse_raw: 6.8, rmse_corrected: 4.2 },
  { date: 'Sep 12', rmse_raw: 8.4, rmse_corrected: 5.1 },
  { date: 'Sep 13', rmse_raw: 9.1, rmse_corrected: 5.8 },
  { date: 'Sep 14', rmse_raw: 7.6, rmse_corrected: 4.8 },
  { date: 'Sep 15', rmse_raw: 6.2, rmse_corrected: 3.9 },
  { date: 'Sep 16', rmse_raw: 5.8, rmse_corrected: 3.6 },
  { date: 'Sep 17', rmse_raw: 6.9, rmse_corrected: 4.3 },
  { date: 'Sep 18', rmse_raw: 5.4, rmse_corrected: 3.4 },
  { date: 'Sep 19', rmse_raw: 7.1, rmse_corrected: 4.5 },
  { date: 'Sep 20', rmse_raw: 8.3, rmse_corrected: 5.2 },
  { date: 'Sep 21', rmse_raw: 6.7, rmse_corrected: 4.1 },
  { date: 'Sep 22', rmse_raw: 5.9, rmse_corrected: 3.7 },
  { date: 'Sep 23', rmse_raw: 6.8, rmse_corrected: 4.2 },
]

// Bias comparison data for BiasComparisonChart
export const MOCK_BIAS_COMPARISON = [
  { district: 'Nashik',   raw_nwp: 42.5, corrected: 38.2 },
  { district: 'Pune',     raw_nwp: 67.3, corrected: 59.8 },
  { district: 'Kolhapur', raw_nwp: 118.4, corrected: 144.4 },
  { district: 'Kozhikode',raw_nwp: 89.6, corrected: 79.7 },
  { district: 'Idukki',   raw_nwp: 134.7, corrected: 164.3 },
  { district: 'Kolkata',  raw_nwp: 143.2, corrected: 108.8 },
  { district: 'Darjeeling',raw_nwp:156.8, corrected: 191.3 },
  { district: 'Nainital', raw_nwp: 87.4,  corrected: 106.6 },
]
