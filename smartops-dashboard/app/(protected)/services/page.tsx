'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/service/api'
import { ServiceStatus } from '@/service/types/service'

export default function ServicesPage() {

  const router = useRouter()

  const [services, setServices] =
    useState<ServiceStatus[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  // ================= FETCH SERVICES =================

  const fetchServices = async () => {

    try {

      const res = await api.get(
        '/api/monitor/services'
      )

      setServices(res.data)

      setError('')

    } catch (err: any) {

      console.error(err)

      if (err.response?.status === 401) {

        router.push('/login')

      } else {

        setError(
          'Failed to fetch services'
        )
      }

    } finally {

      setLoading(false)
    }
  }

  // ================= DELETE =================

  const handleDelete = async (
    id: string
  ) => {

    const confirmDelete = confirm(
      'Delete this service?'
    )

    if (!confirmDelete) return

    try {

      await api.delete(
        `/api/monitor/services/${id}`
      )

      setServices((prev) =>
        prev.filter((s) => s.id !== id)
      )

    } catch (err) {

      console.error(err)

      alert('Failed to delete service')
    }
  }

  // ================= EFFECT =================

  useEffect(() => {

    fetchServices()

    const interval = setInterval(() => {

      if (
        document.visibilityState ===
        'visible'
      ) {
        fetchServices()
      }

    }, 5000)

    return () => clearInterval(interval)

  }, [])

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#020817] text-white p-6">

        <div className="animate-pulse">

          <div className="flex justify-between items-center mb-8">

            <div className="h-10 w-60 bg-[#071226] rounded-xl" />

            <div className="h-12 w-40 bg-[#071226] rounded-xl" />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="h-64 rounded-2xl bg-[#071226]"
              />

            ))}

          </div>

        </div>

      </div>
    )
  }

  return (

    <div className="min-h-screen bg-[#020817] text-white p-6 space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-4xl font-bold tracking-tight">
            Service Monitoring
          </h1>

          <p className="text-slate-400 mt-2">
            Real-time monitored distributed services
          </p>

        </div>

        <button
          onClick={() =>
            router.push('/services/add')
          }
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20"
        >
          + Add Service
        </button>

      </div>

      {/* ================= ERROR ================= */}

      {error && (

        <div className="border border-red-500/30 bg-red-500/10 text-red-400 p-4 rounded-2xl">

          {error}

        </div>

      )}

      {/* ================= EMPTY ================= */}

      {!services.length ? (

        <div className="border border-slate-800 bg-[#071226] rounded-2xl p-16 text-center">

          <h2 className="text-2xl font-semibold text-white mb-2">
            No Services Added
          </h2>

          <p className="text-slate-400 mb-6">
            Start monitoring your microservices
          </p>

          <button
            onClick={() =>
              router.push('/services/add')
            }
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-6 py-3 rounded-xl font-medium"
          >
            Add Your First Service
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {services.map((service) => {

            const isUp =
              service.status === 'UP'

            return (

              <div
  key={service.id}
  className="
    group
    relative
    overflow-hidden
    rounded-3xl
    border
    border-slate-800
    bg-[#071226]
    p-5
    hover:border-blue-500/40
    hover:-translate-y-1
    hover:shadow-xl
    hover:shadow-blue-500/10
    transition-all
    duration-300
  "
>
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

  <div className="relative flex items-start justify-between gap-4">

    <div className="flex-1 min-w-0">

      <div className="flex items-center gap-2 mb-2">

        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isUp
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        />

        <h2 className="text-lg font-semibold text-white truncate">
          {service.serviceName}
        </h2>

      </div>

      <p className="text-xs text-slate-500 truncate">
        {service.baseUrl}
      </p>

    </div>

    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isUp
          ? 'bg-green-500/15 text-green-400'
          : 'bg-red-500/15 text-red-400'
      }`}
    >
      {isUp ? 'Running' : 'Down'}
    </span>

  </div>

  <div className="flex gap-3 mt-5">

    <button
      onClick={() =>
        router.push(`/services/${service.id}`)
      }
      className="
        flex-1
        bg-blue-600
        hover:bg-blue-700
        py-2.5
        rounded-xl
        font-medium
        transition-all
      "
    >
      View Details
    </button>

    <button
      onClick={() =>
        handleDelete(service.id)
      }
      className="
        px-4
        py-2.5
        rounded-xl
        border
        border-red-500/20
        text-red-400
        hover:bg-red-500/10
        transition-all
      "
    >
      Delete
    </button>

  </div>

</div>
            )
          })}

        </div>

      )}

    </div>
  )
}