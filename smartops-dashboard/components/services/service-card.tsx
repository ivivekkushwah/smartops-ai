'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface ServiceMetric {
  label: string;
  value: string | number;
  unit?: string;
}

interface ServiceCardProps {
  name: string;
  status: 'online' | 'offline' | 'warning';
  metrics: ServiceMetric[];
  port: number;
  index?: number;
}

const statusConfig = {
  online: { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', textColor: '#34d399', label: 'ONLINE' },
  offline: { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)', textColor: '#f87171', label: 'OFFLINE' },
  warning: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', textColor: '#fbbf24', label: 'WARNING' },
};

export function ServiceCard({ name, status, metrics, port, index = 0 }: ServiceCardProps) {
  const statusStyle = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index || 0) * 0.1 }}
      className="surface-card surface-hover p-3 space-y-2.5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: statusStyle.color, boxShadow: `0 0 6px ${statusStyle.color}` }}
          />
          <span className="text-xs font-semibold text-text1">{name}</span>
        </div>
        <span
          className="text-2xs font-mono px-1.5 py-0.5 rounded-sm font-medium"
          style={{
            backgroundColor: statusStyle.bgColor,
            color: statusStyle.textColor,
            border: `1px solid ${statusStyle.color}33`,
          }}
        >
          {statusStyle.label}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-1 text-2xs">
        {metrics.map((metric, i) => (
          <div key={i} className="space-y-0.5">
            <div style={{ color: 'var(--text3)' }}>{metric.label}</div>
            <div className="text-xs font-semibold font-mono text-text2">
              {metric.value}{metric.unit ? ` ${metric.unit}` : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="space-y-1.5 pt-1">
        {metrics
          .filter((m) => typeof m.value === 'number' && m.value <= 100)
          .slice(0, 2)
          .map((metric, i) => (
            <div key={i}>
              <div className="h-0.75 rounded-sm overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div
                  className="h-full rounded-sm transition-all"
                  style={{
                    width: `${metric.value}%`,
                    backgroundColor: metric.value > 80 ? 'var(--amber)' : 'var(--green)',
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      {/* Port and Chart */}
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <span className="text-2xs font-mono text-text3">Port: {port}</span>
        <div className="flex gap-0.5">
          {[30, 45, 35, 60, 50, 40, 55, 70].map((h, i) => (
            <div
              key={i}
              className="w-0.75 rounded-sm"
              style={{
                height: `${h}%`,
                backgroundColor: 'var(--blue2)',
                opacity: 0.6,
                minHeight: '12px',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
