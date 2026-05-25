'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'red' | 'amber' | 'cyan' | 'purple';
  miniChart?: number[];
  index?: number;
}

const colorMap = {
  blue: { icon: 'rgba(59, 130, 246, 0.15)', line: 'linear-gradient(90deg, transparent, #3b82f6, transparent)' },
  green: { icon: 'rgba(16, 185, 129, 0.15)', line: 'linear-gradient(90deg, transparent, #10b981, transparent)' },
  red: { icon: 'rgba(239, 68, 68, 0.15)', line: 'linear-gradient(90deg, transparent, #ef4444, transparent)' },
  amber: { icon: 'rgba(245, 158, 11, 0.15)', line: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' },
  cyan: { icon: 'rgba(6, 182, 212, 0.15)', line: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' },
  purple: { icon: 'rgba(139, 92, 246, 0.15)', line: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)' },
};

export function MetricCard({
  label,
  value,
  trend,
  icon,
  color = 'blue',
  miniChart = [],
  index = 0,
}: MetricCardProps) {
  const colorStyle = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="surface-card surface-hover cursor-pointer p-3.5 relative overflow-hidden group"
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: colorStyle.line }}
      />

      {/* Content */}
      <div className="flex items-start justify-between mb-2.5">
        <div
          className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-base"
          style={{ backgroundColor: colorStyle.icon }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className="text-2xs font-mono"
            style={{ color: trend >= 0 ? 'var(--green2)' : 'var(--red2)' }}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      {/* Metric */}
      <div className="mb-2">
        <div className="text-2xl font-bold text-text1" style={{ letterSpacing: '-1px' }}>
          {value}
        </div>
      </div>

      {/* Label */}
      <div className="text-2xs mb-2" style={{ color: 'var(--text3)', letterSpacing: '0.3px' }}>
        {label}
      </div>

      {/* Mini Chart */}
      {miniChart.length > 0 && (
        <div className="flex items-flex-end gap-0.5 h-6">
          {miniChart.map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${height}%`,
                backgroundColor: colorStyle.line.replace(/[^#a-f0-9]/gi, '').split(',')[0] || 'currentColor',
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
