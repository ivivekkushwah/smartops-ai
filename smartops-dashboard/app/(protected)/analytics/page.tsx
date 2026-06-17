'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';
import { dashboardService } from '@/services/dashboard-service';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface ServiceData {
  serviceName: string;
  status: string;
  responseTime: number;
}

export default function AnalyticsPage() {
  const [serviceData, setServiceData] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const services =
          await dashboardService.getServiceStats();

        const formatted = services.map((service: any) => ({
          serviceName: service.serviceName,
          status: service.status,
          responseTime: service.responseTime ?? 0,
        }));

        setServiceData(formatted);
      } catch (error) {
        console.error(
          'Failed to load analytics',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalServices = serviceData.length;

  const healthyServices = serviceData.filter(
    service => service.status === 'UP'
  ).length;

  const downServices = serviceData.filter(
    service => service.status === 'DOWN'
  ).length;

  const availability =
    totalServices === 0
      ? 0
      : Math.round(
          (healthyServices / totalServices) * 100
        );

  const avgResponseTime =
    serviceData.length === 0
      ? 0
      : Math.round(
          serviceData.reduce(
            (sum, service) =>
              sum + service.responseTime,
            0
          ) / serviceData.length
        );

  const responseChartData = serviceData.map(
    service => ({
      name: service.serviceName,
      responseTime: service.responseTime,
    })
  );

  const healthData = [
  {
    name: 'Healthy',
    value: healthyServices,
  },
  {
    name: 'Down',
    value: downServices,
  },
];

const COLORS = ['#22c55e', '#ef4444'];

const healthScore =
  availability >= 99
    ? 'Excellent'
    : availability >= 95
    ? 'Good'
    : 'Poor';

  if (loading) {
    return (
      <div className="p-4">
        <div className="surface-card p-6">
          Loading analytics...
        </div>
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
          title="Analytics"
          badge="Live Monitoring"
          badgeColor="green"
          icon={<BarChart3 className="w-4 h-4" />}
        />
      </motion.div>

      {/* Summary Cards */}
      {/* <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4"
      > */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
  <div className="surface-card p-5">
    <div className="text-sm text-text3">
      Total Services
    </div>
    <div className="text-3xl font-bold mt-2">
      {totalServices}
    </div>
  </div>

  <div className="surface-card p-5">
    <div className="text-sm text-text3">
      Healthy Services
    </div>
    <div className="text-3xl font-bold text-green-500 mt-2">
      {healthyServices}
    </div>
  </div>

  <div className="surface-card p-5">
    <div className="text-sm text-text3">
      Down Services
    </div>
    <div className="text-3xl font-bold text-red-500 mt-2">
      {downServices}
    </div>
  </div>

  <div className="surface-card p-5">
    <div className="text-sm text-text3">
      Availability
    </div>
    <div className="text-3xl font-bold text-cyan-500 mt-2">
      {availability}%
    </div>
  </div>

  <div className="surface-card p-5">
    <div className="text-sm text-text3">
      Avg Response
    </div>
    <div className="text-3xl font-bold text-purple-500 mt-2">
      {avgResponseTime}ms
    </div>
  </div>

  <div className="surface-card p-5">
    <div className="text-sm text-text3">
      System Health
    </div>
    <div className="text-2xl font-bold text-green-500 mt-2">
      {healthScore}
    </div>
  </div>
</div>

      {/* Response Time Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="surface-card surface-hover p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-cyan-500" />

            <h3 className="text-sm font-semibold text-text1">
              Service Response Time
            </h3>
          </div>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={responseChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
              />

              <XAxis
                dataKey="name"
                stroke="var(--text3)"
              />

              <YAxis
                stroke="var(--text3)"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg3)',
                  border:
                    '1px solid var(--border)',
                  borderRadius: '10px',
                }}
              />

              <Bar
                dataKey="responseTime"
                fill="#06b6d4"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  <div className="surface-card p-5">
    <h3 className="text-sm font-semibold mb-4">
      Service Health Distribution
    </h3>

    <ResponsiveContainer
      width="100%"
      height={320}
    >
      <PieChart>
        <Pie
          data={healthData}
          dataKey="value"
          nameKey="name"
          outerRadius={110}
          label
        >
          {healthData.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="surface-card p-5">
    <h3 className="text-sm font-semibold mb-4">
      Service Status Table
    </h3>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3">
              Service
            </th>
            <th className="text-left py-3">
              Status
            </th>
            <th className="text-left py-3">
              Response
            </th>
          </tr>
        </thead>

        <tbody>
          {serviceData.map(service => (
            <tr
              key={service.serviceName}
              className="border-b border-border/40"
            >
              <td className="py-3 font-medium">
                {service.serviceName.toUpperCase()}
              </td>

              <td className="py-3">
                <span
                  className={
                    service.status === 'UP'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {service.status}
                </span>
              </td>

              <td className="py-3">
                {service.responseTime} ms
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
    </div>
  );
}