'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useAlerts } from '@/hooks/use-alerts'
import { SectionHeader } from '@/components/shared/section-header'

export default function AlertsPage() {
  const { alerts, stats, isConnected } = useAlerts()

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'WARNING':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'INFO':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-red-400 bg-red-500/10'
      case 'ACKNOWLEDGED':
        return 'text-yellow-400 bg-yellow-500/10'
      case 'RESOLVED':
        return 'text-green-400 bg-green-500/10'
      default:
        return 'text-gray-400 bg-gray-500/10'
    }
  }

  return (
    <div className="p-4 space-y-6">
      <SectionHeader
        title="Alerts & Incidents"
        badge={isConnected ? 'Live' : 'Disconnected'}
        badgeColor={isConnected ? 'green' : 'red'}
        icon={<AlertTriangle className="w-4 h-4" />}
      />

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total" value={stats?.total ?? 0} />
        <Card label="Active" value={stats?.active ?? 0} red />
        <Card label="Acknowledged" value={stats?.acknowledged ?? 0} yellow />
        <Card label="Resolved" value={stats?.resolved ?? 0} green />
      </div>

      {/* REFRESH */}
      <div className="flex justify-end">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* ALERT LIST */}
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const severityClass = getSeverityClass(alert.severity)
          const statusClass = getStatusClass(alert.status)

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="surface-card p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{alert.title}</p>
                <p className="text-xs text-text3">{alert.message}</p>
                <p className="text-2xs text-text3">
                  {formatDate(alert.createdAt)}
                </p>
              </div>

              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs border rounded ${severityClass}`}>
                  {alert.severity}
                </span>

                <span className={`px-2 py-1 text-xs rounded ${statusClass}`}>
                  {alert.status}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function Card({ label, value, red, yellow, green }: any) {
  return (
    <div className="surface-card p-4">
      <p className="text-xs text-text3">{label}</p>
      <p
        className={`text-lg font-semibold ${
          red
            ? 'text-red-400'
            : yellow
            ? 'text-yellow-400'
            : green
            ? 'text-green-400'
            : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}