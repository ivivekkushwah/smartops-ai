'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface ServiceCardProps {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: string;
  uptime: string;
  cpu: number;
  memory: number;
  port: number;
}

export function ServiceCard({
  name,
  status,
  responseTime,
  uptime,
  cpu,
  memory,
  port,
}: ServiceCardProps) {
  const statusColor = {
    online: 'bg-green-500/20 text-green-400 border-green-500/30',
    offline: 'bg-red-500/20 text-red-400 border-red-500/30',
    degraded: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  const statusLabel = {
    online: 'ONLINE',
    offline: 'OFFLINE',
    degraded: 'DEGRADED',
  };

  const statusDot = {
    online: 'bg-green-400',
    offline: 'bg-red-400',
    degraded: 'bg-yellow-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusDot[status]}`} />
          <h3 className="font-semibold text-foreground">{name}</h3>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor[status]}`}>
          {statusLabel[status]}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Response Time</p>
          <p className="text-lg font-bold text-foreground">{responseTime}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Uptime</p>
          <p className="text-lg font-bold text-primary">{uptime}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">CPU</p>
          <p className="text-lg font-bold text-accent">{cpu}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Memory</p>
          <p className="text-lg font-bold text-secondary">{memory}%</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2 mb-4">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cpu}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-accent to-primary"
          />
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${memory}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-secondary to-accent"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Port :{port}</span>
        <BarChart3 className="h-4 w-4 text-primary" />
      </div>
    </motion.div>
  );
}
