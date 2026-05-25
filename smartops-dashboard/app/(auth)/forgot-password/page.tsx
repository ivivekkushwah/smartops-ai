'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { FormInput } from '@/components/auth/form-input';
import { ArrowRight, Loader, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg0)' }}>
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5" style={{
            background: 'radial-gradient(circle, var(--green), transparent)',
          }} />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full opacity-5" style={{
            background: 'radial-gradient(circle, var(--cyan), transparent)',
          }} />
        </div>

        <div className="w-full max-w-md relative z-10 text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle size={64} style={{ color: 'var(--green2)' }} />
          </div>
          <h1 className="text-3xl font-bold text-text1 mb-3">Check Your Email</h1>
          <p className="text-text2 mb-6">
            We&apos;ve sent a password reset link to <span className="font-semibold text-text1">{email}</span>
          </p>
          <p className="text-sm text-text3 mb-8">
            Click the link in the email to reset your password. The link expires in 24 hours.
          </p>

          <div className="space-y-3">
            <p className="text-xs text-text3">Didn&apos;t receive the email?</p>
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="w-full py-2.5 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--blue2)',
                border: '1px solid',
                borderColor: 'var(--border)',
              }}
            >
              Try Another Email
            </button>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-lg font-semibold block transition-all"
              style={{
                backgroundColor: 'var(--blue)',
                color: 'white',
              }}
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg0)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5" style={{
          background: 'radial-gradient(circle, var(--blue), transparent)',
        }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full opacity-5" style={{
          background: 'radial-gradient(circle, var(--cyan), transparent)',
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue to-purple flex items-center justify-center text-lg font-bold text-white">
              ⚡
            </div>
            <span className="text-lg font-bold text-text1">Smart<span style={{ color: 'var(--blue2)' }}>Ops</span> AI</span>
          </Link>
          <h1 className="text-3xl font-bold text-text1 mb-2">Reset Password</h1>
          <p className="text-sm text-text2">Enter your email address and we&apos;ll send you a link to reset your password</p>
        </div>

        {/* Card */}
        <div className="p-6 rounded-2xl border backdrop-blur-xl" style={{
          backgroundColor: 'rgba(16, 24, 48, 0.4)',
          borderColor: 'var(--border)',
        }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg text-sm font-medium" style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--red2)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                border: '1px solid',
              }}>
                {error}
              </div>
            )}

            {/* Email */}
            <FormInput
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
              autoComplete="email"
              disabled={loading}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                backgroundColor: 'var(--blue)',
                color: 'white',
              }}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Back to Login */}
            <p className="text-center text-xs text-text2">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-semibold transition-colors"
                style={{ color: 'var(--blue2)' }}
              >
                Sign in instead
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
