'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg0)' }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div
              className="w-8 h-8 border-3 rounded-full"
              style={{
                borderColor: 'var(--border)',
                borderTopColor: 'var(--blue)',
              }}
            />
          </div>
          <p className="mt-4 text-sm text-text2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
