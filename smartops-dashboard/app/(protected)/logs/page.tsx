'use client';

import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Clock,
} from 'lucide-react';

import { SectionHeader } from '@/components/shared/section-header';

import { useEffect, useState } from 'react';

import { logService } from '@/services/log-service';

const logLevels = {
  INFO: {
    color: '#60a5fa',
    bg: 'rgba(59, 130, 246, 0.1)',
  },

  WARN: {
    color: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.1)',
  },

  ERROR: {
    color: '#f87171',
    bg: 'rgba(239, 68, 68, 0.1)',
  },

  DEBUG: {
    color: '#94a3b8',
    bg: 'rgba(100, 116, 139, 0.1)',
  },
};

interface LogEntry {
  id: string;

  timestamp: string;

  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

  message: string;

  serviceName: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedLevel, setSelectedLevel] =
    useState<string | null>(null);

  // =========================
  // FETCH LOGS
  // =========================

  useEffect(() => {
    fetchLogs();

    const unsubscribe =
      logService.subscribeToLogs((newLog) => {
        setLogs((prev) => {
          // Ensure newLog conforms to LogEntry (provide defaults if missing)
          const entry: LogEntry = {
            id: (newLog as any).id ?? String(Date.now()),
            timestamp: (newLog as any).timestamp ?? new Date().toISOString(),
            level: (newLog as any).level ?? 'info',
            message: (newLog as any).message ?? '',
            serviceName: (newLog as any).serviceName ?? 'unknown',
          };

          return [entry, ...prev].slice(0, 50);
        });
      });

    return () => unsubscribe();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const data =
        await logService.getRecentLogs(100);

      setLogs(
        data.map((log) => ({
          id: (log as any).id ?? String(Date.now()),
          timestamp:
            (log as any).timestamp ?? new Date().toISOString(),
          level:
            ((log as any).level ?? 'info').toUpperCase() as LogEntry['level'],
          message: (log as any).message ?? '',
          serviceName: (log as any).serviceName ?? 'unknown',
        }))
      );
    } catch (error) {
      console.error(
        'Failed to fetch logs:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FILTER LOGS
  // =========================

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      log.serviceName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesLevel =
      !selectedLevel ||
      log.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SectionHeader
          title="Live Log Stream"
          badge="Real-time"
          badgeColor="blue"
          icon={<Clock className="w-4 h-4" />}
        />

        {/* CONTROLS */}

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-2">

            <div
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{
                borderColor: 'var(--border)',
                backgroundColor:
                  'rgba(255,255,255,0.02)',
              }}
            >
              <Search
                className="w-4 h-4"
                style={{
                  color: 'var(--text3)',
                }}
              />

              <input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="flex-1 bg-transparent border-0 outline-none text-xs text-text2 placeholder:text-text3"
              />
            </div>

            <button
              className="p-2 rounded-lg border"
              style={{
                borderColor: 'var(--border)',
                backgroundColor:
                  'rgba(255,255,255,0.02)',
              }}
            >
              <Filter className="w-4 h-4 text-text2" />
            </button>

            <button
              className="p-2 rounded-lg border"
              style={{
                borderColor: 'var(--border)',
                backgroundColor:
                  'rgba(255,255,255,0.02)',
              }}
            >
              <Download className="w-4 h-4 text-text2" />
            </button>
          </div>

          {/* LEVEL FILTERS */}

          <div className="flex items-center gap-2">
            <span className="text-xs text-text3">
              Filter:
            </span>

            {Object.entries(logLevels).map(
              ([level, style]) => (
                <button
                  key={level}
                  onClick={() =>
                    setSelectedLevel(
                      selectedLevel === level
                        ? null
                        : level
                    )
                  }
                  className="text-2xs px-2.5 py-1 rounded-md border transition-all"
                  style={{
                    backgroundColor:
                      selectedLevel === level
                        ? style.bg
                        : 'rgba(255,255,255,0.02)',

                    color:
                      selectedLevel === level
                        ? style.color
                        : 'var(--text3)',

                    borderColor:
                      selectedLevel === level
                        ? style.color + '40'
                        : 'var(--border)',
                  }}
                >
                  {level}
                </button>
              )
            )}
          </div>
        </div>

        {/* LOG STREAM */}

        <div
          className="border rounded-lg p-3 font-mono text-2xs overflow-hidden"
          style={{
            borderColor: 'var(--border)',
            backgroundColor:
              'rgba(0,0,0,0.3)',
            maxHeight: '600px',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div className="text-text3 text-center py-10">
              Loading logs...
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredLogs.map((log) => (
                <div
  key={log.id}
  className="flex gap-2"
>
                  <span
                    style={{
                      color: 'var(--text3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {new Date(
                      log.timestamp
                    ).toLocaleTimeString()}
                  </span>

                  <span
                    style={{
                      minWidth: '130px',
                      whiteSpace: 'nowrap',
                    }}
                    className="text-text2"
                  >
                    {log.serviceName}
                  </span>

                  <span
                    style={{
                      color:
                        logLevels[log.level]
                          .color,

                      backgroundColor:
                        logLevels[log.level]
                          .bg,

                      padding: '0 4px',

                      borderRadius: '3px',

                      minWidth: '50px',

                      textAlign: 'center',

                      fontWeight: '600',
                    }}
                  >
                    {log.level}
                  </span>

                  <span
                    style={{
                      color: 'var(--text2)',
                      flex: 1,
                    }}
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}