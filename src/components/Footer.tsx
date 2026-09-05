import React from 'react';
import { AgroSatLogo } from './AgroSatLogo';
import { Globe, Shield, Satellite, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1E291B] text-[#A3B18A] border-t border-[#2A3826] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <AgroSatLogo size="sm" variant="icon" />
              <span className="text-lg font-bold font-display text-white">AgroSat</span>
            </div>
            <p className="text-[#A3B18A] leading-relaxed text-xs">
              Transformamos dados de satélite, NDVI e inteligência artificial em decisões inteligentes para a agricultura em Angola e na África Subsaariana.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#8BB174] font-medium">
              <Globe className="w-3.5 h-3.5" />
              <span>Foco Inicial: Angola (Huambo, Huíla, Cuanza Sul, Malanje)</span>
            </div>
          </div>

          {/* Col 2: Funcionalidades Principais */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#8BB174] transition-colors cursor-pointer">
                  Dashboard Agrícola
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('properties')} className="hover:text-[#8BB174] transition-colors cursor-pointer">
                  Gerenciador de Propriedades
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ndvi')} className="hover:text-[#8BB174] transition-colors cursor-pointer">
                  Análise de NDVI e Clorofila
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('monitoring')} className="hover:text-[#8BB174] transition-colors cursor-pointer">
                  Histórico Temporal de Culturas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weather')} className="hover:text-[#8BB174] transition-colors cursor-pointer">
                  Previsão Meteorológica INAMET
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Inteligência e Educação */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase text-[11px] tracking-wider">
              IA & Capacitação
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('agro-ai')} className="hover:text-[#8BB174] transition-colors flex items-center space-x-1 cursor-pointer">
                  <span>AgroSat AI Assistente</span>
                  <span className="px-1.5 py-0.2 bg-[#2A3826] text-[#8BB174] text-[9px] rounded font-mono border border-[#8BB174]/30">GEMINI</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('education')} className="hover:text-[#8BB174] transition-colors cursor-pointer">
                  Cursos de Agricultura de Precisão
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('quizzes')} className="hover:text-[#8BB174] transition-colors cursor-pointer">
                  Quizzes & Testes de Conhecimento
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('alerts')} className="hover:text-[#8BB174] transition-colors cursor-pointer">
                  Sistema de Alertas e Estresse
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparência & Dados */}
          <div className="space-y-3 bg-[#2A3826] p-4 rounded-2xl border border-[#33422F]">
            <div className="flex items-center space-x-1.5 text-[#DDE5B6] font-semibold text-xs">
              <Satellite className="w-4 h-4 text-[#8BB174]" />
              <span>Nota sobre Fontes de Dados</span>
            </div>
            <p className="text-[11px] text-[#A3B18A] leading-normal">
              O AgroSat integra padrões do <strong>INAMET (Angola)</strong> e satélites <strong>Sentinel-2 (ESA)</strong>. Acesso a abas avançadas liberado para contas registadas.
            </p>
            <div className="pt-2 border-t border-[#33422F] flex items-center justify-between text-[10px] text-[#D0D7C9]">
              <span>Versão 2.4</span>
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-[#8BB174]" />
                <span>Protocolo de Dados Seguro</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#2A3826] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold">AgroSat</span>
            <span>&copy; {new Date().getFullYear()} — Plataforma de Inteligência Agrícola.</span>
          </div>
          <div className="flex items-center space-x-1 text-[#D0D7C9]">
            <span>Feito com dedicação para agricultores de Angola</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
