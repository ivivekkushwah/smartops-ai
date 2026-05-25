'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled,
  autoComplete,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium" style={{ color: 'var(--text1)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full px-4 py-2.5 rounded-lg border bg-opacity-50 transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'rgba(12, 18, 37, 0.8)',
            borderColor: error ? 'rgba(239, 68, 68, 0.5)' : 'var(--border)',
            color: 'var(--text1)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'rgba(239, 68, 68, 0.7)' : 'var(--blue)';
            e.currentTarget.style.backgroundColor = 'rgba(12, 18, 37, 1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'rgba(239, 68, 68, 0.5)' : 'var(--border)';
            e.currentTarget.style.backgroundColor = 'rgba(12, 18, 37, 0.8)';
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text2 hover:text-text1 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs font-medium" style={{ color: 'var(--red2)' }}>{error}</p>}
    </div>
  );
}
