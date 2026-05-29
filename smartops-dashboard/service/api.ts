import axios, { AxiosInstance } from 'axios'

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8080'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,

  // cookie-based JWT
  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ================= REQUEST INTERCEPTOR =================

api.interceptors.request.use(
  (config) => {
    return config
  },

  (error) => Promise.reject(error)
)

// ================= RESPONSE INTERCEPTOR =================

api.interceptors.response.use(
  (response) => response,

  (error) => {

    const status = error.response?.status
    const url = error.config?.url

    const message =
      error.response?.data?.message ||
      error.message ||
      'Unknown error'

    const isAuthCheck =
      url?.includes('/api/auth/me')

    // avoid console spam for auth check
    if (!isAuthCheck) {

      console.error(
        `[API ERROR] ${url} | ${status} | ${message}`
      )
    }

    // redirect only on protected pages
    if (
      status === 401 &&
      typeof window !== 'undefined'
    ) {

      const publicRoutes = [
        '/login',
        '/register'
      ]

      const isPublicRoute =
        publicRoutes.includes(window.location.pathname)

      if (!isPublicRoute) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api