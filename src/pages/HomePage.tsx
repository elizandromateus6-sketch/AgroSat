import React from 'react';
import { User } from '../types';
import { AgroSatLogo } from '../components/AgroSatLogo';
import {
  Sprout,
  Satellite,
  Activity,
  Bot,
  GraduationCap,
  CloudSun,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  MapPin,
  TrendingUp,
  Users,
  Award,
  Lock,
  Sparkles,
  Zap,
  LogIn
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  currentUser: User | null;
  onOpenAuthModal: (isRegister?: boolean, message?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  currentUser,
  onOpenAuthModal,
}) => {
  const handleProtectedNavigate = (tab: string) => {
    if (currentUser) {
      onNavigate(tab);
    } else {
      onOpenAuthModal(
        false,
        'Apenas utilizadores com conta registada têm acesso às abas de Dashboard, Módulo NDVI, Propriedades, Monitorização, Clima, IA e Educação.'
      );
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E291B] via-[#2A3826] to-[#1E291B] text-white rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-14 border border-[#33422F] shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#8BB174]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#2A3826] border border-[#8BB174]/40 text-[#DDE5B6] text-xs font-semibold">
              <span>🇦🇴 Foco em Angola e África Subsaariana</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8BB174] animate-ping" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight tracking-tight text-white">
              Transformamos dados de satélite em decisões melhores para a agricultura.
            </h1>

            <p className="text-[#D0D7C9] text-sm sm:text-base leading-relaxed max-w-2xl">
              O AgroSat une sensoriamento remoto (Sentinel-2), índice NDVI, previsão meteorológica regional do INAMET e Inteligência Artificial para responder à pergunta essencial do agricultor:
            </p>

            <div className="p-4 rounded-2xl bg-[#2A3826]/90 border border-[#33422F] text-[#DDE5B6] font-serif italic text-sm sm:text-base">
              «Como está a minha plantação e o que posso fazer para melhorar a produção?»
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              {currentUser ? (
                <>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-6 py-3.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>Acessar Dashboard Agrícola</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('education')}
                    className="px-6 py-3.5 bg-[#2A3826] hover:bg-[#33422F] text-[#E8EDDF] font-bold rounded-xl text-xs sm:text-sm border border-[#33422F] flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-[#8BB174]" />
                    <span>AgroSat Educação</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuthModal(true, 'Crie a sua conta gratuita para desbloquear todas as abas e ferramentas do AgroSat!')}
                    className="px-6 py-3.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Criar Conta Gratuita para Acessar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenAuthModal(false, 'Faça login com a sua conta registada para aceder à plataforma.')}
                    className="px-6 py-3.5 bg-[#2A3826] hover:bg-[#33422F] text-[#E8EDDF] font-bold rounded-xl text-xs sm:text-sm border border-[#33422F] flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-[#8BB174]" />
                    <span>Já Tenho Conta (Entrar)</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Brand Card with Official Logo */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E0E2D9] text-[#1E291B] shadow-xl text-center space-y-3">
            <AgroSatLogo size="xl" variant="full" className="w-full max-w-[240px] border-none shadow-none" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B6344] block font-display">
                Marca Oficial AgroSat Angola
              </span>
              <p className="text-[11px] text-[#6B705C]">
                Inteligência agrícola vinda do espaço para impulsionar a agricultura nacional.
              </p>
            </div>

            {!currentUser && (
              <div className="w-full pt-3 border-t border-[#E0E2D9]">
                <button
                  onClick={() => onOpenAuthModal(true)}
                  className="w-full py-2 bg-[#1E291B] text-[#8BB174] hover:bg-[#2A3826] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#8BB174]" />
                  <span>Registe-se para Desbloquear Abas</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Notice Banner for Unregistered Visitors */}
      {!currentUser && (
        <section className="bg-[#1E291B] text-[#E8EDDF] rounded-2xl p-6 border border-[#2A3826] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-[#2A3826] rounded-2xl text-[#8BB174] border border-[#33422F] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <span>Acesso Exclusivo para Utilizadores Registados</span>
                <span className="text-[10px] bg-[#8BB174] text-[#1E291B] px-2 py-0.5 rounded-full font-mono font-black">
                  100% GRATUITO
                </span>
              </h3>
              <p className="text-xs text-[#D0D7C9] leading-relaxed max-w-2xl">
                Para ter acesso às abas de <strong>Dashboard, Mapeamento de Propriedades, Módulo NDVI, Histórico de Monitorização, Boletim INAMET, AgroSat AI e Educação</strong>, crie uma conta ou faça login.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onOpenAuthModal(false)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#2A3826] hover:bg-[#33422F] text-white rounded-xl text-xs font-bold border border-[#33422F] transition-all cursor-pointer text-center"
            >
              Fazer Login
            </button>
            <button
              onClick={() => onOpenAuthModal(true)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer text-center"
            >
              Criar Conta Gratuita
            </button>
          </div>
        </section>
      )}

      {/* Main Features Grid */}
      <section className="space-y-8 max-w-7xl mx-auto p-6 sm:p-10 bg-white/95 backdrop-blur-md rounded-3xl border border-[#E0E2D9] shadow-xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4B6344]">
            Tecnologia no Campo
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#1E291B]">
            A Plataforma Completa do Agricultor Moderno
          </h2>
          <p className="text-xs sm:text-sm text-[#6B705C]">
            Ferramentas desenvolvidas para atender desde pequenos produtores locais até técnicos e acadêmicos agrícolas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => handleProtectedNavigate('monitoring')}
            className="bg-[#F7F8F3] p-6 rounded-2xl border border-[#E0E2D9] shadow-sm hover:border-[#8BB174] transition-all space-y-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8BB174]/20 text-[#33422F] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Satellite className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1E291B] font-display text-base flex items-center justify-between">
              <span>Monitorização por Satélite</span>
              {!currentUser && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            </h3>
            <p className="text-xs text-[#6B705C] leading-relaxed">
              Imagens multiespectrais dos satélites Sentinel-2 com resolução de 10 metros atualizadas periodicamente.
            </p>
          </div>

          <div
            onClick={() => handleProtectedNavigate('ndvi')}
            className="bg-[#F7F8F3] p-6 rounded-2xl border border-[#E0E2D9] shadow-sm hover:border-[#8BB174] transition-all space-y-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8BB174]/20 text-[#33422F] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1E291B] font-display text-base flex items-center justify-between">
              <span>Índice NDVI e Clorofila</span>
              {!currentUser && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            </h3>
            <p className="text-xs text-[#6B705C] leading-relaxed">
              Mapa de cores simplificado da saúde da vegetação para identificar estresse hídrico e falta de adubo.
            </p>
          </div>

          <div
            onClick={() => handleProtectedNavigate('agro-ai')}
            className="bg-[#F7F8F3] p-6 rounded-2xl border border-[#E0E2D9] shadow-sm hover:border-[#8BB174] transition-all space-y-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8BB174]/20 text-[#33422F] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1E291B] font-display text-base flex items-center justify-between">
              <span>AgroSat AI (Gemini)</span>
              {!currentUser && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            </h3>
            <p className="text-xs text-[#6B705C] leading-relaxed">
              Assistente virtual treinado com inteligência agronômica para tirar dúvidas de manejo e fertilização.
            </p>
          </div>

          <div
            onClick={() => handleProtectedNavigate('education')}
            className="bg-[#F7F8F3] p-6 rounded-2xl border border-[#E0E2D9] shadow-sm hover:border-[#8BB174] transition-all space-y-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8BB174]/20 text-[#33422F] flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1E291B] font-display text-base flex items-center justify-between">
              <span>Educação Agrícola</span>
              {!currentUser && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            </h3>
            <p className="text-xs text-[#6B705C] leading-relaxed">
              Cursos práticos e quizzes interativos sobre agricultura de precisão para agricultores e estudantes.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Passo a Passo
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Como Funciona o AgroSat</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm font-mono">
              1
            </span>
            <h4 className="font-bold text-slate-100 text-base">Cadastre sua Propriedade</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Informe a localização na província (ex: Huambo, Huíla, Cuanza Sul), o tamanho em hectares e a cultura plantada.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm font-mono">
              2
            </span>
            <h4 className="font-bold text-slate-100 text-base">Receba Dados de Satélite</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize o polígono no mapa interativo com a camada NDVI e receba dados meteorológicos do INAMET e alertas automáticos.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm font-mono">
              3
            </span>
            <h4 className="font-bold text-slate-100 text-base">Tome Decisões Inteligentes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consulte a IA para saber onde irrigar, quando adubar e como otimizar a colheita com menor custo.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Impact Counter */}
      <section className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-800">10m</span>
            <p className="text-xs text-slate-600 font-medium mt-1">Resolução do Satélite Sentinel-2</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-800">18</span>
            <p className="text-xs text-slate-600 font-medium mt-1">Províncias de Angola Mapeadas</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-800">100%</span>
            <p className="text-xs text-slate-600 font-medium mt-1">Em Português & Acessível</p>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-800">24/7</span>
            <p className="text-xs text-slate-600 font-medium mt-1">Assistência Agrícola por IA</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-y-6 max-w-7xl mx-auto p-6 sm:p-10 bg-white/95 backdrop-blur-md rounded-3xl border border-[#E0E2D9] shadow-xl">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4B6344]">Depoimentos</span>
          <h2 className="text-2xl font-bold font-display text-[#1E291B]">O Que Dizem os Utilizadores em Angola</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F7F8F3] p-6 rounded-2xl border border-[#E0E2D9] shadow-sm space-y-3">
            <p className="text-xs text-[#6B705C] leading-relaxed italic">
              "Com o mapa NDVI do AgroSat consegui identificar que a parte Leste da minha machamba no Huambo estava com falta de adubo antes da cultura amarelar."
            </p>
            <div className="pt-2 border-t border-[#E0E2D9] flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#8BB174]/20 text-[#33422F] font-bold flex items-center justify-center text-xs font-mono">
                JA
              </div>
              <div>
                <strong className="text-xs text-[#1E291B] block">João Agostinho</strong>
                <span className="text-[10px] text-[#6B705C]">Agricultor de Cereal — Caála, Huambo</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F7F8F3] p-6 rounded-2xl border border-[#E0E2D9] shadow-sm space-y-3">
            <p className="text-xs text-[#6B705C] leading-relaxed italic">
              "Como técnico agrícola, utilizo o AgroSat para comparar o histórico de NDVI dos produtores associados no Cuanza Sul. Reduziu nosso tempo de vistoria de campo."
            </p>
            <div className="pt-2 border-t border-[#E0E2D9] flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs font-mono">
                CP
              </div>
              <div>
                <strong className="text-xs text-[#1E291B] block">Técnico Carlos Paiva</strong>
                <span className="text-[10px] text-[#6B705C]">Agrônomo — Sumbe, Cuanza Sul</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F7F8F3] p-6 rounded-2xl border border-[#E0E2D9] shadow-sm space-y-3">
            <p className="text-xs text-[#6B705C] leading-relaxed italic">
              "A área de educação e os quizzes sobre sensoriamento remoto me ajudaram imensamente nas cadeiras de Agricultura de Precisão da universidade."
            </p>
            <div className="pt-2 border-t border-[#E0E2D9] flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs font-mono">
                ML
              </div>
              <div>
                <strong className="text-xs text-[#1E291B] block">Maria Lourdes</strong>
                <span className="text-[10px] text-[#6B705C]">Estudante de Agronomia — Huíla</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="bg-gradient-to-r from-emerald-700 to-green-800 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
          Pronto para Transformar a Sua Produção Agrícola?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          Comece agora a monitorar suas propriedades por satélite, aprender conceitos de NDVI e consultar nosso assistente de IA.
        </p>
        <button
          onClick={() => handleProtectedNavigate('dashboard')}
          className="px-6 py-3 bg-white text-emerald-900 hover:bg-slate-100 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 inline-flex items-center space-x-2 cursor-pointer"
        >
          <span>{currentUser ? 'Acessar Dashboard Agrícola' : 'Criar Conta e Começar Gratuitamente'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
