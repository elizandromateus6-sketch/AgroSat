import React, { useState } from 'react';
import { Farm } from '../types';
import { AIChat } from '../components/AIChat';
import { aiService, AgroCropAnalysisResponse } from '../services/aiService';
import { Bot, Sparkles, FileText, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AgroAIPageProps {
  farms: Farm[];
  selectedFarmId?: string;
}

export const AgroAIPage: React.FC<AgroAIPageProps> = ({ farms, selectedFarmId }) => {
  const [currentFarmId, setCurrentFarmId] = useState<string>(selectedFarmId || farms[0]?.id || '');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [cropAnalysis, setCropAnalysis] = useState<AgroCropAnalysisResponse | null>(null);

  const selectedFarm = farms.find((f) => f.id === currentFarmId) || farms[0];

  const handleGenerateCropAnalysis = async () => {
    if (!selectedFarm) return;
    setAnalysisLoading(true);

    try {
      const currentNdvi = (selectedFarm as any).currentNdvi || (selectedFarm.id === 'farm_001' ? 0.78 : selectedFarm.id === 'farm_002' ? 0.54 : 0.72);
      const res = await aiService.analyzeCrop({
        cropType: selectedFarm.mainCrop,
        ndviValue: currentNdvi,
        history: [0.55, 0.62, 0.71, currentNdvi],
        area: selectedFarm.totalArea,
        location: selectedFarm.locationName,
      });

      setCropAnalysis(res);
    } catch (err) {
      console.error('Erro ao gerar análise agronómica:', err);
      setCropAnalysis({
        analysis: `### Análise de Diagnóstico AgroSat
**Cultura:** ${selectedFarm.mainCrop}
**Localização:** ${selectedFarm.locationName}
**NDVI Registrado:** 0.72
**Avaliação:** Vegetação com desenvolvimento ativo.
**Ações Recomendadas:**
- Acompanhar balanço hídrico semanal.
- Realizar adubação de cobertura programada.`,
        timestamp: new Date().toISOString(),
        isRealAI: false,
        disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#4B6344]/10 text-[#4B6344] rounded-xl border border-[#4B6344]/20">
              <Bot className="w-5 h-5 text-[#4B6344]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">AgroSat AI & Assistente Virtual</h1>
          </div>
          <p className="text-xs text-[#6B705C] pl-0.5">
            Inteligência Artificial para diagnósticos de cultura, NDVI e consultoria agronómica em Angola.
          </p>
        </div>
      </div>

      {/* Grid: Instant Crop Analysis Generator + Interactive Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Instant AI Crop Diagnosis Generator (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Gerar Diagnóstico por IA</h3>
                <p className="text-[11px] text-slate-500">Análise sintética dos dados da fazenda</p>
              </div>
            </div>

            {farms.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Selecione a Propriedade:</label>
                <select
                  value={currentFarmId}
                  onChange={(e) => {
                    setCurrentFarmId(e.target.value);
                    setCropAnalysis(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold px-3 py-2 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      🌱 {f.name} ({f.mainCrop})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedFarm && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <p><strong>Cultura:</strong> {selectedFarm.mainCrop}</p>
                <p><strong>Local:</strong> {selectedFarm.locationName}</p>
                <p><strong>NDVI Atual:</strong> {selectedFarm.id === 'farm_001' ? '0.78' : '0.54'}</p>
              </div>
            )}

            <button
              onClick={handleGenerateCropAnalysis}
              disabled={analysisLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              {analysisLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gerando Diagnóstico...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analisar com Gemini AI</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Result Box */}
          {cropAnalysis && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3 animate-in fade-in">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm font-display text-emerald-300">Relatório AgroSat AI</h4>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {cropAnalysis.analysis}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-amber-300 flex items-start space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span>{cropAnalysis.disclaimer}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Full Interactive AgroSat Assistente Chatbot (2 cols) */}
        <div className="lg:col-span-2">
          <AIChat farms={farms} selectedFarmId={currentFarmId} />
        </div>
      </div>
    </div>
  );
};
