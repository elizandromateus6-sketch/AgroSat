import React, { useState, useEffect } from 'react';
import { WeatherCard } from '../components/WeatherCard';
import {
  weatherService,
  ANGOLA_LOCATIONS,
  AFRICA_LOCATIONS,
  LocationPreset
} from '../services/weatherService';
import { WeatherData } from '../types';
import {
  CloudSun,
  MapPin,
  Search,
  Globe2,
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  Sun,
  CloudRain,
  Compass,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RotateCw,
  Building2,
  FileText
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationPreset>(ANGOLA_LOCATIONS[0]); // Huambo
  const [regionTab, setRegionTab] = useState<'angola' | 'africa'>('angola');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationPreset[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [weatherDetails, setWeatherDetails] = useState<WeatherData | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Search effect
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await weatherService.searchAfricanLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load detailed weather
  useEffect(() => {
    let isMounted = true;
    setLoadingDetails(true);

    weatherService
      .getWeatherByCoordinates(
        selectedLocation.lat,
        selectedLocation.lng,
        selectedLocation.name,
        selectedLocation.country,
        selectedLocation.province
      )
      .then((data) => {
        if (isMounted) {
          setWeatherDetails(data);
          setLoadingDetails(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingDetails(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedLocation]);

  const handleSelectLocation = (loc: LocationPreset) => {
    setSelectedLocation(loc);
    setSearchQuery('');
    setSearchResults([]);
  };

  const isAngolaSelected = selectedLocation.region === 'angola';

  return (
    <div className="space-y-6">
      {/* Header Banner with INAMET badge */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2 bg-[#4B6344]/10 text-[#4B6344] rounded-xl border border-[#4B6344]/20">
              <CloudSun className="w-5 h-5 text-[#4B6344]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">
              Meteorologia Agrícola & Boletim INAMET
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-1"></span>
              INAMET • ANGOLA 🇦🇴
            </span>
          </div>
          <p className="text-xs text-[#6B705C] pl-0.5 max-w-2xl leading-relaxed">
            Dados climáticos e agrometeorológicos padronizados de acordo com as normas e redes de monitoramento do <strong>INAMET (Instituto Nacional de Meteorologia e Geofísica de Angola)</strong>, integrados com satélites de observação atmosférica.
          </p>
        </div>

        {/* Search Bar with Live Geocoding */}
        <div className="relative w-full lg:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B705C] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar província, cidade ou município..."
              className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1E291B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#4B6344] focus:bg-white"
            />
          </div>

          {/* Search Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#CCD0C2] rounded-xl shadow-2xl z-50 overflow-hidden text-xs divide-y divide-slate-100">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectLocation(r)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-[#F0F2EB] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <span>{r.flag}</span>
                    <span className="font-bold text-[#1E291B]">{r.name}</span>
                  </div>
                  <span className="text-[10px] text-[#6B705C] font-mono">{r.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Region Category Selector Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E0E2D9] shadow-xs">
        <div className="flex items-center gap-1.5 bg-[#F0F2EB] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setRegionTab('angola')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              regionTab === 'angola'
                ? 'bg-[#1E291B] text-white shadow-sm'
                : 'text-[#6B705C] hover:text-[#1E291B]'
            }`}
          >
            <span>🇦🇴 Angola (18 Províncias INAMET)</span>
          </button>

          <button
            type="button"
            onClick={() => setRegionTab('africa')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              regionTab === 'africa'
                ? 'bg-[#1E291B] text-white shadow-sm'
                : 'text-[#6B705C] hover:text-[#1E291B]'
            }`}
          >
            <span>🌍 África & Pólos Agrícolas</span>
          </button>
        </div>

        {/* Current Active Location Pill */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#F7F8F3] rounded-xl border border-[#E0E2D9] text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#4B6344]" />
          <span className="text-[#6B705C]">Estação / Província:</span>
          <strong className="text-[#1E291B]">
            {selectedLocation.flag} {selectedLocation.name}
          </strong>
        </div>
      </div>

      {/* Horizontal List of Location Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {(regionTab === 'angola' ? ANGOLA_LOCATIONS : AFRICA_LOCATIONS).map((loc) => {
          const isSelected = selectedLocation.id === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#4B6344] text-white shadow-sm ring-2 ring-[#8BB174]/50'
                  : 'bg-white text-[#1E291B] hover:bg-[#F0F2EB] border border-[#E0E2D9]'
              }`}
            >
              <span>{loc.flag}</span>
              <span>{loc.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Weather Card (Live Real Data calibrated with INAMET) */}
      <div className="w-full">
        <WeatherCard presetLocation={selectedLocation} />
      </div>

      {/* Hourly Forecast for the next 12 hours */}
      {weatherDetails && weatherDetails.hourly && weatherDetails.hourly.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-[#E0E2D9] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#4B6344]" />
              <h3 className="font-bold text-[#1E291B] text-sm font-display">
                Evolução Horária das Próximas 12 Horas — {selectedLocation.name}
              </h3>
            </div>
            <span className="text-[10px] text-[#6B705C] font-mono">
              Padrão Horário INAMET / OMM
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {weatherDetails.hourly.map((h, i) => (
              <div
                key={i}
                className="bg-[#F7F8F3] p-2.5 rounded-xl text-center border border-[#E0E2D9] space-y-1 hover:border-[#8BB174] transition-colors"
              >
                <span className="text-[10px] font-bold text-[#6B705C] block">{h.time}</span>
                <span className="text-sm font-extrabold text-[#1E291B] block">{h.temp}°</span>
                <div className="flex items-center justify-center space-x-1 text-[10px] text-sky-600 font-bold">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{h.rainProb}%</span>
                </div>
                <span className="text-[9px] text-[#6B705C] truncate block">{h.condition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agricultural Agro-Climatic Insights */}
      {weatherDetails && weatherDetails.agriRecommendations && (
        <div className="bg-white rounded-2xl p-6 border border-[#E0E2D9] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#1E291B] text-base font-display flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#4B6344]" />
              <span>Diretrizes Agrometeorológicas Oficiais para {selectedLocation.name}</span>
            </h3>
            <span className="text-[10px] text-[#8BB174] font-bold bg-[#1E291B] px-3 py-1 rounded-full">
              {isAngolaSelected ? 'PADRÃO INAMET ANGOLA 🇦🇴' : 'PADRÃO OMM / REGIONAL 🌍'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1.5">
              <strong className="text-emerald-950 font-bold flex items-center space-x-1.5">
                <span>🌱</span>
                <span>Campanha & Sementeira</span>
              </strong>
              <p className="text-emerald-900 leading-relaxed text-[11px]">
                {weatherDetails.agriRecommendations.planting}
              </p>
            </div>

            <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-200 space-y-1.5">
              <strong className="text-sky-950 font-bold flex items-center space-x-1.5">
                <span>💧</span>
                <span>Balanço Hídrico & Rega</span>
              </strong>
              <p className="text-sky-900 leading-relaxed text-[11px]">
                {weatherDetails.agriRecommendations.irrigation}
              </p>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-1.5">
              <strong className="text-amber-950 font-bold flex items-center space-x-1.5">
                <span>🐛</span>
                <span>Alerta Fitossanitário</span>
              </strong>
              <p className="text-amber-900 leading-relaxed text-[11px]">
                {weatherDetails.agriRecommendations.pestRisk}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 font-bold flex items-center space-x-1.5">
                <span>🚜</span>
                <span>Janela de Pulverização</span>
              </strong>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {weatherDetails.agriRecommendations.sprayCondition}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
