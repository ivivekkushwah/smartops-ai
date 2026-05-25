'use client';

import { AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AuthErrorHandlerProps {
  error?: string | null;
  onDismiss?: () => void;
  autoClose?: boolean;
  duration?: number;
}

/**
 * Error display component for authentication errors
 * Shows styled error messages with auto-dismiss capability
 */
export function AuthErrorHandler({
  error,
  onDismiss,
  autoClose = true,
  duration = 5000,
}: AuthErrorHandlerProps) {
  const [isVisible, setIsVisible] = useState(!!error);

  useEffect(() => {
    setIsVisible(!!error);

    if (error && autoClose) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [error, autoClose, duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || !error) {
    return null;
  }

  return (
    <div
      className="fixed top-4 right-4 max-w-md rounded-lg border p-4 flex items-start gap-3 shadow-lg animate-in slide-in-from-top"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
      }}
    >
      <AlertCircle
        size={20}
        className="flex-shrink-0 mt-0.5"
        style={{ color: 'var(--red2)' }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red2">Error</p>
        <p className="text-sm text-red-200 mt-0.5 break-words">{error}</p>
      </div>

      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded hover:bg-red/10 transition-colors"
      >
        <X size={16} style={{ color: 'var(--red2)' }} />
      </button>
    </div>
  );
}

/**
 * Success message component
 */
export function AuthSuccessHandler({
  message,
  onDismiss,
  autoClose = true,
  duration = 3000,
}: Omit<AuthErrorHandlerProps, 'error'> & { message?: string }) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    setIsVisible(!!message);

    if (message && autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, autoClose, duration, onDismiss]);

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div
      className="fixed top-4 right-4 max-w-md rounded-lg border p-4 flex items-start gap-3 shadow-lg animate-in slide-in-from-top"
      style={{
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
      }}
    >
      <div
        className="flex-shrink-0 w-5 h-5 rounded-full mt-0.5 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--green2)' }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-green2">Success</p>
        <p className="text-sm text-green-200 mt-0.5 break-words">{message}</p>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 p-1 rounded hover:bg-green/10 transition-colors"
      >
        <X size={16} style={{ color: 'var(--green2)' }} />
      </button>
    </div>
  );
}
