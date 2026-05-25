'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAlerts } from '@/hooks/use-alerts';
import { SectionHeader } from '@/components/shared/section-header';

export default function AlertsPage() {
  const { alerts, stats, isConnected } = useAlerts();

  // ✅ Dynamic severity styling
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'WARNING':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'INFO':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  // ✅ Dynamic status styling
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-red-400 bg-red-500/10';
      case 'ACKNOWLEDGED':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'RESOLVED':
        return 'text-green-400 bg-green-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* ================= HEADER ================= */}
      <SectionHeader
        title="Alerts & Incidents"
        badge={isConnected ? 'Live' : 'Disconnected'}
        badgeColor={isConnected ? 'green' : 'red'}
        icon={<AlertTriangle className="w-4 h-4" />}
      />

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="surface-card p-4">
          <p className="text-xs text-text3">Total</p>
          <p className="text-lg font-semibold">{stats?.total ?? 0}</p>
        </div>

        <div className="surface-card p-4">
          <p className="text-xs text-text3">Active</p>
          <p className="text-lg font-semibold text-red-400">
            {stats?.active ?? 0}
          </p>
        </div>

        <div className="surface-card p-4">
          <p className="text-xs text-text3">Acknowledged</p>
          <p className="text-lg font-semibold text-yellow-400">
            {(stats as any)?.acknowledged ?? 0}
          </p>
        </div>

        <div className="surface-card p-4">
          <p className="text-xs text-text3">Resolved</p>
          <p className="text-lg font-semibold text-green-400">
            {stats?.resolved ?? 0}
          </p>
        </div>
      </div>

      {/* ================= REFRESH ================= */}
      <div className="flex justify-end">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* ================= ALERT LIST ================= */}
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const severityClass = getSeverityClass(
            alert.severity.toUpperCase()
          );
          const statusClass = getStatusClass(
            alert.status.toUpperCase()
          );

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="surface-card p-4 flex items-center justify-between"
            >
              {/* LEFT */}
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-text1">
                  {alert.title}
                </p>

                <p className="text-xs text-text3">
                  {(alert as any).description ?? ''}
                </p>

                <p className="text-2xs text-text3">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-2">
                {/* Severity */}
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border ${severityClass}`}
                >
                  {alert.severity.toUpperCase()}
                </span>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${statusClass}`}
                >
                  {alert.status.toUpperCase()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}