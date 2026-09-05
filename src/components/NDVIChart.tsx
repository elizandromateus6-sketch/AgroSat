import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { NDVIPoint } from '../types';
import { Activity, Calendar, Info, TrendingUp } from 'lucide-react';

interface NDVIChartProps {
  data: NDVIPoint[];
  title?: string;
  farmName?: string;
}

export const NDVIChart: React.FC<NDVIChartProps> = ({
  data,
  title = 'Evolução Temporal do NDVI (Índice de Vegetação)',
  farmName,
}) => {
  const [period, setPeriod] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('3m');

  // Filter or slice dataset based on period selection
  const filteredData = React.useMemo(() => {
    if (period === '7d') return data.slice(-2);
    if (period === '30d') return data.slice(-4);
    if (period === '3m') return data.slice(-6);
    return data;
  }, [data, period]);

  const latestPoint = data[data.length - 1];
  const previousPoint = data[data.length - 2] || latestPoint;
  const ndviDiff = (latestPoint?.ndvi || 0) - (previousPoint?.ndvi || 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E0E2D9] shadow-sm space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F2EB]">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#DDE5B6] text-[#1E291B] border border-[#8BB174]/30">
              <Activity className="w-4 h-4 text-[#4B6344]" />
            </div>
            <h3 className="text-base font-bold text-[#1E291B] font-display">{title}</h3>
          </div>
          {farmName && <p className="text-xs text-[#6B705C] mt-0.5">Propriedade: <strong>{farmName}</strong></p>}
        </div>

        {/* Period Selector Buttons */}
        <div className="flex items-center space-x-1 bg-[#F0F2EB] p-1 rounded-xl text-xs font-semibold border border-[#E0E2D9]">
          {[
            { id: '7d', label: '7 Dias' },
            { id: '30d', label: '30 Dias' },
            { id: '3m', label: '3 Meses' },
            { id: '6m', label: '6 Meses' },
            { id: '1y', label: '1 Ano' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                period === p.id
                  ? 'bg-[#4B6344] text-white shadow-sm font-bold'
                  : 'text-[#6B705C] hover:text-[#1E291B] hover:bg-[#E0E2D9]/60'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F8F3] p-3 rounded-xl border border-[#E0E2D9] text-xs">
        <div>
          <span className="text-[#6B705C]">NDVI Atual:</span>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="text-lg font-bold text-[#4B6344]">{latestPoint?.ndvi.toFixed(2)}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                ndviDiff >= 0 ? 'bg-[#DDE5B6] text-[#1E291B]' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {ndviDiff >= 0 ? `+${ndviDiff.toFixed(2)}` : ndviDiff.toFixed(2)}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[#6B705C]">Refletância NIR:</span>
          <p className="text-lg font-bold text-[#1E291B] mt-0.5">{latestPoint?.nir || '0.78'}</p>
        </div>

        <div>
          <span className="text-[#6B705C]">Absorção RED:</span>
          <p className="text-lg font-bold text-[#1E291B] mt-0.5">{latestPoint?.red || '0.11'}</p>
        </div>

        <div>
          <span className="text-[#6B705C]">Precipitação Acumulada:</span>
          <p className="text-lg font-bold text-sky-700 mt-0.5">{latestPoint?.precipitation || '18'} mm</p>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B6344" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8BB174" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E2D9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B705C' }} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#6B705C' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E291B',
                borderColor: '#2A3826',
                color: '#fff',
                borderRadius: '0.75rem',
                fontSize: '12px',
              }}
              formatter={(value: any, name: any) => [
                name === 'ndvi' ? `${value} (NDVI)` : `${value} mm`,
                name === 'ndvi' ? 'Índice Vegetativo' : 'Chuva',
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            
            {/* Reference Line for Healthy Vegetation Benchmark (0.50) */}
            <ReferenceLine y={0.5} stroke="#d97706" strokeDasharray="3 3" label={{ value: 'Limiar de Saúde (0.50)', fill: '#b45309', fontSize: 10, position: 'insideTopLeft' }} />

            <Area
              type="monotone"
              dataKey="ndvi"
              name="ndvi"
              stroke="#4B6344"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#ndviGradient)"
            />
            <Area
              type="monotone"
              dataKey="precipitation"
              name="precipitation"
              stroke="#0284c7"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#rainGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center space-x-2 text-[11px] text-[#6B705C] bg-[#F7F8F3] p-2.5 rounded-xl border border-[#E0E2D9]">
        <Info className="w-3.5 h-3.5 text-[#4B6344] shrink-0" />
        <span>
          O gráfico correlaciona a curva de vigor da folha (NDVI) com os índices de chuva (mm) capturados pelos sensores Sentinel-2 sobre Angola.
        </span>
      </div>
    </div>
  );
};
