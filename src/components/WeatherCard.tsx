import React, { useEffect, useState } from 'react';
import { WeatherData } from '../types';
import { weatherService, ANGOLA_LOCATIONS, AFRICA_LOCATIONS, LocationPreset } from '../services/weatherService';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Cloud,
  Zap,
  Info,
  Compass,
  Gauge,
  SunMedium,
  RefreshCw,
  MapPin,
  Globe2,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Radio,
  Building2
} from 'lucide-react';

interface WeatherCardProps {
  province?: string;
  presetLocation?: LocationPreset;
  onLocationChange?: (location: LocationPreset) => void;
  showSelector?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  province = 'Huambo',
  presetLocation,
  onLocationChange,
  showSelector = false,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRegionTab, setSelectedRegionTab] = useState<'angola' | 'africa'>('angola');

  const fetchWeather = async () => {
    setLoading(true);
    try {
      let data: WeatherData;
      if (presetLocation) {
        data = await weatherService.getWeatherByCoordinates(
          presetLocation.lat,
          presetLocation.lng,
          presetLocation.name,
          presetLocation.country,
          presetLocation.province
        );
      } else {
        data = await weatherService.getWeatherForProvince(province);
      }
      setWeather(data);
    } catch (e) {
      console.error('Erro ao carregar clima:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [province, presetLocation]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchWeather();
  };

  const getWeatherIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${className} text-amber-400`} />;
      case 'cloud':
        return <Cloud className={`${className} text-slate-300`} />;
      case 'rain':
      case 'cloud-rain':
        return <CloudRain className={`${className} text-sky-400`} />;
      case 'thunder':
        return <Zap className={`${className} text-amber-300`} />;
      case 'sun-cloud':
      default:
        return <CloudSun className={`${className} text-amber-300`} />;
    }
  };

  const isAngola = weather?.country.toLowerCase().includes('angola') || !weather?.country;
  const currentAngolaPreset = ANGOLA_LOCATIONS.find(
    (a) =>
      (presetLocation && presetLocation.id === a.id) ||
      (weather && (weather.location.toLowerCase().includes(a.name.toLowerCase()) || (a.province && weather.province?.toLowerCase().includes(a.province.toLowerCase()))))
  );

  if (loading) {
    return (
      <div className="bg-[#1E291B] rounded-2xl p-6 border border-[#2A3826] shadow-xl animate-pulse flex flex-col items-center justify-center space-y-3 min-h-[300px] text-white">
        <div className="p-3 bg-[#2A3826] rounded-full text-[#8BB174]">
          <CloudSun className="w-8 h-8 animate-spin" />
        </div>
        <p className="text-xs font-bold text-[#D0D7C9]">
          Sincronizando com a rede de estações meteorológicas do INAMET & Satélite...
        </p>
        <span className="text-[10px] text-[#8BB174] font-mono">Boletim Meteorológico Oficial • Angola</span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-[#1E291B] text-[#E8EDDF] rounded-2xl p-5 sm:p-6 border border-[#2A3826] shadow-2xl space-y-5">
      {/* Optional Top Location Switcher Bar */}
      {showSelector && (
        <div className="space-y-3 pb-3 border-b border-[#2A3826]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[#131A11] p-1 rounded-xl border border-[#2A3826]">
              <button
                type="button"
                onClick={() => setSelectedRegionTab('angola')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  selectedRegionTab === 'angola'
                    ? 'bg-[#4B6344] text-white shadow-sm ring-1 ring-[#8BB174]'
                    : 'text-[#8BB174] hover:text-white'
                }`}
              >
                <span>🇦🇴 Províncias de Angola (INAMET)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegionTab('africa')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  selectedRegionTab === 'africa'
                    ? 'bg-[#4B6344] text-white shadow-sm ring-1 ring-[#8BB174]'
                    : 'text-[#8BB174] hover:text-white'
                }`}
              >
                <span>🌍 África & Pólos Agrícolas</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
            {(selectedRegionTab === 'angola' ? ANGOLA_LOCATIONS : AFRICA_LOCATIONS).map((loc) => {
              const isSelected =
                (presetLocation && presetLocation.id === loc.id) ||
                (!presetLocation && weather.location.toLowerCase().includes(loc.name.toLowerCase()));
              return (
                <button
                  key={loc.id}
                  onClick={() => onLocationChange && onLocationChange(loc)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-[#8BB174] text-[#1E291B] shadow-md'
                      : 'bg-[#2A3826] text-[#D0D7C9] hover:bg-[#384C33] hover:text-white border border-[#33422F]'
                  }`}
                >
                  <span>{loc.flag}</span>
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Header: Location & INAMET Station Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2A3826]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {isAngola ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#4B6344] text-white border border-[#8BB174]/40 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                DE ACORDO COM O INAMET • ANGOLA
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4B6344] text-[#E8EDDF] border border-[#8BB174]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                TEMPO REAL • {weather.country.toUpperCase()}
              </span>
            )}

            {currentAngolaPreset?.inemetStationCode && (
              <span className="text-[10px] text-[#A3B18A] font-mono bg-[#131A11] px-2 py-0.5 rounded-md border border-[#2A3826]">
                Estação: {currentAngolaPreset.inemetStationCode}
              </span>
            )}

            <span className="text-[10px] text-[#A3B18A] font-mono">
              GPS: {weather.latitude.toFixed(2)}°, {weather.longitude.toFixed(2)}°
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1 flex items-center gap-2">
            <span>{weather.location}</span>
            {currentAngolaPreset?.climateZone && (
              <span className="text-xs font-normal text-[#8BB174] bg-[#2A3826] px-2 py-0.5 rounded-full border border-[#33422F]">
                {currentAngolaPreset.climateZone}
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 bg-[#2A3826] hover:bg-[#384C33] text-[#8BB174] hover:text-white rounded-xl border border-[#33422F] transition-all"
            title="Atualizar dados do boletim INAMET"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="p-2.5 bg-[#2A3826] text-[#8BB174] rounded-xl border border-[#33422F]">
            {getWeatherIcon(weather.forecast[0]?.icon || 'sun-cloud', 'w-6 h-6')}
          </div>
        </div>
      </div>

      {/* Main Temperature & Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Big Temperature Display (5 cols) */}
        <div className="md:col-span-5 space-y-1">
          <div className="flex items-baseline space-x-3">
            <span className="text-5xl sm:text-6xl font-black font-display text-white tracking-tight">
              {weather.temperature}°C
            </span>
            {weather.apparentTemperature !== undefined && (
              <span className="text-xs font-semibold text-[#A3B18A]">
                Sensação {weather.apparentTemperature}°C
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-[#8BB174] flex items-center space-x-1.5">
            <span>{weather.condition}</span>
          </p>
        </div>

        {/* 4 Main Sensor Indicators (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          {/* Humidity */}
          <div className="bg-[#2A3826] p-2.5 rounded-xl border border-[#33422F]">
            <Droplets className="w-4 h-4 text-[#8BB174] mx-auto mb-1" />
            <span className="text-[10px] text-[#A3B18A] block font-medium">Umidade do Ar</span>
            <strong className="text-white text-sm font-black">{weather.humidity}%</strong>
          </div>

          {/* Rain / Precipitation */}
          <div className="bg-[#2A3826] p-2.5 rounded-xl border border-[#33422F]">
            <CloudRain className="w-4 h-4 text-sky-300 mx-auto mb-1" />
            <span className="text-[10px] text-[#A3B18A] block font-medium">Precipitação</span>
            <strong className="text-white text-sm font-black">{weather.precipitation}</strong>
          </div>

          {/* Wind Speed */}
          <div className="bg-[#2A3826] p-2.5 rounded-xl border border-[#33422F]">
            <Wind className="w-4 h-4 text-[#8BB174] mx-auto mb-1" />
            <span className="text-[10px] text-[#A3B18A] block font-medium">Velocidade Vento</span>
            <strong className="text-white text-sm font-black">{weather.windSpeed} km/h</strong>
          </div>

          {/* UV Index */}
          <div className="bg-[#2A3826] p-2.5 rounded-xl border border-[#33422F]">
            <SunMedium className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] text-[#A3B18A] block font-medium">Radiação UV</span>
            <strong className="text-white text-sm font-black">{weather.uvIndex || '6.5'}</strong>
          </div>
        </div>
      </div>

      {/* 7-Day Live Detailed Daily Forecast Row */}
      <div className="space-y-2 pt-3 border-t border-[#2A3826]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#A3B18A] uppercase tracking-wider block">
            Previsão Oficial dos Próximos 7 Dias (Padrão INAMET / OMM)
          </span>
          <span className="text-[10px] text-[#8BB174] font-medium">
            Atualizado às {weather.lastUpdated}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {weather.forecast.map((f, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl text-center border transition-all ${
                idx === 0
                  ? 'bg-[#2E3D2A] border-[#8BB174]/50 shadow-md ring-1 ring-[#8BB174]/30'
                  : 'bg-[#2A3826]/90 border-[#33422F] hover:bg-[#33422F]'
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                <span className={`text-[11px] font-bold block ${idx === 0 ? 'text-[#8BB174]' : 'text-[#E8EDDF]'}`}>
                  {f.day}
                </span>
              </div>

              <div className="my-1.5 flex justify-center">
                {getWeatherIcon(f.icon, 'w-5 h-5')}
              </div>

              {/* Rain Probability pill */}
              <div className="flex items-center justify-center space-x-1 text-[10px] text-sky-300 font-bold mb-1">
                <Droplets className="w-2.5 h-2.5" />
                <span>{f.rainProb}%</span>
              </div>

              {/* Temp Max / Min */}
              <div className="flex items-baseline justify-center space-x-1 text-xs">
                <span className="font-extrabold text-white">{f.tempMax}°</span>
                <span className="text-[10px] text-[#A3B18A]">{f.tempMin}°</span>
              </div>

              {/* Precip mm */}
              {f.precipitationSum > 0 && (
                <span className="text-[9px] text-sky-200 block font-mono mt-0.5">
                  {f.precipitationSum}mm
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Agro-Climatic Advisory Strip (Calibrated for Angola Agronomy) */}
      {weather.agriRecommendations && (
        <div className="bg-[#131A11] p-3.5 rounded-xl border border-[#2A3826] space-y-2 text-xs">
          <div className="flex items-center space-x-1.5 text-[#8BB174] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Boletim Agrometeorológico Regional para {weather.location}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#D0D7C9]">
            <div className="bg-[#1E291B] p-2.5 rounded-lg border border-[#2A3826]">
              <strong className="text-[#8BB174] block font-bold">🌱 Sementeira & Campanha Agrícola:</strong>
              <p className="leading-snug mt-1">{weather.agriRecommendations.planting}</p>
            </div>
            <div className="bg-[#1E291B] p-2.5 rounded-lg border border-[#2A3826]">
              <strong className="text-sky-300 block font-bold">💧 Manejo Hídrico & Irrigação:</strong>
              <p className="leading-snug mt-1">{weather.agriRecommendations.irrigation}</p>
            </div>
            <div className="bg-[#1E291B] p-2.5 rounded-lg border border-[#2A3826]">
              <strong className="text-amber-300 block font-bold">🐛 Alerta Fitossanitário & Pragas:</strong>
              <p className="leading-snug mt-1">{weather.agriRecommendations.pestRisk}</p>
            </div>
            <div className="bg-[#1E291B] p-2.5 rounded-lg border border-[#2A3826]">
              <strong className="text-emerald-300 block font-bold">🚜 Janela de Pulverização:</strong>
              <p className="leading-snug mt-1">{weather.agriRecommendations.sprayCondition}</p>
            </div>
          </div>
        </div>
      )}

      {/* Official INAMET Attribution & Satellites notice */}
      <div className="text-[10px] text-[#A3B18A] flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#2A3826]">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-[#8BB174] shrink-0" />
          <span>{weather.notice}</span>
        </div>
        <div className="flex items-center space-x-2 text-[9px] text-[#8BB174] font-mono">
          <span>INAMET (Angola)</span>
          <span>•</span>
          <span>OMM / WMO</span>
          <span>•</span>
          <span>ECMWF</span>
        </div>
      </div>
    </div>
  );
};
