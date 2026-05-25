'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

import { authService } from '../services/auth-service'
import type { User } from '../services/auth-service'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean

  login: (
    email: string,
    password: string
  ) => Promise<void>

  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>

  logout: () => Promise<void>

  requestPasswordReset: (
    email: string
  ) => Promise<void>

  refreshUser: () => Promise<void>
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(
    null
  )

  const [loading, setLoading] = useState(true)

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser =
          await authService.getCurrentUser()

        setUser(currentUser)
      } catch {
        // User not authenticated
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Login
  const login = async (
    email: string,
    password: string
  ) => {
    try {
      setLoading(true)

      await authService.login({
        email,
        password,
      })

      const currentUser =
        await authService.getCurrentUser()

      setUser(currentUser)
    } finally {
      setLoading(false)
    }
  }

  // Register
  const register = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      setLoading(true)

      await authService.register({
        email,
        password,
        name,
      })

      const currentUser =
        await authService.getCurrentUser()

      setUser(currentUser)
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }

  // Password Reset
  const requestPasswordReset = async (
    email: string
  ) => {
    await authService.requestPasswordReset(
      email
    )
  }

  // Refresh current user
  const refreshUser = async () => {
    try {
      const currentUser =
        await authService.getCurrentUser()

      setUser(currentUser)
    } catch {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,

        login,
        register,
        logout,

        requestPasswordReset,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }

  return context
}