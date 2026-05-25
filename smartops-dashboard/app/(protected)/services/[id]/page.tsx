'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/service/api'
import { ServiceStatus } from '@/service/types/service'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [service, setService] = useState<ServiceStatus | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/api/monitor/services/${id}`)
      setService(res.data)
    }
    if (id) fetch()
  }, [id])

  if (!service) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">

      <button onClick={() => router.back()}>← Back</button>

      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Service Details</h1>

        <button
          onClick={() => router.push(`/services/edit/${service.id}`)}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>
      </div>

      <div className="border p-4 space-y-3">
        <p><b>Name:</b> {service.serviceName}</p>
        <p><b>URL:</b> {service.baseUrl}</p>
        <p><b>Status:</b> {service.status}</p>
        <p><b>Response:</b> {service.responseTime} ms</p>
      </div>

    </div>
  )
}