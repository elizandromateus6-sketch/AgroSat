import React, { useState } from 'react';
import { Farm, Alert, User } from '../types';
import { DashboardCard } from '../components/DashboardCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { NDVIChart } from '../components/NDVIChart';
import { NDVILegend } from '../components/NDVILegend';
import { WeatherCard } from '../components/WeatherCard';
import { AlertCard } from '../components/AlertCard';
import { farmService } from '../services/farmService';
import { pdfReportService } from '../services/pdfReportService';
import {
  MapPin,
  Maximize2,
  Activity,
  Bell,
  Clock,
  Sprout,
  Plus,
  ArrowUpRight,
  FileDown,
  CheckCircle2,
  Download,
  FileText,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface DashboardPageProps {
  farms: Farm[];
  alerts: Alert[];
  currentUser?: User | null;
  onSelectFarm: (farmId: string) => void;
  onNavigate: (tab: string) => void;
  onRefreshData: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  farms,
  alerts,
  currentUser,
  onSelectFarm,
  onNavigate,
  onRefreshData,
}) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || '');
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'ndvi' | 'vegetation' | 'soil' | 'water' | 'alerts'>('ndvi');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];

  const totalAreaHa = farms.reduce((acc, f) => acc + f.totalArea, 0);
  const activeAlertsCount = alerts.filter((a) => !a.read).length;

  const handleMarkAlertRead = (alertId: string) => {
    farmService.markAlertRead(alertId);
    onRefreshData();
  };

  const ndviHistory = selectedFarmId
    ? farmService.getNdviHistory(selectedFarmId)
    : farmService.getNdviHistory('farm_001');

  const handleExportPDF = (type: 'selected' | 'all') => {
    setIsExporting(true);
    setShowExportMenu(false);

    try {
      if (type === 'selected' && selectedFarm) {
        pdfReportService.generateCropHealthReport({
          farm: selectedFarm,
          alerts,
          userName: currentUser?.name || 'Agricultor Registado',
          userEmail: currentUser?.email || 'utilizador@agrosat.ao',
        });
        setExportSuccessMessage(`Relatório PDF de "${selectedFarm.name}" gerado com sucesso!`);
      } else {
        pdfReportService.generateCropHealthReport({
          allFarms: farms,
          alerts,
          userName: currentUser?.name || 'Agricultor Registado',
          userEmail: currentUser?.email || 'utilizador@agrosat.ao',
        });
        setExportSuccessMessage(`Relatório Geral (${farms.length} propriedades) gerado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório PDF:', error);
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setExportSuccessMessage(null);
      }, 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#4B6344]/10 text-[#4B6344] rounded-xl border border-[#4B6344]/20">
              <Activity className="w-5 h-5 text-[#4B6344]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">Dashboard Agrícola</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#8BB174]/20 text-[#2D3628] font-mono text-[10px] font-bold border border-[#8BB174]/30">
              AO-SAT LIVE
            </span>
          </div>
          <p className="text-xs text-[#6B705C] pl-0.5">
            Monitorização em tempo real por satélite, NDVI e alertas para Angola.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          {/* PDF Export Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting || farms.length === 0}
              className="px-4 py-2.5 bg-[#1E291B] hover:bg-[#2A3826] text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all border border-[#33422F] cursor-pointer disabled:opacity-50"
              title="Exportar dados de saúde vegetal e NDVI em PDF"
            >
              <FileDown className="w-4 h-4 text-[#8BB174]" />
              <span>{isExporting ? 'A Gerar PDF...' : 'Exportar Relatório PDF'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#A3B18A]" />
            </button>

            {/* Dropdown Options */}
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1E291B] text-[#E8EDDF] rounded-2xl shadow-2xl border border-[#33422F] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-[#2A3826]">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#8BB174]" />
                    <span>Opções de Relatório PDF</span>
                  </p>
                  <p className="text-[10px] text-[#A3B18A]">
                    Inclui diagnóstico NDVI, satélite Sentinel-2 e recomendações.
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  {selectedFarm && (
                    <button
                      onClick={() => handleExportPDF('selected')}
                      className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-[#2A3826] text-white flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-emerald-400 group-hover:text-emerald-300">
                          {selectedFarm.name}
                        </span>
                        <span className="text-[10px] text-[#A3B18A]">
                          Relatório detalhado do campo atual
                        </span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-[#8BB174]" />
                    </button>
                  )}

                  <button
                    onClick={() => handleExportPDF('all')}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-[#2A3826] text-white flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">Todas as Propriedades</span>
                      <span className="text-[10px] text-[#A3B18A]">
                        Resumo consolidado ({farms.length} fazendas)
                      </span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-[#8BB174]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('properties')}
            className="px-4 py-2.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Propriedade</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {exportSuccessMessage && (
        <div className="p-3.5 bg-emerald-900/90 text-white rounded-2xl border border-emerald-500/50 shadow-lg flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{exportSuccessMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">Download Concluído</span>
        </div>
      )}

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Propriedades"
          value={farms.length}
          subtitle="Fazendas e campos"
          icon={MapPin}
          colorScheme="emerald"
        />

        <DashboardCard
          title="Área Monitorizada"
          value={`${totalAreaHa} ha`}
          subtitle="Hectares sob vigilância"
          icon={Maximize2}
          colorScheme="blue"
        />

        <DashboardCard
          title="Estado Médio NDVI"
          value={selectedFarm?.currentNdvi ? selectedFarm.currentNdvi.toFixed(2) : "0.72"}
          subtitle={
            (selectedFarm?.currentNdvi || 0.72) >= 0.65
              ? "Vegetação Saudável"
              : (selectedFarm?.currentNdvi || 0.72) >= 0.45
              ? "Vigor Moderado"
              : "Atenção Necessária"
          }
          icon={Activity}
          trend={{ value: '+0.06 este mês', isPositive: true }}
          colorScheme="emerald"
        />

        <DashboardCard
          title="Última Atualização"
          value="Hoje, 06:30"
          subtitle="Passe Sentinel-2 (ESA)"
          icon={Clock}
          colorScheme="purple"
        />

        <DashboardCard
          title="Alertas Ativos"
          value={activeAlertsCount}
          subtitle="Atenção recomendada"
          icon={Bell}
          colorScheme={activeAlertsCount > 0 ? 'amber' : 'emerald'}
        />
      </div>

      {/* Main Interactive Map & Selected Property Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Col: Interactive Geospatial Leaflet Map (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">Mapa de Propriedades & Satélite</h3>
              </div>

              {/* Quick Farm Selection & Farm PDF Button */}
              <div className="flex items-center space-x-2">
                {farms.length > 0 && (
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-500 font-medium hidden sm:inline">Selecionar:</span>
                    <select
                      value={selectedFarmId}
                      onChange={(e) => {
                        setSelectedFarmId(e.target.value);
                        onSelectFarm(e.target.value);
                      }}
                      className="bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                    >
                      {farms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.province})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedFarm && (
                  <button
                    onClick={() => handleExportPDF('selected')}
                    title={`Exportar Relatório PDF de ${selectedFarm.name}`}
                    className="p-1.5 bg-[#4B6344]/10 hover:bg-[#4B6344]/20 text-[#4B6344] rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer border border-[#4B6344]/20"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                )}
              </div>
            </div>

            {/* Map Canvas */}
            <InteractiveMap
              farms={farms}
              selectedFarmId={selectedFarmId}
              onSelectFarm={(id) => {
                setSelectedFarmId(id);
                onSelectFarm(id);
              }}
              activeLayer={activeLayer}
              onLayerChange={(layer) => setActiveLayer(layer)}
              height="440px"
            />
          </div>

          {/* Temporal NDVI Evolution Chart */}
          <div className="relative">
            <NDVIChart
              data={ndviHistory}
              title={`Curva Temporal de NDVI — ${selectedFarm?.name || 'Fazenda'}`}
              farmName={selectedFarm?.name}
            />
          </div>
        </div>

        {/* Right Col: Property Sidebar Info, Weather & Alerts */}
        <div className="space-y-6">
          {/* Quick PDF Health Summary Banner */}
          {selectedFarm && (
            <div className="bg-gradient-to-br from-[#1E291B] to-[#2A3826] text-white p-4 rounded-2xl border border-[#33422F] shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#8BB174]" />
                  <h4 className="font-bold text-xs text-white">Relatório Técnico do Campo</h4>
                </div>
                <span className="text-[10px] bg-[#8BB174]/20 text-[#DDE5B6] px-2 py-0.5 rounded-full font-mono font-bold border border-[#8BB174]/30">
                  {selectedFarm.cropType || 'Cultura'}
                </span>
              </div>
              <p className="text-[11px] text-[#D0D7C9] leading-relaxed">
                Exporte o dossiê agronômico com índices multiespectrais, histórico de clorofila e recomendações de manejo.
              </p>
              <button
                onClick={() => handleExportPDF('selected')}
                className="w-full py-2 bg-[#4B6344] hover:bg-[#3B4E35] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar PDF de {selectedFarm.name}</span>
              </button>
            </div>
          )}

          {/* Weather Widget */}
          <WeatherCard province={selectedFarm?.province || 'Huambo'} />

          {/* Active Alerts List */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Alertas do Sistema</h3>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center space-x-1"
              >
                <span>Ver Todos</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4">Nenhum alerta pendente.</p>
              ) : (
                alerts.slice(0, 2).map((a) => (
                  <AlertCard key={a.id} alert={a} onMarkRead={handleMarkAlertRead} />
                ))
              )}
            </div>
          </div>

          {/* Educational Legend Quick Module */}
          <NDVILegend />
        </div>
      </div>
    </div>
  );
};
