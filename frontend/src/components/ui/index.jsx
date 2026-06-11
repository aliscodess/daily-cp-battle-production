import React from 'react';
import { Loader2 } from 'lucide-react';

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) => {
  const base = 'btn-' + variant;
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3', lg: 'px-8 py-4 text-lg' };
  return (
    <button className={`${base} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-ink-secondary">{label}</label>}
    <input
      className={`input ${error ? 'border-rose focus:border-rose focus:ring-rose/20' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-rose">{error}</p>}
  </div>
);

// ── Badge ─────────────────────────────────────────────────────────────────────
const badgeVariants = {
  default:  'bg-surface-warm text-ink-secondary border border-border',
  brand:    'bg-brand-50 text-brand-600 border border-brand-200',
  green:    'bg-sage/15 text-sage border border-sage/30',
  red:      'bg-rose/15 text-rose border border-rose/30',
  yellow:   'bg-mustard/15 text-mustard border border-mustard/30',
  cyan:     'bg-dusty/15 text-dusty border border-dusty/30',
  purple:   'bg-apricot/15 text-brand-500 border border-apricot/30',
  orange:   'bg-apricot/20 text-brand-500 border border-apricot/40',
};

export const Badge = ({ children, variant = 'default', className = '' }) => (
  <span className={`badge ${badgeVariants[variant] || badgeVariants.default} ${className}`}>
    {children}
  </span>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return <Loader2 className={`${sizes[size]} animate-spin text-brand-500 ${className}`} />;
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const SkeletonCard = () => (
  <div className="glass p-6 space-y-3">
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

// ── Card ──────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', glow = false, ...props }) => (
  <div
    className={`glass p-6 transition-all duration-200 ${glow ? 'hover:shadow-card-md hover:border-brand-200' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-surface-warm border border-border flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-ink-faint" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-ink-primary mb-1">{title}</h3>
    {description && <p className="text-sm text-ink-secondary mb-4 max-w-xs">{description}</p>}
    {action}
  </div>
);

// ── Online indicator ──────────────────────────────────────────────────────────
export const OnlineDot = ({ online = false }) => (
  <span className="relative inline-flex">
    <span className={`w-2.5 h-2.5 rounded-full ${online ? 'bg-sage' : 'bg-border-strong'}`} />
    {online && (
      <span className="absolute inset-0 rounded-full bg-sage animate-ping opacity-60" />
    )}
  </span>
);

// ── Divider ───────────────────────────────────────────────────────────────────
export const Divider = ({ label, className = '' }) => (
  <div className={`relative flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px bg-border-light" />
    {label && <span className="text-xs text-ink-muted font-medium">{label}</span>}
    <div className="flex-1 h-px bg-border-light" />
  </div>
);
