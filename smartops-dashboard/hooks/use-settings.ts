'use client'

import { useCallback, useEffect, useState } from 'react'
import { settingsService } from '@/services/settings-service'

export interface UserSettings {
  dashboardRefreshRate: number
  emailNotifications: boolean
  pushNotifications: boolean
  theme: string
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await settingsService.getSettings()

      setSettings(data)
    } catch (err) {
      console.error('Failed to fetch settings:', err)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = async (
    updatedSettings: Partial<UserSettings>
  ) => {
    try {
      setSaving(true)
      setError(null)

      const data = await settingsService.updateSettings(
        updatedSettings
      )

      setSettings(data)

      return data
    } catch (err) {
      console.error('Failed to update settings:', err)
      setError('Failed to save settings')
      throw err
    } finally {
      setSaving(false)
    }
  }

  const resetError = () => {
    setError(null)
  }

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    saving,
    error,
    refetch: fetchSettings,
    updateSettings,
    resetError,
  }
}