'use client';

import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'red' | 'purple';
  icon?: ReactNode;
}

const badgeColors = {
  blue: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.25)' },
  green: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.25)' },
  red: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.25)' },
  purple: { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa', border: 'rgba(139, 92, 246, 0.25)' },
};

export function SectionHeader({
  title,
  subtitle,
  badge,
  badgeColor = 'blue',
  icon,
}: SectionHeaderProps) {
  const colors = badgeColors[badgeColor];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-base">{icon}</div>}
          <h2 className="text-sm font-semibold text-text1">{title}</h2>
          {subtitle && <p className="text-2xs text-text3 ml-2">{subtitle}</p>}
        </div>
        {badge && (
          <span
            className="text-2xs px-1.75 py-0.5 rounded-full font-mono font-medium border"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              borderColor: colors.border,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 h-px bg-border mt-2.5" />
    </div>
  );
}
