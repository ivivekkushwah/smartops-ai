'use client';

import { LayoutDashboard, FileText, Server, AlertCircle, BarChart3, Sparkles, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FileText, label: 'Live Logs' },
  { icon: Server, label: 'Services' },
  { icon: AlertCircle, label: 'Alerts' },
];

const analysisItems = [
  { icon: BarChart3, label: 'Analytics' },
  { icon: Sparkles, label: 'AI Insights' },
];

const systemItems = [
  { icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto z-40"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <h1 className="text-lg font-bold text-sidebar-foreground">SmartOps</h1>
        </div>

        {/* Main Menu */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Main</p>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <motion.a
                key={item.label}
                href="#"
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.a>
            ))}
          </nav>
        </div>

        {/* Analysis Section */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Analysis</p>
          <nav className="space-y-2">
            {analysisItems.map((item) => (
              <motion.a
                key={item.label}
                href="#"
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition-all"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.a>
            ))}
          </nav>
        </div>

        {/* System Section */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">System</p>
          <nav className="space-y-2">
            {systemItems.map((item) => (
              <motion.a
                key={item.label}
                href="#"
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition-all"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.a>
            ))}
          </nav>
        </div>
      </div>
    </motion.aside>
  );
}
