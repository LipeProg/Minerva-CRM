import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'secondary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const variantStyles = {
    primary: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    danger: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    secondary: 'bg-slate-100 text-slate-700 ring-slate-600/20',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
