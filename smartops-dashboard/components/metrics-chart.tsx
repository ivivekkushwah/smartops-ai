'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { time: '00:00', requests: 2400, errors: 240, latency: 45 },
  { time: '04:00', requests: 1398, errors: 221, latency: 42 },
  { time: '08:00', requests: 9800, errors: 229, latency: 48 },
  { time: '12:00', requests: 3908, errors: 200, latency: 51 },
  { time: '16:00', requests: 4800, errors: 218, latency: 46 },
  { time: '20:00', requests: 3800, errors: 250, latency: 55 },
  { time: '23:59', requests: 4300, errors: 210, latency: 49 },
];

export function MetricsChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg bg-card border border-border p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Requests & Performance</h2>
        <p className="text-sm text-muted-foreground mt-1">Last 24 hours metrics</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff6b9d" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1f3a" vertical={false} />
            <XAxis dataKey="time" stroke="#8b92c9" style={{ fontSize: '12px' }} />
            <YAxis stroke="#8b92c9" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111833',
                border: '1px solid #1a1f3a',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e0e6ff' }}
              formatter={(value) => value.toLocaleString()}
            />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#00d4ff"
              strokeWidth={2}
              dot={false}
              fillOpacity={1}
              fill="url(#colorRequests)"
            />
            <Line
              type="monotone"
              dataKey="errors"
              stroke="#ff6b9d"
              strokeWidth={2}
              dot={false}
              fillOpacity={1}
              fill="url(#colorErrors)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-6 mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Total Requests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <span className="text-sm text-muted-foreground">Error Rate</span>
        </div>
      </div>
    </motion.div>
  );
}
