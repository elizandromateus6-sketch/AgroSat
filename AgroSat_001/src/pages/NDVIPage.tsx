import React, { useState } from 'react';
import { Farm } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { NDVILegend } from '../components/NDVILegend';
import { NDVIExplainer } from '../components/NDVIExplainer';
import { interpretNdvi, formatNdvi } from '../utils/ndviUtils';
import { calculateNdviFormula } from '../services/satelliteService';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  Satellite,
  Layers,
  Info,
  Calculator,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface NDVIPageProps {
  farms: Farm[];
}

export const NDVIPage: React.FC<NDVIPageProps> = ({ farms }) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'ndvi' | 'vegetation' | 'soil' | 'water' | 'alerts'>('ndvi');

  // Interactive Simulator State
  const [nirVal, setNirVal] = useState<number>(0.78);
  const [redVal, setRedVal] = useState<number>(0.11);

  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];

  const currentNdvi =
    selectedFarm?.currentNdvi !== undefined
      ? selectedFarm.currentNdvi
      : selectedFarm?.id === 'farm_001'
      ? 0.78
      : selectedFarm?.id === 'farm_002'
      ? 0.54
      : 0.72;

  const ndviInfo = interpretNdvi(currentNdvi);

  // Dynamic Historical Data for Selected Farm
  const historyData = [
    { date: '10 Jan', ndvi: Math.max(0.2, Number((currentNdvi - 0.28).toFixed(2))), label: 'Emergência' },
    { date: '25 Jan', ndvi: Math.max(0.3, Number((currentNdvi - 0.19).toFixed(2))), label: 'Perfilhamento' },
    { date: '08 Fev', ndvi: Math.max(0.4, Number((currentNdvi - 0.11).toFixed(2))), label: 'Crescimento' },
    { date: '18 Fev', ndvi: Math.max(0.48, Number((currentNdvi - 0.05).toFixed(2))), label: 'Expansão Foliar' },
    { date: '28 Fev', ndvi: currentNdvi, label: 'Dossel Atual' },
  ];

  const calculatedSimulatedNdvi = calculateNdviFormula(nirVal, redVal);
  const simInfo = interpretNdvi(calculatedSimulatedNdvi);

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#2E3F2A]/10 text-[#2E3F2A] rounded-xl border border-[#2E3F2A]/20">
              <Activity className="w-5 h-5 text-[#2E3F2A]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">Módulo NDVI & Biomassa Vegetal</h1>
          </div>
          <p className="text-xs text-[#525B4C] pl-0.5">
            Sensoriamento por satélite Sentinel-2 para monitoramento de fotossíntese, clorofila e viço agrícola.
          </p>
        </div>

        {/* Selected Farm Selector */}
        {farms.length > 0 && (
          <div className="flex items-center space-x-2 bg-[#F7F8F3] px-3.5 py-2 rounded-xl border border-[#CCD0C2] self-start sm:self-auto">
            <span className="text-xs font-semibold text-[#525B4C]">Fazenda Ativa:</span>
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#1E291B] outline-none cursor-pointer"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.mainCrop})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Educational Explainer */}
      <NDVIExplainer />

      {/* Highlights Bar: Current NDVI + Classification + Sentinel Status */}
      {selectedFarm && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 backdrop-blur-sm border border-[#E0E2D9] rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-[#6B705C] block">Valor Atual do NDVI</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold font-mono text-[#1E291B]">
                {formatNdvi(currentNdvi)}
              </span>
              <span className="text-xs font-bold text-[#556050]">/ 1.00</span>
            </div>
            <p className="text-[11px] text-[#556050] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>+0.05 vs. passagem anterior</span>
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border border-[#E0E2D9] rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-[#6B705C] block">Classificação da Vegetação</span>
            <div className="mt-1 flex items-center space-x-2">
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-2xs"
                style={{ backgroundColor: ndviInfo.color }}
              >
                {ndviInfo.label}
              </span>
            </div>
            <p className="text-[11px] text-[#556050] mt-1.5 leading-tight line-clamp-1">
              {ndviInfo.description}
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border border-[#E0E2D9] rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-[#6B705C] block">Cultura & Variedade</span>
            <strong className="text-sm font-bold text-[#1E291B] block mt-1">
              {selectedFarm.mainCrop} {selectedFarm.variety ? `(${selectedFarm.variety})` : ''}
            </strong>
            <span className="text-[11px] text-[#556050] mt-1 block">
              {selectedFarm.totalArea} ha • {selectedFarm.province}
            </span>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border border-[#E0E2D9] rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-[#6B705C] block">Passagem Sentinel-2</span>
            <strong className="text-sm font-bold text-[#1E291B] block mt-1 flex items-center gap-1.5">
              <Satellite className="w-4 h-4 text-[#3D5237]" />
              <span>Última Órbita: Há 3 dias</span>
            </strong>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
              Próxima passagem: Em 2 dias
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Map + Historical Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map with Polygon & Layers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-[#E0E2D9] shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDF0E7] pb-3">
              <div className="flex items-center space-x-2">
                <Satellite className="w-5 h-5 text-[#2E3F2A]" />
                <div>
                  <h3 className="font-bold text-[#1E291B] text-sm">
                    Mapa de Satélite & Camada Espectral: {selectedFarm?.name}
                  </h3>
                  <p className="text-[11px] text-[#556050]">
                    Visualização geoespacial com resolução de 10 metros
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#F2F4EB] p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveLayer('ndvi')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeLayer === 'ndvi'
                      ? 'bg-white text-[#2E3F2A] shadow-2xs font-bold'
                      : 'text-[#556050] hover:text-[#1E291B]'
                  }`}
                >
                  Camada NDVI
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayer('satellite')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeLayer === 'satellite'
                      ? 'bg-white text-[#2E3F2A] shadow-2xs font-bold'
                      : 'text-[#556050] hover:text-[#1E291B]'
                  }`}
                >
                  RGB Cor Real
                </button>
              </div>
            </div>

            <InteractiveMap
              farms={farms}
              selectedFarmId={selectedFarmId}
              onSelectFarm={(id) => setSelectedFarmId(id)}
              activeLayer={activeLayer}
              onLayerChange={(l) => setActiveLayer(l)}
              height="450px"
            />
          </div>

          {/* Historical Evolution Chart */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-[#E0E2D9] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#EDF0E7] pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#2E3F2A]" />
                <h3 className="font-bold text-[#1E291B] text-sm">
                  Evolução Histórica do NDVI — Safra Atual
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#556050] bg-[#F7F8F3] px-2.5 py-1 rounded-lg border border-[#CCD0C2]">
                Sentinel-2 Revisit (5 em 5 dias)
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E3F2A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2E3F2A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF1E6" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B705C' }} stroke="#D5DCDB" />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#6B705C' }} stroke="#D5DCDB" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#1E291B] text-white p-2.5 rounded-xl text-xs shadow-lg border border-[#2A3826]">
                            <p className="font-bold">{data.date}</p>
                            <p className="text-emerald-400 font-mono font-bold">
                              NDVI: {data.ndvi}
                            </p>
                            <p className="text-[10px] text-[#A3B18A]">{data.label}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ndvi"
                    stroke="#2E3F2A"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#ndviGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-[#556050] pt-1 leading-relaxed">
              O gráfico mostra a evolução do viço vegetal da parcela. Uma trajetória ascendente contínua reflete o bom estabelecimento das plantas após a sementeira.
            </p>
          </div>
        </div>

        {/* Right Col: Practical Agronomic Suggestions & Calculator */}
        <div className="space-y-4">
          {/* Practical Suggestions Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-[#E0E2D9] shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-[#EDF0E7] pb-3">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-bold text-[#1E291B] text-sm">Recomendações Práticas</h3>
                <p className="text-[11px] text-[#556050]">Ações dirigidas para o índice atual</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F8F2] border border-[#CCD8C4] space-y-1">
                <span className="font-bold text-[#1E291B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5237]" />
                  Diagnóstico no Talhão
                </span>
                <p className="text-[#3F483A] text-[11px] leading-relaxed">
                  {ndviInfo.recommendation}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F8F3] border border-[#CCD0C2] space-y-1">
                <span className="font-bold text-[#1E291B] flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-700" />
                  Manejo de Rega & Solo
                </span>
                <p className="text-[#3F483A] text-[11px] leading-relaxed">
                  Com o índice de {formatNdvi(currentNdvi)}, a taxa de transpiração do dossel encontra-se normal. Em solos ferralíticos, preserve a lâmina de água regular.
                </p>
              </div>
            </div>
          </div>

          {/* Educational Legend */}
          <NDVILegend />

          {/* Interactive Calculator Simulator */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-[#E0E2D9] shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-[#EDF0E7] pb-2.5">
              <Calculator className="w-4 h-4 text-[#2E3F2A]" />
              <h3 className="font-bold text-[#1E291B] text-xs">Simulador da Fórmula Biofísica</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-[#1E291B] mb-1 text-[11px]">
                  <span>Refletância NIR (Banda 8):</span>
                  <span className="font-mono text-emerald-700">{nirVal.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.95"
                  step="0.01"
                  value={nirVal}
                  onChange={(e) => setNirVal(Number(e.target.value))}
                  className="w-full accent-[#2E3F2A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-[#1E291B] mb-1 text-[11px]">
                  <span>Absorção RED (Banda 4):</span>
                  <span className="font-mono text-rose-700">{redVal.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.80"
                  step="0.01"
                  value={redVal}
                  onChange={(e) => setRedVal(Number(e.target.value))}
                  className="w-full accent-rose-700 cursor-pointer"
                />
              </div>

              {/* Simulation Result */}
              <div className="bg-[#1E291B] text-white p-3 rounded-xl border border-[#2A3826] text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-300">Resultado do Cálculo</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-400">
                  NDVI = {formatNdvi(calculatedSimulatedNdvi)}
                </div>
                <div
                  className="px-2.5 py-0.5 rounded text-[11px] font-bold inline-block text-white"
                  style={{ backgroundColor: simInfo.color }}
                >
                  {simInfo.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
