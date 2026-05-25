'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLogs } from '@/hooks/use-logs';
import { AlertCircle, AlertTriangle, Info, Bug } from 'lucide-react';

const levelStyles = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: Info,
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: AlertTriangle,
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: AlertCircle,
  },
  debug: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    icon: Bug,
  },
};

export function LogStream() {
  const { logs, isConnected } = useLogs();

  return (
    <div className="rounded-lg bg-card border border-border overflow-hidden">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Live Log Stream</h2>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-xs text-muted-foreground">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-2 p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-card [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-lg">
        <AnimatePresence>
          {logs.map((log) => {
            const style = levelStyles[log.level];
            const Icon = style.icon;

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-3 p-3 rounded-lg border ${style.bg} ${style.border}`}
              >
                <Icon className={`h-4 w-4 ${style.text} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{log.message}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground`}>
                      {log.service}
                    </span>
                    {log.level && (
                      <span className={`text-xs px-2 py-0.5 rounded ${style.bg} ${style.text}`}>
                        {log.level.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
