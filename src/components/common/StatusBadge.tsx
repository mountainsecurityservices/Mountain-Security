import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  ShieldCheck,
  Clock,
  Lock,
} from 'lucide-react';
import { UserStatus, RoleStatus, NotificationType } from '../../types';

interface StatusBadgeProps {
  status: UserStatus | RoleStatus | NotificationType | 'system' | 'custom' | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const normStatus = String(status).toLowerCase();

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  let config = {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <Clock className="w-3.5 h-3.5" />,
    label: normStatus.toUpperCase(),
  };

  switch (normStatus) {
    case 'active':
    case 'success':
      config = {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        label: 'ACTIVE',
      };
      break;

    case 'inactive':
      config = {
        bg: 'bg-slate-100 text-slate-600 border-slate-300 ring-slate-400/10',
        icon: <XCircle className="w-3.5 h-3.5 text-slate-500" />,
        label: 'INACTIVE',
      };
      break;

    case 'suspended':
    case 'critical':
    case 'error':
      config = {
        bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/10 font-semibold',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
        label: normStatus === 'suspended' ? 'SUSPENDED' : normStatus.toUpperCase(),
      };
      break;

    case 'warning':
    case 'under_review':
      config = {
        bg: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/10',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        label: normStatus === 'under_review' ? 'UNDER REVIEW' : 'WARNING',
      };
      break;

    case 'info':
      config = {
        bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/10',
        icon: <Shield className="w-3.5 h-3.5 text-blue-600" />,
        label: 'INFO',
      };
      break;

    case 'system':
    case 'super_admin':
      config = {
        bg: 'bg-navy-900 bg-slate-900 text-slate-100 border-slate-800 ring-slate-900/20 font-bold',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-red-400" />,
        label: normStatus === 'super_admin' ? 'SUPER ADMIN' : 'SYSTEM PROTECTED',
      };
      break;

    case 'custom':
      config = {
        bg: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10',
        icon: <Lock className="w-3.5 h-3.5 text-purple-600" />,
        label: 'CUSTOM ROLE',
      };
      break;

    default:
      config = {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
        label: String(status).toUpperCase(),
      };
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ring-1 ${config.bg} ${sizeClasses} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
