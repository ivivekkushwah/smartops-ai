'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '@/hooks/use-dashboard';
import { useServices } from '@/hooks/use-services';

export default function DashboardPage() {
  const { metrics, loading, error } = useDashboard(10000);
  const {
    services,
    loading: servicesLoading,
  } = useServices(5000);

  const [chartData, setChartData] = useState<number[]>([]);

  // Fake chart data (since backend doesn't provide yet)
  useEffect(() => {
    setChartData([10, 20, 15, 25, 30, 18, 22]);
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Error loading dashboard</div>;

  return (
    <div className="p-6 space-y-6">

      {/* ===================== TOP METRICS ===================== */}
      <div className="grid grid-cols-4 gap-4">

        <div className="p-4 border rounded">
          <p>Total Logs</p>
          <h2 className="text-xl font-bold">
            {metrics?.totalLogs ?? 0}
          </h2>
        </div>

        <div className="p-4 border rounded">
          <p>System Health</p>
          <h2 className="text-xl font-bold">
            {metrics?.cpuMetric ?? 0}%
          </h2>
        </div>

        <div className="p-4 border rounded">
          <p>API Requests</p>
          <h2 className="text-xl font-bold">
            {metrics?.requestThroughput ?? 0}
          </h2>
        </div>

        <div className="p-4 border rounded">
          <p>Services Online</p>
          <h2 className="text-xl font-bold">
            {servicesLoading
              ? '...'
              : `${services.filter(s => s.status === 'UP').length}/${services.length}`}
          </h2>
        </div>

      </div>

      {/* ===================== CHART ===================== */}
      <div className="p-4 border rounded">
        <h3 className="mb-2 font-semibold">
          Request Metrics (24h)
        </h3>

        <div className="flex gap-2">
          {chartData.map((value, index) => (
            <div
              key={index}
              className="bg-blue-500 w-4"
              style={{ height: `${value * 3}px` }}
            />
          ))}
        </div>
      </div>

      {/* ===================== SYSTEM RESOURCES ===================== */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">
          System Resources
        </h3>

        <p>CPU Usage: {metrics?.cpuMetric ?? 0}%</p>
        <p>Memory Usage: {metrics?.memoryMetric ?? 0}%</p>
        <p>Error Rate: {metrics?.errorRate ?? 0}%</p>
      </div>

      {/* ===================== SERVICE STATUS ===================== */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-4">
          Service Status
        </h3>

        {servicesLoading ? (
          <p>Loading...</p>
        ) : services.length === 0 ? (
          <p>No services added</p>
        ) : (
          <div className="space-y-2">

            {services.map((svc) => (
              <div
                key={svc.id}
                className="flex justify-between items-center border p-2 rounded"
              >

                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        svc.status === 'UP'
                          ? 'green'
                          : 'red',
                    }}
                  />
                  <span>{svc.serviceName}</span>
                </div>

                <span>{svc.responseTime} ms</span>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* ===================== HEALTH SUMMARY ===================== */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">
          Health Summary
        </h3>

        <p>
          Services Online:{' '}
          {servicesLoading
            ? '...'
            : `${services.filter(s => s.status === 'UP').length}/${services.length}`}
        </p>

        <p>
          Avg Response Time:{' '}
          {servicesLoading
            ? '...'
            : `${(
                services.reduce(
                  (sum, s) => sum + s.responseTime,
                  0
                ) / (services.length || 1)
              ).toFixed(0)} ms`}
        </p>

        <p>Last Refresh: Just now</p>
      </div>

    </div>
  );
}