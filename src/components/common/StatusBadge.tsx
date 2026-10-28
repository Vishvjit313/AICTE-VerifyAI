import React from 'react';
import { VerificationStatus } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  const configs = {
    'PASS': {
      label: 'PASS',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
      icon: CheckCircle2,
    },
    'WARNING': {
      label: 'WARNING',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300',
      icon: AlertTriangle,
    },
    'FAILED CHECK': {
      label: 'FAILED CHECK',
      bgClass: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300',
      icon: XCircle,
    },
    'NOT CHECKED': {
      label: 'NOT CHECKED',
      bgClass: 'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700/50 text-slate-700 dark:text-slate-400',
      icon: HelpCircle,
    },
  };

  const current = configs[status] || configs['NOT CHECKED'];
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  return (
    <span 
      className={`inline-flex items-center font-medium tracking-wide border rounded-md transition-colors ${current.bgClass} ${sizeClasses} whitespace-nowrap shadow-xs`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{current.label}</span>
    </span>
  );
};
