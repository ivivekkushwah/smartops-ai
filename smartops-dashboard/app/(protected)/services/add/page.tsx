'use client';

import { useState } from 'react';
import api from '@/service/api';

export default function AddServicePage() {
  const [form, setForm] = useState({
    serviceName: '',
    baseUrl: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/monitor/services', {
        serviceName: form.serviceName,
        baseUrl: form.baseUrl,
      });

      alert('Service added successfully');

      setForm({
        serviceName: '',
        baseUrl: '',
      });

    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 401) {
        alert('Please login first');
      } else {
        alert(err.response?.data?.message || 'Failed to add service');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Add Service to Monitor
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Service Name"
          value={form.serviceName}
          onChange={(e) =>
            setForm({ ...form, serviceName: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Base URL (http://localhost:8081)"
          value={form.baseUrl}
          onChange={(e) =>
            setForm({ ...form, baseUrl: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? 'Adding...' : 'Add Service'}
        </button>

      </form>
    </div>
  );
}