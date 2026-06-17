'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';
import { useInsights } from '@/hooks/use-insights';

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

  const activeCount = insights.length;

  if (loading) {
    return (
      <div className="p-4 text-sm text-text2">
        Loading AI insights...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500">
        Failed to load insights: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
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

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const severityKey =
            insight.severity?.toLowerCase() || 'info';

          const config =
            severityConfig[severityKey] ||
            severityConfig.info;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl border"
              style={{
                background: config.bg,
                borderColor: config.border,
              }}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-3">
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
                  {new Date(
                    insight.createdAt
                  ).toLocaleString()}
                </span>
              </div>

              {/* SERVICE */}
              <div className="mb-3">
                <p className="text-xs text-text3 uppercase tracking-wide">
                  Service
                </p>

                <p className="text-sm font-semibold text-text1">
                  {insight.serviceName}
                </p>
              </div>

              {/* SUMMARY */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-text2 mb-1">
                  Summary
                </p>

                <p className="text-sm text-text1">
                  {insight.summary}
                </p>
              </div>

              {/* ROOT CAUSE */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-text2 mb-1">
                  Root Cause
                </p>

                <p className="text-sm text-text1">
                  {insight.rootCause}
                </p>
              </div>

              {/* IMPACT */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-text2 mb-1">
                  Impact
                </p>

                <p className="text-sm text-text1">
                  {insight.impact}
                </p>
              </div>

              {/* RECOMMENDATION */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-text2 mb-1">
                  Recommendation
                </p>

                <p className="text-sm text-text1">
                  {insight.recommendation}
                </p>
              </div>

              {/* CONFIDENCE */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-text3">
                  AI Confidence
                </span>

                <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                  {insight.confidence ?? 0}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-10 h-10 mx-auto mb-3 text-text3" />

          <p className="text-sm text-text2">
            No AI insights generated yet
          </p>

          <p className="text-xs text-text3 mt-1">
            Insights will appear when alerts are analyzed
          </p>
        </div>
      )}
    </div>
  );
}