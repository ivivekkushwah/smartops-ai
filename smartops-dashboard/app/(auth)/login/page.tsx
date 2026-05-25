'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FormInput } from '@/components/auth/form-input';
import { ArrowRight, Loader } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-text1 mb-2">Welcome Back</h1>
          <p className="text-sm text-text2">Sign in to your account to continue</p>
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

            {/* Password */}
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              error={errors.password}
              autoComplete="current-password"
              disabled={loading}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium transition-colors"
                style={{ color: 'var(--blue2)' }}
              >
                Forgot password?
              </Link>
            </div>

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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-xs text-text2">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold transition-colors"
                style={{ color: 'var(--blue2)' }}
              >
                Create one
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text3 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
