'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

const PROTECTED_ROUTES = ['/dashboard', '/logs', '/services', '/alerts', '/analytics', '/ai-insights', '/settings'];

export function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Check if current route is a protected route (show sidebar and navbar)
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    // For auth pages, just show children without layout
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg0)' }}>
      <Navbar />
      <div className="flex pt-13">
        <Sidebar />
        <main className="flex-1 ml-45 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
