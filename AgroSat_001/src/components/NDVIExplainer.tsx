import React from 'react';
import { Satellite, HelpCircle, Activity, Sparkles } from 'lucide-react';

export const NDVIExplainer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-[#E0E2D9] rounded-2xl p-5 shadow-sm text-xs">
      <div className="flex items-center justify-between mb-3 border-b border-[#EDF0E7] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF0E6] text-[#3D5237] flex items-center justify-center border border-[#CCD7C5]">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#1E291B] text-sm flex items-center gap-1.5">
              O que é o NDVI?
              <span className="text-[10px] font-medium text-[#5E6858] bg-[#F2F4EB] px-2 py-0.5 rounded-full border border-[#D5DCDB]">
                Índice de Vegetação
              </span>
            </h4>
            <p className="text-[11px] text-[#556050]">
              Explicação simples para apoiar decisões no campo
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-[#4B6344] font-medium text-[11px]">
          <Activity className="w-3.5 h-3.5" />
          <span>Sentinel-2 (10m)</span>
        </div>
      </div>

      <p className="text-[#3F483A] leading-relaxed mb-4">
        O <strong className="text-[#1E291B]">NDVI</strong> mede o vigor e a clorofila da sua plantação através de luz infravermelha captada pelos satélites. Funciona como um <strong className="text-[#1E291B]">exame de saúde contínuo</strong> para identificar onde a lavoura precisa de água, adubo ou combate a pragas antes que o olho humano note.
      </p>

      {/* Visual scale */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Baixo */}
        <div className="p-3 rounded-xl bg-[#FEF3C7]/70 border border-[#FCD34D] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-900 text-xs">NDVI Baixo</span>
              <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                &lt; 0.35
              </span>
            </div>
            <p className="text-[11px] text-amber-950 font-medium">
              Vegetação fraca ou possível stress
            </p>
            {!compact && (
              <p className="text-[10px] text-amber-900 mt-1 leading-normal">
                Indica plântulas em germinação, falta de água, deficiência nutricional ou ataque de pragas.
              </p>
            )}
          </div>
          <div className="mt-2 text-[10px] font-bold text-amber-800 bg-amber-200/60 rounded px-2 py-1 flex items-center gap-1">
            <span>🔍 Ação:</span> Inspecionar talhão de imediato
          </div>
        </div>

        {/* Médio */}
        <div className="p-3 rounded-xl bg-[#ECFCCB]/70 border border-[#BEF264] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-lime-900 text-xs">NDVI Médio</span>
              <span className="text-[11px] font-mono font-bold text-lime-800 bg-lime-100 px-1.5 py-0.5 rounded">
                0.35 - 0.65
              </span>
            </div>
            <p className="text-[11px] text-lime-950 font-medium">
              Vegetação moderada em crescimento
            </p>
            {!compact && (
              <p className="text-[10px] text-lime-900 mt-1 leading-normal">
                Desenvolvimento vegetativo normal. Folhas a expandir-se sem sintomas evidentes de restrição.
              </p>
            )}
          </div>
          <div className="mt-2 text-[10px] font-bold text-lime-800 bg-lime-200/60 rounded px-2 py-1 flex items-center gap-1">
            <span>💧 Ação:</span> Manter irrigação e adubação
          </div>
        </div>

        {/* Alto */}
        <div className="p-3 rounded-xl bg-[#DCFCE7]/70 border border-[#86EFAC] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-900 text-xs">NDVI Alto</span>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                &gt; 0.65
              </span>
            </div>
            <p className="text-[11px] text-emerald-950 font-medium">
              Vegetação vigorosa e densa
            </p>
            {!compact && (
              <p className="text-[10px] text-emerald-900 mt-1 leading-normal">
                Elevada taxa fotossintética, dossel foliar bem fechado e excelente potencial produtivo.
              </p>
            )}
          </div>
          <div className="mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-200/60 rounded px-2 py-1 flex items-center gap-1">
            <span>✨ Ação:</span> Monitoramento preventivo de rotina
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-[#EDF0E7] flex items-center justify-between text-[11px] text-[#556050]">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#3D5237]" />
          Fórmula Biofísica: <code className="font-mono bg-[#F2F4EB] px-1 py-0.5 rounded">(NIR - Vermelho) / (NIR + Vermelho)</code>
        </span>
        <span className="font-medium text-[#2E3F2A] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#5A7A52]" />
          Atualizado a cada passagem de satélite (5 dias)
        </span>
      </div>
    </div>
  );
};
