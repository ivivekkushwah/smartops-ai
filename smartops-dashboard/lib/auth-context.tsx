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

const PUBLIC_ROUTES = [
  '/login',
  '/register',
]

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {

  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  // ================= INITIALIZE AUTH =================

  useEffect(() => {

    const initializeAuth = async () => {

      try {

        const currentPath =
          window.location.pathname

        const isPublicRoute =
          PUBLIC_ROUTES.includes(currentPath)

        // Skip auth check on public routes
        if (isPublicRoute) {

          setLoading(false)

          return
        }

        const currentUser =
          await authService.getCurrentUser()

        setUser(currentUser)

      } catch (error) {

        // silently fail
        setUser(null)

      } finally {

        setLoading(false)
      }
    }

    initializeAuth()

  }, [])

  // ================= LOGIN =================

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

    } catch (error) {

      setUser(null)

      throw error

    } finally {

      setLoading(false)
    }
  }

  // ================= REGISTER =================

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

    } catch (error) {

      setUser(null)

      throw error

    } finally {

      setLoading(false)
    }
  }

  // ================= LOGOUT =================

  const logout = async () => {

    try {

      await authService.logout()

    } catch (error) {

      console.error(
        'Logout failed:',
        error
      )

    } finally {

      setUser(null)

      // redirect after logout
      window.location.href = '/login'
    }
  }

  // ================= PASSWORD RESET =================

  const requestPasswordReset = async (
    email: string
  ) => {

    try {

      // Support multiple possible method names on authService
      const svc: any = authService

      if (typeof svc.requestPasswordReset === 'function') {
        await svc.requestPasswordReset(email)
      } else if (typeof svc.sendPasswordReset === 'function') {
        await svc.sendPasswordReset(email)
      } else if (typeof svc.forgotPassword === 'function') {
        await svc.forgotPassword(email)
      } else {
        throw new Error('Password reset method not implemented on authService')
      }

    } catch (error) {

      console.error(
        'Password reset failed:',
        error
      )

      throw error
    }
  }

  // ================= REFRESH USER =================

  const refreshUser = async () => {

    try {

      const currentUser =
        await authService.getCurrentUser()

      setUser(currentUser)

    } catch (error) {

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

// ================= CUSTOM HOOK =================

export function useAuth() {

  const context =
    useContext(AuthContext)

  if (!context) {

    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }

  return context
}