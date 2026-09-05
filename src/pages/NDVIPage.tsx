import React, { useState } from 'react';
import { Farm } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { NDVILegend } from '../components/NDVILegend';
import { getNdviClassification, calculateNdviFormula } from '../services/satelliteService';
import { Activity, Satellite, Layers, Info, Calculator, Sparkles } from 'lucide-react';

interface NDVIPageProps {
  farms: Farm[];
}

export const NDVIPage: React.FC<NDVIPageProps> = ({ farms }) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'ndvi' | 'vegetation' | 'soil' | 'water' | 'alerts'>('ndvi');

  // Interactive Simulator State
  const [nirVal, setNirVal] = useState<number>(0.78);
  const [redVal, setRedVal] = useState<number>(0.11);

  const calculatedSimulatedNdvi = calculateNdviFormula(nirVal, redVal);
  const simMeta = getNdviClassification(calculatedSimulatedNdvi);

  return (
    <div className="space-y-8">
      {/* Page Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#4B6344]/10 text-[#4B6344] rounded-xl border border-[#4B6344]/20">
              <Activity className="w-5 h-5 text-[#4B6344]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">Módulo NDVI & Saúde Vegetal</h1>
          </div>
          <p className="text-xs text-[#6B705C] pl-0.5">
            Sensoriamento remoto por satélite Sentinel-2 para monitoramento de clorofila e biomassa.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Map + NDVI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Map Viewer with Layer Selector (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Satellite className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">Visualização de Camadas de Satélite</h3>
              </div>

              {farms.length > 0 && (
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  className="bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none cursor-pointer"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      🌱 {f.name} ({f.province})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <InteractiveMap
              farms={farms}
              selectedFarmId={selectedFarmId}
              onSelectFarm={(id) => setSelectedFarmId(id)}
              activeLayer={activeLayer}
              onLayerChange={(l) => setActiveLayer(l)}
              height="480px"
            />
          </div>

          {/* Interactive Calculator Simulator */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Simulador Interativo de Bandas Espectrais</h3>
                <p className="text-xs text-slate-500">
                  Ajuste a refletância NIR e RED para ver o resultado do cálculo em tempo real.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Refletância NIR (Infravermelho Próximo):</span>
                    <span className="font-mono text-emerald-600">{nirVal.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.01"
                    value={nirVal}
                    onChange={(e) => setNirVal(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Absorção RED (Luz Vermelha Visível):</span>
                    <span className="font-mono text-rose-600">{redVal.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.80"
                    step="0.01"
                    value={redVal}
                    onChange={(e) => setRedVal(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Simulation Output Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Resultado da Fórmula
                </span>
                <div className="text-3xl font-black font-mono text-emerald-400">
                  NDVI = {calculatedSimulatedNdvi.toFixed(2)}
                </div>
                <div
                  className="px-3 py-1.5 rounded-xl font-bold text-xs inline-block text-white"
                  style={{ backgroundColor: simMeta.colorHex }}
                >
                  {simMeta.category}
                </div>
                <p className="text-[11px] text-slate-300 pt-1">{simMeta.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Educational Legend & Disclaimer */}
        <div className="space-y-6">
          <NDVILegend />

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 text-xs space-y-2 shadow-xs">
            <div className="flex items-center space-x-2 font-bold text-amber-800">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Transparência de Dados de Satélite</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              O AgroSat utiliza dados simulados realistas para o território angolano até que uma chave de acesso às APIs do Copernicus Sentinel Hub ou NASA Landsat seja vinculada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
