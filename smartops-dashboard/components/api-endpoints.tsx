'use client';

import { motion } from 'framer-motion';
import { Code, Network } from 'lucide-react';

interface EndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
  path: string;
  service: string;
  status: number | string;
}

const endpoints: EndpointProps[] = [
  {
    method: 'GET',
    path: 'localhost:8002/logs',
    service: 'MONITORING-SVC',
    status: 200,
  },
  {
    method: 'GET',
    path: 'localhost:8002/logs/service/AUTH-SERVICE',
    service: 'AUTH-SERVICE',
    status: 200,
  },
  {
    method: 'GET',
    path: 'localhost:8002/logs/level/INFO',
    service: 'MONITORING-SVC',
    status: 200,
  },
  {
    method: 'WS',
    path: 'localhost:8002/ws -> /topic/logs',
    service: 'ALL',
    status: 101,
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  POST: 'bg-green-500/20 text-green-400 border-green-500/30',
  PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  WS: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export function APIEndpoints() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg bg-card border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Code className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">API Endpoints</h2>
      </div>

      <div className="space-y-2">
        {endpoints.map((endpoint, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors group"
          >
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md border flex-shrink-0 ${
                methodColors[endpoint.method]
              }`}
            >
              {endpoint.method}
            </span>
            <span className="text-sm font-mono text-foreground flex-1 truncate group-hover:text-primary transition-colors">
              {endpoint.path}
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex-shrink-0 hidden sm:block">
              {endpoint.service}
            </span>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md flex-shrink-0">
              {endpoint.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
