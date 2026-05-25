'use client';

import { motion } from 'framer-motion';
import { BarChart3, LineChart } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';
import { LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { useEffect } from 'react';
import { dashboardService } from '@/services/dashboard-service';


export default function AnalyticsPage() {


  const [dailyData, setDailyData] = useState([]);
const [serviceData, setServiceData] =
  useState([]);

useEffect(() => {
  const fetchWeeklyData = async () => {
    try {
      const data =
        await dashboardService.getWeeklyMetrics();

      const formatted = data.map(
        (item: any) => ({
          day: new Date(
            item.timestamp
          ).toLocaleDateString('en-US', {
            weekday: 'short',
          }),

          requests: item.value,

          errors: Math.round(
            item.value * 0.05
          ),

          latency: Math.round(
            item.value * 0.1
          ),
        })
      );

      setDailyData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  fetchWeeklyData();
}, []);

useEffect(() => {
  const fetchServices = async () => {
    try {
      const services =
        await dashboardService.getServiceStats();

      const formatted = services.map(
        (service: any) => ({
          name: service.serviceName,

          requests:
            service.responseTime * 10,

          errors:
            service.status === 'DOWN'
              ? 50
              : 5,
        })
      );

      setServiceData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  fetchServices();
}, []);

  return (
    <div className="p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SectionHeader
          title="Advanced Analytics"
          badge="7-day view"
          badgeColor="blue"
          icon={<BarChart3 className="w-4 h-4" />}
        />
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Daily Requests */}
        <div className="surface-card surface-hover p-4">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="w-4 h-4" style={{ color: 'var(--blue2)' }} />
            <h3 className="text-sm font-semibold text-text1">Daily Requests</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsLineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text3)" style={{ fontSize: '11px' }} />
              <YAxis stroke="var(--text3)" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'var(--text1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text3)' }} />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Requests */}
        <div className="surface-card surface-hover p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" style={{ color: 'var(--cyan2)' }} />
            <h3 className="text-sm font-semibold text-text1">Requests by Service</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text3)" style={{ fontSize: '10px' }} />
              <YAxis stroke="var(--text3)" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'var(--text1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text3)' }} />
              <Bar dataKey="requests" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Error Rate and Latency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Error Rate Trend */}
        <div className="surface-card surface-hover p-4">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="w-4 h-4" style={{ color: 'var(--red2)' }} />
            <h3 className="text-sm font-semibold text-text1">Error Rate Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsLineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text3)" style={{ fontSize: '11px' }} />
              <YAxis stroke="var(--text3)" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'var(--text1)' }}
              />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="#ef4444"
                dot={false}
                strokeWidth={2}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Latency Metrics */}
        <div className="surface-card surface-hover p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" style={{ color: 'var(--amber2)' }} />
            <h3 className="text-sm font-semibold text-text1">Latency Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text3)" style={{ fontSize: '11px' }} />
              <YAxis stroke="var(--text3)" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'var(--text1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text3)' }} />
              <Bar dataKey="latency" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Requests', value: '2.4M', change: '+8%' },
          { label: 'Error Rate', value: '0.12%', change: '-2%' },
          { label: 'Avg Latency', value: '142ms', change: '+1%' },
          { label: 'Uptime', value: '99.97%', change: '+0.2%' },
        ].map((stat, i) => (
          <div key={i} className="surface-card surface-hover p-3">
            <div className="text-2xs text-text3 mb-1">{stat.label}</div>
            <div className="flex items-baseline justify-between">
              <div className="text-lg font-bold text-text1">{stat.value}</div>
              <span className="text-2xs" style={{ color: stat.change.startsWith('+') ? 'var(--green2)' : 'var(--red2)' }}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
