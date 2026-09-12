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
    const safeUrl = url?.split('?')[0]

    const isAuthCheck =
      url?.includes('/api/auth/me')

    const isExpectedClientError =
      status === 400 ||
      status === 401 ||
      status === 403 ||
      status === 404

    // Expected authentication and validation failures are surfaced by the UI.
    if (!isAuthCheck && !isExpectedClientError) {

      console.error(
        `[API ERROR] ${safeUrl ?? 'unknown endpoint'} | ${status ?? 'network'}`
      )
    }

    return Promise.reject(error)
  }
)

export default api
