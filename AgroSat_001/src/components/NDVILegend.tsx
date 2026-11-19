import React from 'react';
import { Activity, BookOpen, Info } from 'lucide-react';

export const NDVILegend: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E0E2D9] shadow-sm space-y-4 text-[#2D3628]">
      <div className="flex items-center space-x-2 border-b border-[#F0F2EB] pb-3">
        <div className="p-2 bg-[#DDE5B6] text-[#1E291B] rounded-xl border border-[#8BB174]/30">
          <Activity className="w-5 h-5 text-[#4B6344]" />
        </div>
        <div>
          <h3 className="font-bold text-[#1E291B] text-base font-display">O que é o Índice NDVI?</h3>
          <p className="text-xs text-[#6B705C]">Módulo Educativo de Sensoriamento Remoto</p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[#6B705C]">
        <strong>NDVI (Normalized Difference Vegetation Index)</strong> é um índice científico utilizado para analisar a saúde, densidade e quantidade de vegetação através de imagens capturadas por sensores de satélite (como Sentinel-2 e Landsat).
      </p>

      {/* Math Formula Card */}
      <div className="bg-[#1E291B] text-white p-4 rounded-2xl border border-[#2A3826] space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8BB174]">
          Fórmula Matemática
        </span>
        <div className="text-center font-mono text-base font-bold text-[#DDE5B6] py-1">
          NDVI = (NIR - RED) / (NIR + RED)
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A3B18A] pt-1 border-t border-[#2A3826]">
          <div>
            <strong className="text-[#8BB174]">NIR (Infravermelho Próximo):</strong> Refletido pelas células internas de folhas vivas.
          </div>
          <div>
            <strong className="text-[#8BB174]">RED (Luz Vermelha):</strong> Absorvida pela clorofila para realizar a fotossíntese.
          </div>
        </div>
      </div>

      {/* Visual Color Spectrum Bar */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#1E291B]">Escala e Gradiente de Cores:</span>
        <div className="h-4 w-full rounded-lg bg-gradient-to-r from-red-500 via-amber-400 to-green-600 shadow-inner" />
        <div className="flex justify-between text-[10px] font-mono font-bold text-[#6B705C]">
          <span>-1.0</span>
          <span>-0.5</span>
          <span>0.0</span>
          <span>+0.3</span>
          <span>+0.6</span>
          <span>+1.0</span>
        </div>
      </div>

      {/* Scale Items breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-start space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-blue-900 text-[11px]">-1.0 a 0.0 → Água / Superfícies Inertes</p>
            <p className="text-[10px] text-blue-700">Rios, represas, solo alagado, sombras ou nuvens.</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start space-x-2">
          <div className="w-3 h-3 rounded-full bg-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-amber-900 text-[11px]">0.0 a 0.2 → Solo Exposto / Pouca Vegetação</p>
            <p className="text-[10px] text-amber-700">Terrenos arados, estradas, pedreiras ou palhada.</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-yellow-50 border border-yellow-100 flex items-start space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-yellow-900 text-[11px]">0.2 a 0.5 → Vegetação em Desenvolvimento</p>
            <p className="text-[10px] text-yellow-700">Germinação inicial, pastagens leves ou estresse hídrico.</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#F0F2EB] border border-[#E0E2D9] flex items-start space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#4B6344] mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-[#1E291B] text-[11px]">0.5 a 1.0 → Vegetação Muito Saudável</p>
            <p className="text-[10px] text-[#6B705C]">Culturas agrícolas no auge, dossel denso e vigoroso.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
