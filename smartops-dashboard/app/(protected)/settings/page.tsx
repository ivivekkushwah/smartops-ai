'use client';

import { motion } from 'framer-motion';
import { Settings, Save, Copy } from 'lucide-react';
import { SectionHeader } from '@/components/shared/section-header';
import { useState } from 'react';

export default function SettingsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SectionHeader
          title="System Settings"
          subtitle="Configure monitoring and alerting preferences"
          icon={<Settings className="w-4 h-4" />}
        />
      </motion.div>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="surface-card surface-hover p-4"
      >
        <h3 className="text-sm font-semibold text-text1 mb-4">Profile Settings</h3>
        <div className="space-y-3">
          <div>
            <label className="text-2xs text-text3 block mb-1">Full Name</label>
            <input
              type="text"
              defaultValue="Operations Admin"
              className="w-full px-3 py-2 rounded-lg border text-xs text-text1 bg-transparent"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="text-2xs text-text3 block mb-1">Email</label>
            <input
              type="email"
              defaultValue="admin@smartops.local"
              className="w-full px-3 py-2 rounded-lg border text-xs text-text1 bg-transparent"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="text-2xs text-text3 block mb-1">Organization</label>
            <input
              type="text"
              defaultValue="SmartOps Enterprise"
              className="w-full px-3 py-2 rounded-lg border text-xs text-text1 bg-transparent"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Monitoring Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="surface-card surface-hover p-4"
      >
        <h3 className="text-sm font-semibold text-text1 mb-4">Monitoring Preferences</h3>
        <div className="space-y-3">
          {[
            { label: 'Alert Threshold', value: '75%' },
            { label: 'Log Retention', value: '30 days' },
            { label: 'Metric Sample Interval', value: '60 seconds' },
            { label: 'Dashboard Refresh Rate', value: '5 seconds' },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
            }}>
              <span className="text-xs text-text2">{setting.label}</span>
              <select className="px-2 py-1 rounded-md text-2xs border text-text1 bg-transparent" style={{
                borderColor: 'var(--border)',
              }}>
                <option>{setting.value}</option>
              </select>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Alert Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="surface-card surface-hover p-4"
      >
        <h3 className="text-sm font-semibold text-text1 mb-4">Alert Channels</h3>
        <div className="space-y-2">
          {[
            { name: 'Email Notifications', enabled: true },
            { name: 'Slack Integration', enabled: true },
            { name: 'PagerDuty Sync', enabled: false },
            { name: 'SMS Alerts', enabled: false },
          ].map((channel, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
            >
              <span className="text-xs text-text2">{channel.name}</span>
              <div
                className="w-10 h-6 rounded-full relative cursor-pointer transition-all"
                style={{
                  backgroundColor: channel.enabled ? 'var(--green)' : 'var(--bg3)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
                  style={{
                    left: channel.enabled ? '18px' : '2px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="surface-card surface-hover p-4"
      >
        <h3 className="text-sm font-semibold text-text1 mb-4">API Configuration</h3>
        <div className="space-y-3">
          <div>
            <label className="text-2xs text-text3 block mb-2">API Endpoint</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="https://api.smartops.local/v1"
                className="flex-1 px-3 py-2 rounded-lg border text-xs text-text2 bg-transparent"
                style={{ borderColor: 'var(--border)' }}
              />
              <button
                onClick={() => copyToClipboard('https://api.smartops.local/v1', 'endpoint')}
                className="px-3 py-2 rounded-lg border transition-all flex items-center gap-1.5"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: copied === 'endpoint' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: copied === 'endpoint' ? 'var(--green2)' : 'var(--text2)',
                }}
              >
                <Copy className="w-3 h-3" />
                <span className="text-2xs">{copied === 'endpoint' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <div>
            <label className="text-2xs text-text3 block mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                readOnly
                value="sk-1234567890abcdefghijk"
                className="flex-1 px-3 py-2 rounded-lg border text-xs text-text2 bg-transparent"
                style={{ borderColor: 'var(--border)' }}
              />
              <button
                onClick={() => copyToClipboard('sk-1234567890abcdefghijk', 'apikey')}
                className="px-3 py-2 rounded-lg border transition-all flex items-center gap-1.5"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: copied === 'apikey' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: copied === 'apikey' ? 'var(--green2)' : 'var(--text2)',
                }}
              >
                <Copy className="w-3 h-3" />
                <span className="text-2xs">{copied === 'apikey' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="surface-card surface-hover p-4"
      >
        <h3 className="text-sm font-semibold text-text1 mb-4">System Information</h3>
        <div className="grid grid-cols-2 gap-3 text-2xs">
          {[
            { label: 'Platform Version', value: '1.0.0' },
            { label: 'Last Updated', value: '2024-05-09' },
            { label: 'License', value: 'Enterprise' },
            { label: 'Support Tier', value: 'Premium' },
            { label: 'Database', value: 'PostgreSQL 15' },
            { label: 'Cache Layer', value: 'Redis 7.0' },
          ].map((info, i) => (
            <div key={i} className="flex flex-col">
              <span style={{ color: 'var(--text3)' }} className="mb-0.5">{info.label}</span>
              <span className="text-text1 font-semibold">{info.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.35 }}
        className="flex gap-2"
      >
        <button
          className="px-4 py-2 rounded-lg border font-semibold text-xs flex items-center gap-2 transition-all"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            color: 'var(--blue2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
          }}
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
        <button
          className="px-4 py-2 rounded-lg border font-semibold text-xs transition-all"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'var(--border)',
            color: 'var(--text2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
          }}
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
