'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FormInput } from '@/components/auth/form-input';
import { ArrowRight, Loader } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
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
      await register(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
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
          <h1 className="text-3xl font-bold text-text1 mb-2">Create Account</h1>
          <p className="text-sm text-text2">Join SmartOps AI today</p>
        </div>

        {/* Card */}
        <div className="p-6 rounded-2xl border backdrop-blur-xl" style={{
          backgroundColor: 'rgba(16, 24, 48, 0.4)',
          borderColor: 'var(--border)',
        }}>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Name */}
            <FormInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={setName}
              error={errors.name}
              disabled={loading}
            />

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
              autoComplete="new-password"
              disabled={loading}
            />

            {/* Confirm Password */}
            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={errors.confirmPassword}
              autoComplete="new-password"
              disabled={loading}
            />

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 mt-0.5 rounded border transition-colors"
                style={{
                  backgroundColor: agreeToTerms ? 'var(--blue)' : 'transparent',
                  borderColor: errors.terms ? 'rgba(239, 68, 68, 0.5)' : 'var(--border)',
                  accentColor: 'var(--blue)',
                }}
              />
              <span className="text-xs text-text2">
                I agree to the{' '}
                <Link href="#" className="font-medium" style={{ color: 'var(--blue2)' }}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="#" className="font-medium" style={{ color: 'var(--blue2)' }}>
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && <p className="text-xs font-medium" style={{ color: 'var(--red2)' }}>{errors.terms}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6"
              style={{
                backgroundColor: 'var(--blue)',
                color: 'white',
              }}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-xs text-text2">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold transition-colors"
                style={{ color: 'var(--blue2)' }}
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
