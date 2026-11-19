import React from 'react';
import { AlertSeverity } from '../types';
import { Info, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

interface AlertBadgeProps {
  severity: AlertSeverity;
  size?: 'sm' | 'md';
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ severity, size = 'md' }) => {
  const norm = String(severity).toUpperCase();

  let label = 'INFO';
  let bg = 'bg-blue-50';
  let text = 'text-blue-700';
  let border = 'border-blue-200';
  let Icon = Info;

  if (norm === 'CRÍTICO' || norm === 'CRITICO') {
    label = 'CRÍTICO';
    bg = 'bg-red-50';
    text = 'text-red-700';
    border = 'border-red-300';
    Icon = AlertOctagon;
  } else if (norm === 'ALERTA' || norm === 'HIGH') {
    label = 'ALERTA';
    bg = 'bg-amber-50';
    text = 'text-amber-800';
    border = 'border-amber-300';
    Icon = AlertCircle;
  } else if (norm === 'ATENÇÃO' || norm === 'ATENCAO' || norm === 'MEDIUM') {
    label = 'ATENÇÃO';
    bg = 'bg-yellow-50';
    text = 'text-yellow-800';
    border = 'border-yellow-300';
    Icon = AlertTriangle;
  } else {
    // INFO or LOW
    label = 'INFO';
    bg = 'bg-slate-100';
    text = 'text-slate-700';
    border = 'border-slate-200';
    Icon = Info;
  }

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-semibold rounded-lg border ${bg} ${text} ${border} ${
        isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span className="tracking-wide">{label}</span>
    </span>
  );
};
