import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
})

// Request interceptor — add Content-Type
apiClient.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const msg = error.response.data?.detail || error.response.statusText || 'API error'
      return Promise.reject(new Error(msg))
    } else if (error.request) {
      // No response received — server likely down
      return Promise.reject(new Error('Backend unreachable — using demo data'))
    } else {
      return Promise.reject(new Error(error.message))
    }
  },
)

export default apiClient
