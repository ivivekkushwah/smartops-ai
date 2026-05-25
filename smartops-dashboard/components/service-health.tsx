'use client';

import { motion } from 'framer-motion';
import { Server, Database, Network, Zap } from 'lucide-react';

interface Service {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  latency: number;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    name: 'API Gateway',
    status: 'healthy',
    uptime: 99.98,
    latency: 45,
    icon: <Network className="h-5 w-5" />,
  },
  {
    name: 'Database',
    status: 'healthy',
    uptime: 99.95,
    latency: 12,
    icon: <Database className="h-5 w-5" />,
  },
  {
    name: 'Cache Layer',
    status: 'degraded',
    uptime: 98.5,
    latency: 8,
    icon: <Zap className="h-5 w-5" />,
  },
  {
    name: 'Worker Pool',
    status: 'healthy',
    uptime: 99.92,
    latency: 156,
    icon: <Server className="h-5 w-5" />,
  },
];

const statusStyles = {
  healthy: {
    dot: 'bg-green-400',
    border: 'border-green-500/30 hover:border-green-500/60',
    text: 'text-green-400',
  },
  degraded: {
    dot: 'bg-yellow-400',
    border: 'border-yellow-500/30 hover:border-yellow-500/60',
    text: 'text-yellow-400',
  },
  down: {
    dot: 'bg-red-400',
    border: 'border-red-500/30 hover:border-red-500/60',
    text: 'text-red-400',
  },
};

export function ServiceHealth() {
  return (
    <div className="rounded-lg bg-card border border-border overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Service Health</h2>
      </div>

      <div className="divide-y divide-border">
        {services.map((service, idx) => {
          const style = statusStyles[service.status];

          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`px-6 py-4 flex items-center justify-between border-l-4 hover:bg-muted/50 transition-colors cursor-pointer group ${style.border}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-2.5 rounded-lg bg-muted text-primary`}>{service.icon}</div>

                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      <span className={`text-xs font-semibold ${style.text}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Uptime: {service.uptime}%</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-primary">{service.latency}ms</p>
                <p className="text-xs text-muted-foreground">latency</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
