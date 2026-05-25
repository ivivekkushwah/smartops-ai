'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/service/api'

export default function EditServicePage() {
  const { id } = useParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/api/monitor/services/${id}`)
      setName(res.data.serviceName)
      setUrl(res.data.baseUrl)
    }
    if (id) fetch()
  }, [id])

  const update = async () => {
    await api.put(`/api/monitor/services/${id}`, {
      serviceName: name,
      baseUrl: url
    })

    alert('Updated ✅')
    router.push('/services')
  }

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-xl mb-4">Edit Service</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-3"
        placeholder="Name"
      />

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 w-full mb-3"
        placeholder="URL"
      />

      <button
        onClick={update}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        Update
      </button>

    </div>
  )
}
