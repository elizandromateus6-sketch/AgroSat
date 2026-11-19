import React from 'react';
import { Alert } from '../types';
import { AlertCard } from '../components/AlertCard';
import { farmService } from '../services/farmService';
import { Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AlertsPageProps {
  alerts: Alert[];
  onRefreshData: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts, onRefreshData }) => {
  const handleMarkAllRead = () => {
    alerts.forEach((a) => {
      if (!a.read) farmService.markAlertRead(a.id);
    });
    onRefreshData();
  };

  const handleMarkRead = (id: string) => {
    farmService.markAlertRead(id);
    onRefreshData();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">Sistema de Alertas</h1>
          </div>
          <p className="text-xs text-[#6B705C] pl-0.5">
            Notificações em tempo real sobre estresse hídrico, anomalias de NDVI e riscos na lavoura.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-sm shrink-0"
        >
          <CheckCircle2 className="w-4 h-4 text-[#8BB174]" />
          <span>Marcar Todos como Lidos</span>
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-xs">
            Nenhum alerta registrado até o momento. Suas lavouras estão operando normalmente.
          </div>
        ) : (
          alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onMarkRead={handleMarkRead} />
          ))
        )}
      </div>
    </div>
  );
};
