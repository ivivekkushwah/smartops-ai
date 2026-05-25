'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/service/api'
import { ServiceStatus } from '@/service/types/service'

export default function ServicesPage() {
  const router = useRouter()

  const [services, setServices] = useState<ServiceStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchServices = async () => {
    try {
      const res = await api.get('/api/monitor/services')
      setServices(res.data)
      setError('')
    } catch (err: any) {
      console.error(err)

      if (err.response?.status === 401) {
        router.push('/login')
      } else {
        setError('Failed to fetch services ❌')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this service?')

    if (!confirmDelete) return

    try {
      await api.delete(`/api/monitor/services/${id}`)

      // 🔥 Update UI instantly
      setServices((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete service ❌')
    }
  }

  useEffect(() => {
    fetchServices()

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchServices()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // 🔄 Loading
  if (loading) {
    return <p className="p-6">Loading services...</p>
  }

  return (
    <div className="p-6">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Services</h1>

        <button
          onClick={() => router.push('/services/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Service
        </button>
      </div>

      {/* ❌ Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 🟡 Empty */}
      {!services.length ? (
        <p>No services added yet</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">

          {services.map((service) => (
            <div
              key={service.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >

              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">
                  {service.serviceName}
                </h2>

                <span
                  className={`px-2 py-1 text-sm rounded ${
                    service.status === 'UP'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {service.status}
                </span>
              </div>

              {/* URL */}
              <p className="text-sm mt-2 text-gray-500">
                {service.baseUrl}
              </p>

              {/* Metrics */}
              <div className="mt-3 text-sm space-y-1">
                <p>Response: <b>{service.responseTime} ms</b></p>
                <p>
                  Last Checked:{' '}
                  <b>
                    {service.lastChecked
                      ? new Date(service.lastChecked).toLocaleString()
                      : 'N/A'}
                  </b>
                </p>
              </div>

              {/* 🔥 ACTIONS */}
              <div className="flex gap-2 mt-4">

                {/* VIEW */}
                <button
                  onClick={() => router.push(`/services/${service.id}`)}
                  className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
                >
                  View
                </button>

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  )
}