'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Trash2,
} from 'lucide-react'
import { useAlerts } from '@/hooks/use-alerts'
import { SectionHeader } from '@/components/shared/section-header'

export default function AlertsPage() {
  const {
    alerts,
    stats,
    isConnected,
    loading,
    refetch,
    acknowledge,
    resolve,
    delete: deleteAlert,
  } = useAlerts()

  const [filter, setFilter] = useState('ALL')

  const filteredAlerts =
    filter === 'ALL'
      ? alerts
      : alerts.filter((alert) => alert.status === filter)

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'WARNING':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'INFO':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="surface-card p-10 text-center">
          Loading alerts...
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <SectionHeader
        title="Alerts & Incidents"
        badge={isConnected ? 'Live' : 'Disconnected'}
        badgeColor={isConnected ? 'green' : 'red'}
        icon={<AlertTriangle className="w-4 h-4" />}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total" value={stats?.total ?? 0} />
        <Card label="Active" value={stats?.active ?? 0} red />
        <Card
          label="Acknowledged"
          value={stats?.acknowledged ?? 0}
          yellow
        />
        <Card label="Resolved" value={stats?.resolved ?? 0} green />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === item
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={refetch}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <div className="surface-card p-10 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-text3" />
          <h3 className="font-semibold mb-2">
            No Alerts Found
          </h3>
          <p className="text-sm text-text3">
            No alerts match the selected filter.
          </p>
        </div>
      )}

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => {
          const severityClass = getSeverityClass(alert.severity)
          const statusClass = getStatusClass(alert.status)

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`surface-card p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-l-4 ${
                alert.severity === 'CRITICAL'
                  ? 'border-l-red-500'
                  : alert.severity === 'WARNING'
                  ? 'border-l-yellow-500'
                  : 'border-l-blue-500'
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-base">
                  {alert.title}
                </h3>

                <p className="text-sm text-text2 mt-1">
                  {alert.message}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-text3">
                  {alert.serviceName && (
                    <span>{alert.serviceName}</span>
                  )}

                  <span>
                    {formatDate(alert.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 text-xs border rounded-md ${severityClass}`}
                  >
                    {alert.severity}
                  </span>

                  <span
                    className={`px-3 py-1 text-xs rounded-md ${statusClass}`}
                  >
                    {alert.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {alert.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => acknowledge(alert.id)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                      >
                        Acknowledge
                      </button>

                      <button
                        onClick={() => resolve(alert.id)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors"
                      >
                        Resolve
                      </button>
                    </>
                  )}

                  {alert.status === 'ACKNOWLEDGED' && (
                    <button
                      onClick={() => resolve(alert.id)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Resolve
                    </button>
                  )}

                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function Card({
  label,
  value,
  red,
  yellow,
  green,
}: {
  label: string
  value: number
  red?: boolean
  yellow?: boolean
  green?: boolean
}) {
  return (
    <div className="surface-card p-4">
      <p className="text-xs text-text3">{label}</p>

      <p
        className={`text-2xl font-bold mt-1 ${
          red
            ? 'text-red-400'
            : yellow
            ? 'text-yellow-400'
            : green
            ? 'text-green-400'
            : 'text-text1'
        }`}
      >
        {value}
      </p>
    </div>
  )
}