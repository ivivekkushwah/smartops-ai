'use client';

import { motion } from 'framer-motion';
import { Settings, Save, Copy } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';
import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';

export default function SettingsPage() {
  const {
  settings,
  loading,
  saving,
  updateSettings,
} = useSettings()

const [formData, setFormData] = useState({
  dashboardRefreshRate: 5,
  emailNotifications: true,
  pushNotifications: true,
  theme: 'dark',
})

useEffect(() => {
  if (!settings) return

  setFormData({
    dashboardRefreshRate:
      settings.dashboardRefreshRate ?? 5,

    emailNotifications:
      settings.emailNotifications ?? true,

    pushNotifications:
      settings.pushNotifications ?? true,

    theme:
      settings.theme ?? 'dark',
  })
}, [settings])

const handleSave = async () => {
  try {
    await updateSettings(formData)
  } catch (error) {
    console.error(error)
  }
}
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
  <div className="p-4 space-y-6 max-w-4xl">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader
        title="System Settings"
        subtitle="Manage dashboard and notification preferences"
        icon={<Settings className="w-4 h-4" />}
      />
    </motion.div>

    {/* Loading State */}
    {loading ? (
      <div className="surface-card p-10 text-center">
        Loading settings...
      </div>
    ) : (
      <>
        {/* Dashboard Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="surface-card surface-hover p-5"
        >
          <h3 className="text-sm font-semibold text-text1 mb-4">
            Dashboard Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-text3 block mb-2">
                Dashboard Refresh Rate
              </label>

              <select
                value={formData.dashboardRefreshRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dashboardRefreshRate: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-lg border bg-transparent text-text1"
                style={{ borderColor: 'var(--border)' }}
              >
                <option value={5}>5 Seconds</option>
                <option value={10}>10 Seconds</option>
                <option value={30}>30 Seconds</option>
                <option value={60}>60 Seconds</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-text3 block mb-2">
                Theme
              </label>

              <select
                value={formData.theme}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    theme: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border bg-transparent text-text1"
                style={{ borderColor: 'var(--border)' }}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="surface-card surface-hover p-5"
        >
          <h3 className="text-sm font-semibold text-text1 mb-4">
            Notification Settings
          </h3>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}
            >
              <span className="text-sm text-text2">
                Email Notifications
              </span>

              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailNotifications: e.target.checked,
                  })
                }
              />
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}
            >
              <span className="text-sm text-text2">
                Push Notifications
              </span>

              <input
                type="checkbox"
                checked={formData.pushNotifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pushNotifications: e.target.checked,
                  })
                }
              />
            </div>
          </div>
        </motion.div>

        {/* Save Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex gap-3"
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg border font-semibold text-xs flex items-center gap-2 transition-all"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              borderColor: 'rgba(59, 130, 246, 0.3)',
              color: 'var(--blue2)',
            }}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>

          <button
            onClick={() => {
              if (!settings) return

              setFormData({
                dashboardRefreshRate:
                  settings.dashboardRefreshRate,
                emailNotifications:
                  settings.emailNotifications,
                pushNotifications:
                  settings.pushNotifications,
                theme: settings.theme,
              })
            }}
            className="px-4 py-2 rounded-lg border font-semibold text-xs"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text2)',
            }}
          >
            Reset
          </button>
        </motion.div>
      </>
    )}
  </div>
)
}
