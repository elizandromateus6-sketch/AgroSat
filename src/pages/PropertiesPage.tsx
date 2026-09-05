import React, { useState, useEffect } from 'react';
import { Farm, Coordinates } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Modal } from '../components/Modal';
import { FarmMapSelector, ANGOLA_PROVINCES_COORDS } from '../components/FarmMapSelector';
import {
  ANGOLA_MUNICIPALITIES,
  ANGOLA_21_PROVINCES,
  ANGOLA_PROVINCES_CONFIG,
} from '../data/angolaLocations';
import { farmService } from '../services/farmService';
import {
  MapPin,
  Plus,
  Sprout,
  Calendar,
  Droplet,
  FileText,
  CheckCircle2,
  Map,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Globe,
  Building2,
  Search,
  Sparkles,
  Flag
} from 'lucide-react';

interface PropertiesPageProps {
  farms: Farm[];
  onSelectFarm: (farmId: string) => void;
  onRefreshFarms: () => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  farms,
  onSelectFarm,
  onRefreshFarms,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State
  const [name, setName] = useState('');
  const [province, setProvince] = useState('Huambo');
  const [municipality, setMunicipality] = useState('Caála');
  const [totalArea, setTotalArea] = useState<number>(20);
  const [mainCrop, setMainCrop] = useState('Milho');
  const [plantingDate, setPlantingDate] = useState('2025-11-15');
  const [irrigationType, setIrrigationType] = useState<Farm['irrigationType']>('Sequeiro (Chuva)');
  const [notes, setNotes] = useState('');

  // Map Coordinates & Polygon State
  const [centerCoords, setCenterCoords] = useState<Coordinates>(
    ANGOLA_PROVINCES_COORDS['Huambo'] || { lat: -12.7761, lng: 15.7392 }
  );
  const [polygon, setPolygon] = useState<Coordinates[]>([]);

  // Municipalities for selected province
  const availableMunicipalities = ANGOLA_MUNICIPALITIES.filter(
    (m) => m.province.toLowerCase() === province.toLowerCase()
  );

  // Update center coords when province changes or municipality changes
  useEffect(() => {
    // Check if municipality matches
    const matchedMun = ANGOLA_MUNICIPALITIES.find(
      (m) =>
        m.province.toLowerCase() === province.toLowerCase() &&
        m.name.toLowerCase().includes(municipality.toLowerCase())
    );

    const coords = matchedMun
      ? { lat: matchedMun.lat, lng: matchedMun.lng }
      : ANGOLA_PROVINCES_COORDS[province] || { lat: -12.7761, lng: 15.7392 };

    setCenterCoords(coords);

    // Generate initial square polygon
    const delta = 0.003;
    setPolygon([
      { lat: coords.lat - delta, lng: coords.lng - delta },
      { lat: coords.lat - delta, lng: coords.lng + delta },
      { lat: coords.lat + delta, lng: coords.lng + delta },
      { lat: coords.lat + delta, lng: coords.lng - delta },
    ]);
  }, [province, municipality]);

  // When province changes, update default municipality to first of list
  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince);
    const muns = ANGOLA_MUNICIPALITIES.filter(
      (m) => m.province.toLowerCase() === newProvince.toLowerCase()
    );
    if (muns.length > 0) {
      setMunicipality(muns[0].name);
    } else {
      setMunicipality('');
    }
  };

  const angolaProvinces = ANGOLA_21_PROVINCES;

  const cropOptions = [
    'Milho',
    'Mandioca',
    'Feijão',
    'Batata-rena',
    'Batata-doce',
    'Café Robusta',
    'Café Arábica',
    'Algodão',
    'Trigo',
    'Soja',
    'Hortaliças Diversas',
    'Banana',
    'Abacaxi',
  ];

  const handleOpenModal = () => {
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleLocationChange = (newCenter: Coordinates, newPoly: Coordinates[]) => {
    setCenterCoords(newCenter);
    setPolygon(newPoly);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCurrentStep(2);
  };

  const handleSubmitNewFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Fallback polygon if empty
    const finalPolygon =
      polygon.length >= 3
        ? polygon
        : [
            { lat: centerCoords.lat - 0.003, lng: centerCoords.lng - 0.003 },
            { lat: centerCoords.lat - 0.003, lng: centerCoords.lng + 0.003 },
            { lat: centerCoords.lat + 0.003, lng: centerCoords.lng + 0.003 },
            { lat: centerCoords.lat + 0.003, lng: centerCoords.lng - 0.003 },
          ];

    farmService.addFarm({
      userId: 'usr_001',
      name: name.trim(),
      locationName: municipality.trim() ? `${municipality.trim()}, ${province}` : province,
      province,
      totalArea: Number(totalArea),
      mainCrop,
      plantingDate,
      irrigationType,
      notes: notes.trim(),
      centerCoords,
      polygon: finalPolygon,
    });

    // Reset Form & Close
    setName('');
    setMunicipality('Caála');
    setNotes('');
    setCurrentStep(1);
    setIsModalOpen(false);
    onRefreshFarms();
  };

  const handleDeleteFarm = (farmId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta propriedade agrícola?')) {
      farmService.deleteFarm(farmId);
      onRefreshFarms();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#4B6344]/10 text-[#4B6344] rounded-xl border border-[#4B6344]/20">
              <MapPin className="w-5 h-5 text-[#4B6344]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">Propriedades Agrícolas</h1>
          </div>
          <p className="text-xs text-[#6B705C] pl-0.5">
            Cadastre e gerencie suas terras, roças e machambas monitoradas por satélite com localizador fácil.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-5 py-2.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registar Nova Propriedade</span>
        </button>
      </div>

      {/* Properties Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <PropertyCard
            key={farm.id}
            farm={farm}
            onSelect={onSelectFarm}
            onDelete={handleDeleteFarm}
          />
        ))}
      </div>

      {/* Registration Modal with Step Wizard & Interactive Map */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registar Nova Propriedade Agrícola"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-5">
          {/* Step Indicator Bar */}
          <div className="flex items-center justify-between bg-[#F7F8F3] p-1.5 rounded-2xl border border-[#E0E2D9]">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-[#1E291B] text-white shadow-sm'
                  : 'text-[#6B705C] hover:text-[#1E291B]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#4B6344] text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>1. Dados & Localização Base</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (name.trim()) setCurrentStep(2);
              }}
              disabled={!name.trim()}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-[#1E291B] text-white shadow-sm'
                  : !name.trim()
                  ? 'text-[#CCD0C2] cursor-not-allowed'
                  : 'text-[#6B705C] hover:text-[#1E291B]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#8BB174] text-[#1E291B] flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>2. Localizador & Talhão no Satélite</span>
            </button>
          </div>

          {/* Step 1: General Form Fields */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4 text-xs">
              <div>
                <label htmlFor="farm-name-input" className="block font-bold text-[#1E291B] mb-1">
                  Nome da Propriedade / Fazenda *
                </label>
                <input
                  id="farm-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Machamba do Caála, Fazenda do Planalto, Roça Waku Kungo..."
                  className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#4B6344] focus:bg-white outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="farm-province-select" className="block font-bold text-[#1E291B]">
                      Província de Angola (21 Províncias - Nova DPA) *
                    </label>
                  </div>
                  <select
                    id="farm-province-select"
                    value={province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#4B6344] focus:bg-white cursor-pointer outline-none font-medium"
                  >
                    {angolaProvinces.map((p) => {
                      const cfg = ANGOLA_PROVINCES_CONFIG[p];
                      return (
                        <option key={p} value={p}>
                          📍 {p} {cfg?.isNewProvince ? '(Nova DPA)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  {ANGOLA_PROVINCES_CONFIG[province] && (
                    <p className="text-[10px] text-[#4B6344] mt-1 font-medium leading-tight">
                      🌾 <span className="font-bold">{province}:</span> {ANGOLA_PROVINCES_CONFIG[province].agriculturalFocus}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="farm-municipality-select" className="block font-bold text-[#1E291B] mb-1">
                    Município / Polo Agrícola *
                  </label>
                  {availableMunicipalities.length > 0 ? (
                    <select
                      id="farm-municipality-select"
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#4B6344] focus:bg-white cursor-pointer outline-none font-medium"
                    >
                      {availableMunicipalities.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.type === 'capital' ? '⭐' : m.type === 'polo_agricola' ? '🌾' : '🏛️'} {m.name} {m.isNewDPA ? '(Novo DPA)' : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="farm-municipality-select"
                      type="text"
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      placeholder="Ex: Caála, Bailundo, Matala, Sumbe..."
                      className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#4B6344] focus:bg-white outline-none font-medium"
                    />
                  )}
                  <p className="text-[10px] text-[#6B705C] mt-1">
                    💡 O mapa abrirá diretamente no polo selecionado.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="farm-area-input" className="block font-bold text-[#1E291B] mb-1">
                    Área Estimada (Hectares - ha) *
                  </label>
                  <input
                    id="farm-area-input"
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={totalArea}
                    onChange={(e) => setTotalArea(Number(e.target.value))}
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#4B6344] focus:bg-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="farm-crop-select" className="block font-bold text-[#1E291B] mb-1">
                    Cultura Principal *
                  </label>
                  <select
                    id="farm-crop-select"
                    value={mainCrop}
                    onChange={(e) => setMainCrop(e.target.value)}
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#4B6344] focus:bg-white cursor-pointer outline-none font-medium"
                  >
                    {cropOptions.map((c) => (
                      <option key={c} value={c}>
                        🌱 {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="farm-planting-date" className="block font-bold text-[#1E291B] mb-1">
                    Data do Plantio *
                  </label>
                  <input
                    id="farm-planting-date"
                    type="date"
                    required
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#4B6344] focus:bg-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="farm-irrigation-select" className="block font-bold text-[#1E291B] mb-1">
                    Sistema de Irrigação *
                  </label>
                  <select
                    id="farm-irrigation-select"
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#4B6344] focus:bg-white cursor-pointer outline-none font-medium"
                  >
                    <option value="Sequeiro (Chuva)">🌧️ Sequeiro (Chuva)</option>
                    <option value="Gotejamento">💧 Gotejamento</option>
                    <option value="Aspersão">💦 Aspersão</option>
                    <option value="Pivot Central">🔄 Pivot Central</option>
                    <option value="Manual">🪣 Manual / Balde</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="farm-notes-textarea" className="block font-bold text-[#1E291B] mb-1">
                  Observações Adicionais
                </label>
                <textarea
                  id="farm-notes-textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Histórico prévio de adubação, qualidade do solo, pragas observadas..."
                  className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#4B6344] focus:bg-white outline-none font-medium"
                />
              </div>

              <div className="pt-3 flex justify-between items-center border-t border-[#E0E2D9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F0F2EB] hover:bg-[#E0E2D9] text-[#1E291B] font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white font-bold rounded-xl text-xs shadow-md flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Avançar para o Mapa Satélite</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Interactive Map Field / Farm Demarcation */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F0F2EB] p-3 rounded-2xl border border-[#CCD0C2]">
                <div>
                  <h4 className="font-bold text-sm text-[#1E291B] font-display flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-[#4B6344]" />
                    <span>Localizar & Demarcar no Satélite</span>
                  </h4>
                  <p className="text-[11px] text-[#6B705C] mt-0.5">
                    Fazenda: <strong className="text-[#1E291B]">{name}</strong> | Município: <strong className="text-[#1E291B]">{municipality} ({province})</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-[#CCD0C2] shadow-sm">
                  <span className="text-[11px] text-[#6B705C]">Área do Talhão:</span>
                  <span className="font-bold text-sm text-[#4B6344]">{totalArea} ha</span>
                </div>
              </div>

              {/* Map Component with Auto-focus to chosen Municipality */}
              <FarmMapSelector
                province={province}
                totalArea={totalArea}
                centerCoords={centerCoords}
                polygon={polygon}
                initialMunicipality={municipality}
                onLocationChange={handleLocationChange}
                onAreaCalculated={(areaHa) => {
                  if (areaHa > 0) {
                    setTotalArea(areaHa);
                  }
                }}
                farmName={name}
                cropName={mainCrop}
              />

              {/* Bottom Actions */}
              <div className="pt-3 flex justify-between items-center border-t border-[#E0E2D9]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 bg-[#F0F2EB] hover:bg-[#E0E2D9] text-[#1E291B] font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar aos Dados</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitNewFarm}
                  className="px-6 py-2.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white font-bold rounded-xl text-xs shadow-md flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Concluir & Salvar Propriedade no AgroSat</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
