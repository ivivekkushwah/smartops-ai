'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon: React.ReactNode;
  color: 'cyan' | 'blue' | 'green' | 'red';
}

const colorMap = {
  cyan: 'from-primary to-secondary',
  blue: 'from-secondary to-blue-500',
  green: 'from-green-400 to-green-600',
  red: 'from-red-400 to-red-600',
};

export function MetricCard({
  label,
  value,
  unit,
  trend,
  icon,
  color,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-lg bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300"
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${colorMap[color]}`} />

      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colorMap[color]} text-primary-foreground shadow-lg shadow-primary/20`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>

        {/* Glow effect on hover */}
        <div className={`absolute bottom-0 right-0 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${colorMap[color]} -z-10`} />
      </div>
    </motion.div>
  );
}
