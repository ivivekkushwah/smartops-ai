'use client';

import { Search, Bell, Settings, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export function SearchBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4 bg-muted/40 rounded-lg px-4 py-3 border border-border"
    >
      <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <input
        type="text"
        placeholder="Search services, logs, metrics..."
        className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
      />
      
      <div className="flex items-center gap-3 ml-auto pl-4 border-l border-border">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-md text-xs font-semibold hover:bg-green-500/30 transition-colors border border-green-500/30"
        >
          <Radio className="h-3 w-3" />
          Live
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
        >
          <Bell className="h-5 w-5 text-foreground" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
        >
          <Settings className="h-5 w-5 text-foreground" />
        </motion.button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground">
          OP
        </div>
      </div>
    </motion.div>
  );
}
