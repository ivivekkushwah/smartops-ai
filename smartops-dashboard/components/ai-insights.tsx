'use client';

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertCircle, Zap } from 'lucide-react';

interface Insight {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: 'opportunity' | 'warning' | 'info' | 'critical';
}

const insights: Insight[] = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Performance Optimization',
    description: 'Cache hit rate has improved 12% in the last hour. Consider expanding cache size for further gains.',
    type: 'opportunity',
  },
  {
    icon: <AlertCircle className="h-5 w-5" />,
    title: 'Degraded Service Alert',
    description: 'Cache layer is experiencing 2.5x higher latency. Investigate connection pooling settings.',
    type: 'warning',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Resource Utilization',
    description: 'Worker pool utilization at 78%. Consider scaling up if traffic continues to increase.',
    type: 'critical',
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: 'API Usage Pattern',
    description: 'Detected new traffic pattern from region US-West. Implementation of regional caching recommended.',
    type: 'info',
  },
];

const typeStyles = {
  opportunity: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    badge: 'bg-green-500/20 text-green-300',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300',
  },
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300',
  },
};

export function AIInsights() {
  return (
    <div className="rounded-lg bg-card border border-border overflow-hidden">
      <div className="border-b border-border px-6 py-4 flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-secondary">
          <Lightbulb className="h-4 w-4 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
      </div>

      <div className="max-h-[400px] overflow-y-auto divide-y divide-border [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-card [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-lg">
        {insights.map((insight, idx) => {
          const style = typeStyles[insight.type];

          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 border-l-4 hover:bg-muted/30 transition-colors ${style.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${style.bg}`}>
                  <div className={style.icon}>{insight.icon}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{insight.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${style.badge}`}>
                      {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
