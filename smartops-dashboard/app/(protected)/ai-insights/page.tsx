'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';
import { useInsights } from '@/hooks/use-insights';

// ✅ Safe severity config (UI-only, acceptable)
const severityConfig: Record<string, any> = {
  critical: {
    bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(139, 92, 246, 0.05))',
    border: 'rgba(239, 68, 68, 0.2)',
    badge: 'rgba(239, 68, 68, 0.15)',
    badgeText: '#f87171',
    label: 'CRITICAL',
  },
  warning: {
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(139, 92, 246, 0.05))',
    border: 'rgba(245, 158, 11, 0.2)',
    badge: 'rgba(245, 158, 11, 0.15)',
    badgeText: '#fbbf24',
    label: 'WARNING',
  },
  info: {
    bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05))',
    border: 'rgba(59, 130, 246, 0.2)',
    badge: 'rgba(6, 182, 212, 0.15)',
    badgeText: '#22d3ee',
    label: 'INFO',
  },
};

export default function AIInsightsPage() {
  const { insights, loading, error } = useInsights();

  // ✅ dynamic badge
  const activeCount = insights.length;

  // ✅ loading state
  if (loading) {
    return (
      <div className="p-4 text-sm text-text2">
        Loading AI insights...
      </div>
    );
  }

  // ✅ error state
  if (error) {
    return (
      <div className="p-4 text-sm text-red-500">
        Failed to load insights: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SectionHeader
          title="AI Insights & Anomalies"
          badge={`${activeCount} Active`}
          badgeColor="purple"
          icon={<Brain className="w-4 h-4" />}
        />
      </motion.div>

      {/* ================= INSIGHTS LIST ================= */}
      <div className="space-y-4">
        {insights.map((insight, index) => {
          // ✅ safe severity handling
          const severityKey = insight.severity?.toLowerCase() || 'info';
          const config =
            severityConfig[severityKey] || severityConfig.info;

          return (
            <motion.div
              key={insight.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl border"
              style={{
                background: config.bg,
                borderColor: config.border,
              }}
            >
              {/* TOP ROW */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-2xs px-2 py-1 rounded-md font-semibold"
                  style={{
                    background: config.badge,
                    color: config.badgeText,
                  }}
                >
                  {config.label}
                </span>

                <span className="text-2xs text-text3 font-mono">
                  {new Date(insight.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* MESSAGE */}
              <p className="text-sm text-text1 font-medium">
                {insight.message}
              </p>

              {/* TYPE / SOURCE */}
              {insight.type && (
                <p className="text-xs text-text3 mt-1">
                  {insight.type}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {insights.length === 0 && (
        <div className="text-center text-sm text-text3 py-10">
          No insights available
        </div>
      )}
    </div>
  );
}