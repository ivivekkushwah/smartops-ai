import api from '@/service/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

class AuthService {

  // Error handler
  private handleError(error: any): ApiError {
    if (error.response?.data?.message) {
      return {
        message: error.response.data.message,
        code: error.response.data.code,
        status: error.response.status,
      }
    }

    if (error.message === 'Network Error') {
      return {
        message: 'Network error',
        status: 0,
      }
    }

    return {
      message: 'Something went wrong',
      status: error.response?.status,
    }
  }

  // 🔥 LOGIN (cookie-based)
  async login(credentials: LoginRequest): Promise<void> {
    try {
      await api.post('/api/auth/login', credentials)
      // ✅ Cookie automatically stored by browser
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 🔥 REGISTER
  async register(data: RegisterRequest): Promise<void> {
    try {
      await api.post('/api/auth/register', data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 🔥 GET CURRENT USER
  async getCurrentUser(): Promise<User> {
    try {
      const res = await api.get('/api/auth/me')
      return res.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 🔥 LOGOUT
  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // 🔥 AUTH CHECK
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser()
      return true
    } catch {
      return false
    }
  }
}

export const authService = new AuthService()