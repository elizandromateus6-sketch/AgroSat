import React from 'react';
import { Alert } from '../types';
import { AlertTriangle, Droplets, CloudRain, Bug, CheckCircle2 } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onMarkRead?: (id: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onMarkRead }) => {
  const getSeverityStyle = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-rose-50 border-rose-200 text-rose-900';
      case 'medium':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'low':
      default:
        return 'bg-sky-50 border-sky-200 text-sky-900';
    }
  };

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'water_stress':
        return <Droplets className="w-5 h-5 text-amber-600" />;
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'pest_risk':
        return <Bug className="w-5 h-5 text-rose-600" />;
      case 'ndvi_drop':
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${getSeverityStyle(
        alert.severity
      )} ${alert.read ? 'opacity-75 bg-[#F0F2EB] border-[#E0E2D9] text-[#6B705C]' : 'shadow-sm'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-white shadow-sm border border-[#E0E2D9] shrink-0">
            {getIcon(alert.type)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-white border border-[#E0E2D9] text-[#1E291B]">
                {alert.farmName}
              </span>
              <span className="text-[10px] text-[#6B705C]">{alert.date}</span>
            </div>
            <h4 className="font-bold text-sm mt-1">{alert.title}</h4>
            <p className="text-xs mt-1 leading-relaxed">{alert.message}</p>

            {alert.recommendation && (
              <div className="mt-2.5 p-2.5 bg-white/90 rounded-xl border border-[#E0E2D9] text-xs text-[#2D3628]">
                <strong className="text-[#4B6344]">💡 Recomendações AgroSat:</strong>{' '}
                {alert.recommendation}
              </div>
            )}
          </div>
        </div>

        {!alert.read && onMarkRead && (
          <button
            onClick={() => onMarkRead(alert.id)}
            className="p-1.5 rounded-lg bg-white border border-[#E0E2D9] text-[#6B705C] hover:text-[#4B6344] hover:bg-[#F0F2EB] transition-colors shrink-0"
            title="Marcar como lido"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
