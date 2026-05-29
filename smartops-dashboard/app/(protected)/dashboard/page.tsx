'use client'

import { useDashboard } from '@/hooks/use-dashboard'
import { useServices } from '@/hooks/use-services'

export default function DashboardPage() {

  const { metrics, loading, error } =
  useDashboard()

const {
  services,
  loading: servicesLoading,
} = useServices()

  // ================= REAL CHART DATA =================

  const chartData = services.map(
    (s) => (s.responseTime > 0 ? s.responseTime : 0)
  )

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#020817] text-white p-6">

        <div className="animate-pulse space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            {[1, 2, 3, 4].map((item) => (

              <div
                key={item}
                className="h-32 rounded-2xl bg-[#071226]"
              />

            ))}

          </div>

          <div className="h-96 rounded-2xl bg-[#071226]" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="h-40 rounded-2xl bg-[#071226]"
              />

            ))}

          </div>

        </div>

      </div>
    )
  }

  // ================= ERROR =================

  if (error) {

    return (

      <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">

        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">

          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Dashboard Error
          </h2>

          <p className="text-slate-300">
            Failed to load monitoring data
          </p>

        </div>

      </div>
    )
  }

  // ================= METRICS =================

  const onlineServices =
    services.filter((s) => s.status === 'UP').length

  const avgResponseTime =
    services
      .filter((s) => s.responseTime > 0)
      .reduce((sum, s) => sum + s.responseTime, 0) /
    (services.filter((s) => s.responseTime > 0).length || 1)

  return (

    <div className="min-h-screen bg-[#020817] text-white p-6 space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            SmartOps Dashboard
          </h1>

          <p className="text-slate-400 mt-1">
            Real-time distributed system monitoring
          </p>

        </div>

        <div className="flex items-center gap-3">

          <div className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm">
            ● Live Monitoring
          </div>

        </div>

      </div>

      {/* ================= TOP METRICS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* TOTAL LOGS */}

        <div className="rounded-2xl border border-slate-800 bg-[#071226] p-5 shadow-lg hover:border-blue-500/40 transition-all duration-300">

          <p className="text-sm text-slate-400">
            Total Logs
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {metrics?.totalLogs ?? 0}
          </h2>

        </div>

        {/* SYSTEM HEALTH */}

        <div className="rounded-2xl border border-slate-800 bg-[#071226] p-5 shadow-lg hover:border-green-500/40 transition-all duration-300">

          <p className="text-sm text-slate-400">
            System Health
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-400">

            {metrics?.totalLogs
              ? (
                  (metrics.activeServices /
                    metrics.totalLogs) *
                  100
                ).toFixed(0)
              : 0}

            %

          </h2>

        </div>

        {/* API REQUESTS */}

        <div className="rounded-2xl border border-slate-800 bg-[#071226] p-5 shadow-lg hover:border-cyan-500/40 transition-all duration-300">

          <p className="text-sm text-slate-400">
            API Requests
          </p>

          <h2 className="mt-3 text-3xl font-bold text-cyan-400">

            {metrics?.requestThroughput?.toFixed(0) ??
              0}

          </h2>

        </div>

        {/* SERVICES ONLINE */}

        <div className="rounded-2xl border border-slate-800 bg-[#071226] p-5 shadow-lg hover:border-purple-500/40 transition-all duration-300">

          <p className="text-sm text-slate-400">
            Services Online
          </p>

          <h2 className="mt-3 text-3xl font-bold text-purple-400">

            {servicesLoading
              ? '...'
              : `${onlineServices}/${services.length}`}

          </h2>

        </div>

      </div>

      {/* ================= RESPONSE TIME CHART ================= */}

      <div className="rounded-2xl border border-slate-800 bg-[#071226] p-6 shadow-lg">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h3 className="text-lg font-semibold text-white">
              Response Time Metrics
            </h3>

            <p className="text-sm text-slate-400">
              Live service latency monitoring
            </p>

          </div>

          <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
            Live
          </div>

        </div>

        {chartData.length === 0 ? (

          <div className="h-64 flex items-center justify-center text-slate-500">
            No metrics available
          </div>

        ) : (

          <div className="flex items-end gap-3 h-64">

            {chartData.map((value, index) => (

              <div
                key={index}
                className="flex-1 bg-linear-to-t from-blue-600 to-cyan-400 rounded-t-xl hover:opacity-80 transition-all duration-300"
                style={{
                  height: `${Math.min(value * 2, 220)}px`,
                }}
                title={`${value} ms`}
              />

            ))}

          </div>

        )}

      </div>

      {/* ================= SYSTEM RESOURCES ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* CPU */}

        <div className="rounded-2xl border border-slate-800 bg-[#071226] p-6 shadow-lg">

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-sm text-slate-400">
              CPU Usage
            </h3>

            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

          </div>

          <h2 className="text-4xl font-bold text-white">

            {metrics?.cpuMetric?.toFixed(1) ?? 0}%

          </h2>

        </div>

        {/* MEMORY */}

        <div className="rounded-2xl border border-slate-800 bg-[#071226] p-6 shadow-lg">

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-sm text-slate-400">
              Memory Usage
            </h3>

            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />

          </div>

          <h2 className="text-4xl font-bold text-white">

            {metrics?.memoryMetric?.toFixed(1) ?? 0}

            <span className="text-lg ml-1 text-slate-400">
              MB
            </span>

          </h2>

        </div>

        {/* ERROR RATE */}

        <div className="rounded-2xl border border-slate-800 bg-[#071226] p-6 shadow-lg">

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-sm text-slate-400">
              Error Rate
            </h3>

            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />

          </div>

          <h2 className="text-4xl font-bold text-white">

            {metrics?.errorRate?.toFixed(1) ?? 0}%

          </h2>

        </div>

      </div>

      {/* ================= SERVICE STATUS ================= */}

      <div className="rounded-2xl border border-slate-800 bg-[#071226] p-6 shadow-lg">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h3 className="text-lg font-semibold text-white">
              Service Status
            </h3>

            <p className="text-sm text-slate-400">
              Real-time monitored services
            </p>

          </div>

          <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20">

            {onlineServices} Active

          </div>

        </div>

        {servicesLoading ? (

          <div className="space-y-3">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="h-20 rounded-xl bg-[#0b172c] animate-pulse"
              />

            ))}

          </div>

        ) : services.length === 0 ? (

          <div className="text-center py-16 text-slate-500">

            No services added

          </div>

        ) : (

          <div className="space-y-4">

            {services.map((svc) => (

              <div
                key={svc.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0b172c] p-4 hover:border-blue-500/30 transition-all duration-300"
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      svc.status === 'UP'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />

                  <div>

                    <h4 className="font-medium text-white">
                      {svc.serviceName}
                    </h4>

                    <p className="text-sm text-slate-400">

                      {svc.status === 'UP'
                        ? 'Operational'
                        : 'Service Down'}

                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-lg font-semibold text-white">

                    {svc.responseTime > 0
                      ? `${svc.responseTime} ms`
                      : 'DOWN'}

                  </p>

                  <p className="text-xs text-slate-500">
                    Response Time
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================= HEALTH SUMMARY ================= */}

      <div className="rounded-2xl border border-slate-800 bg-[#071226] p-6 shadow-lg">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h3 className="text-lg font-semibold text-white">
              Health Summary
            </h3>

            <p className="text-sm text-slate-400">
              Overall system performance overview
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>

            <p className="text-sm text-slate-400">
              Services Online
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-400">

              {servicesLoading
                ? '...'
                : `${onlineServices}/${services.length}`}

            </h2>

          </div>

          <div>

            <p className="text-sm text-slate-400">
              Avg Response Time
            </p>

            <h2 className="mt-2 text-2xl font-bold text-cyan-400">

              {avgResponseTime.toFixed(0)} ms

            </h2>

          </div>

          <div>

            <p className="text-sm text-slate-400">
              Last Refresh
            </p>

            <h2 className="mt-2 text-2xl font-bold text-purple-400">
              Just Now
            </h2>

          </div>

        </div>

      </div>

    </div>
  )
}