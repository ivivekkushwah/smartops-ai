'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
}

const initialAlerts: Alert[] = [
  {
    id: '1',
    title: 'Critical: High CPU Usage',
    message: 'Worker node 3 CPU usage exceeded 95% threshold',
    severity: 'critical',
    timestamp: '2 minutes ago',
  },
  {
    id: '2',
    title: 'Warning: Cache Eviction',
    message: 'Cache layer eviction rate is above normal',
    severity: 'warning',
    timestamp: '5 minutes ago',
  },
  {
    id: '3',
    title: 'Info: Database Backup',
    message: 'Scheduled backup completed successfully',
    severity: 'info',
    timestamp: '12 minutes ago',
  },
];

const severityStyles = {
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
};

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="rounded-lg bg-card border border-border overflow-hidden">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Active Alerts</h2>
          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">
            {alerts.length}
          </span>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-2 p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-card [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-lg">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-32"
            >
              <p className="text-sm text-muted-foreground">No active alerts</p>
            </motion.div>
          ) : (
            alerts.map((alert) => {
              const style = severityStyles[alert.severity];

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${style.bg} ${style.border} group`}
                >
                  <div className={`h-2 w-2 rounded-full ${style.dot} flex-shrink-0 mt-1.5`} />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{alert.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-2">{alert.timestamp}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dismissAlert(alert.id)}
                    className="flex-shrink-0 p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </motion.button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
