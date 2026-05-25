'use client';

import { Bell, Settings, User, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">SmartOps</h1>
            <p className="text-xs text-muted-foreground">Enterprise Operations Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-muted-foreground">All systems operational</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </motion.button>

          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
