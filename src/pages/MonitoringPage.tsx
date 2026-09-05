import React, { useState } from 'react';
import { Farm } from '../types';
import { NDVIChart } from '../components/NDVIChart';
import { farmService } from '../services/farmService';
import { Calendar, Sprout, TrendingUp, CloudRain, Thermometer, AlertCircle } from 'lucide-react';

interface MonitoringPageProps {
  farms: Farm[];
  onSelectFarm?: (farmId: string) => void;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({ farms, onSelectFarm }) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || 'farm_001');

  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const historyData = farmService.getNdviHistory(selectedFarmId);

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#4B6344]/10 text-[#4B6344] rounded-xl border border-[#4B6344]/20">
              <Calendar className="w-5 h-5 text-[#4B6344]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">Histórico da Cultura</h1>
          </div>
          <p className="text-xs text-[#6B705C] pl-0.5">
            Acompanhamento temporal do crescimento, temperatura, precipitação e índice NDVI.
          </p>
        </div>

        {farms.length > 0 && (
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-[#6B705C] font-medium">Propriedade:</span>
            <select
              value={selectedFarmId}
              onChange={(e) => {
                setSelectedFarmId(e.target.value);
                if (onSelectFarm) onSelectFarm(e.target.value);
              }}
              className="bg-[#F7F8F3] text-[#1E291B] font-bold px-3.5 py-2 rounded-xl border border-[#E0E2D9] text-xs focus:outline-none cursor-pointer"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  🌱 {f.name} ({f.mainCrop})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Farm Overview Strip */}
      {selectedFarm && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Nome da Fazenda:</span>
            <strong className="text-sm font-bold text-white font-display">{selectedFarm.name}</strong>
            <p className="text-[10px] text-emerald-400">📍 {selectedFarm.locationName}</p>
          </div>

          <div>
            <span className="text-slate-400 block">Cultura Cultivada:</span>
            <strong className="text-sm font-bold text-emerald-300">{selectedFarm.mainCrop}</strong>
            <p className="text-[10px] text-slate-400">Plantio: {selectedFarm.plantingDate}</p>
          </div>

          <div>
            <span className="text-slate-400 block">Área sob Monitoria:</span>
            <strong className="text-sm font-bold text-white">{selectedFarm.totalArea} hectares (ha)</strong>
            <p className="text-[10px] text-slate-400">Sistema: {selectedFarm.irrigationType}</p>
          </div>

          <div>
            <span className="text-slate-400 block">NDVI Mais Recente:</span>
            <strong className="text-sm font-bold text-emerald-400">
              {historyData[historyData.length - 1]?.ndvi.toFixed(2) || '0.78'}
            </strong>
            <p className="text-[10px] text-slate-400">Satélite Sentinel-2 (ESA)</p>
          </div>
        </div>
      )}

      {/* Main Temporal Chart */}
      <NDVIChart
        data={historyData}
        title={`Evolução Temporal do Vigor Foliar (NDVI) & Chuva`}
        farmName={selectedFarm?.name}
      />

      {/* Detailed History Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-base font-display">Tabela Histórica de Registos por Quinzena</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3">NDVI</th>
                <th className="py-2.5 px-3">Refletância NIR</th>
                <th className="py-2.5 px-3">Absorção RED</th>
                <th className="py-2.5 px-3">Temperatura</th>
                <th className="py-2.5 px-3">Precipitação</th>
                <th className="py-2.5 px-3">Estado Observado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyData.map((pt, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{pt.date}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{pt.ndvi.toFixed(2)}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{pt.nir || '0.78'}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{pt.red || '0.11'}</td>
                  <td className="py-2.5 px-3 text-slate-700">{pt.temp || 24}°C</td>
                  <td className="py-2.5 px-3 text-blue-600 font-bold">{pt.precipitation || 15} mm</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-800">
                    {pt.ndvi >= 0.7
                      ? '🌿 Vigor Excelente'
                      : pt.ndvi >= 0.5
                      ? '🌱 Desenvolvendo'
                      : '⚠️ Atenção / Estresse'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
