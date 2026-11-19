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
        <div className="bg-[#1E291B] text-white rounded-2xl p-5 border border-[#2E3F2A] shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#A3B18A] block text-[11px]">Nome da Fazenda:</span>
            <strong className="text-sm font-bold text-white font-display mt-0.5 block">{selectedFarm.name}</strong>
            <p className="text-[11px] text-[#8BB174] mt-0.5">📍 {selectedFarm.locationName}</p>
          </div>

          <div>
            <span className="text-[#A3B18A] block text-[11px]">Cultura & Variedade:</span>
            <strong className="text-sm font-bold text-[#DDE5B6] mt-0.5 block">
              {selectedFarm.mainCrop} {selectedFarm.variety ? `(${selectedFarm.variety})` : ''}
            </strong>
            <p className="text-[11px] text-[#A3B18A] mt-0.5">Plantio: {selectedFarm.plantingDate}</p>
          </div>

          <div>
            <span className="text-[#A3B18A] block text-[11px]">Área sob Monitoria:</span>
            <strong className="text-sm font-bold text-white mt-0.5 block">{selectedFarm.totalArea} hectares (ha)</strong>
            <p className="text-[11px] text-[#A3B18A] mt-0.5">Sistema: {selectedFarm.irrigationType}</p>
          </div>

          <div>
            <span className="text-[#A3B18A] block text-[11px]">NDVI Mais Recente:</span>
            <strong className="text-base font-extrabold text-[#8BB174] font-mono mt-0.5 block">
              {historyData[historyData.length - 1]?.ndvi.toFixed(2) || '0.78'}
            </strong>
            <p className="text-[11px] text-[#A3B18A] mt-0.5">Satélite Sentinel-2 (ESA, 10m)</p>
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
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-[#E0E2D9] shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#EDF0E7] pb-3">
          <h3 className="font-bold text-[#1E291B] text-sm font-display">Tabela Histórica de Registos por Quinzena</h3>
          <span className="text-[11px] font-medium text-[#556050] bg-[#F7F8F3] px-2.5 py-1 rounded-lg border border-[#CCD0C2]">
            Valores Espectrais Calibrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F7F8F3] border-b border-[#E0E2D9] text-[#556050] font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3">NDVI</th>
                <th className="py-2.5 px-3">Refletância NIR</th>
                <th className="py-2.5 px-3">Absorção RED</th>
                <th className="py-2.5 px-3">Temperatura</th>
                <th className="py-2.5 px-3">Precipitação</th>
                <th className="py-2.5 px-3">Estado Observado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1E6]">
              {historyData.map((pt, idx) => (
                <tr key={idx} className="hover:bg-[#F9FAF6] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#1E291B]">{pt.date}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#2E3F2A]">{pt.ndvi.toFixed(2)}</td>
                  <td className="py-2.5 px-3 font-mono text-[#556050]">{pt.nir || '0.78'}</td>
                  <td className="py-2.5 px-3 font-mono text-[#556050]">{pt.red || '0.11'}</td>
                  <td className="py-2.5 px-3 text-[#3F483A]">{pt.temp || 24}°C</td>
                  <td className="py-2.5 px-3 text-sky-700 font-bold">{pt.precipitation || 15} mm</td>
                  <td className="py-2.5 px-3 font-semibold">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                        pt.ndvi >= 0.7
                          ? 'bg-[#EBF2E7] text-[#2E3F2A]'
                          : pt.ndvi >= 0.5
                          ? 'bg-[#F4F6EA] text-[#4A5D33]'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {pt.ndvi >= 0.7
                        ? 'Vigor Excelente'
                        : pt.ndvi >= 0.5
                        ? 'Desenvolvimento Normal'
                        : 'Atenção / Stress Hídrico'}
                    </span>
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
