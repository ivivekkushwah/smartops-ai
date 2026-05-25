import axios, { AxiosInstance } from 'axios'

// Base API URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8080'

// Axios Instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,

  // Required for Spring Boot session cookies
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status
    const url = error.config?.url

    const message =
      error.response?.data?.message ||
      error.message ||
      'Unknown error'

    // Ignore expected auth check failures
    const isAuthCheck =
      status === 401 &&
      url?.includes('/api/auth/me')

    if (!isAuthCheck) {
      console.error(
        `[API ERROR] ${url} | ${status} | ${message}`
      )
    }

    // Redirect only for protected routes
    if (
      status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('/login')
    ) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api