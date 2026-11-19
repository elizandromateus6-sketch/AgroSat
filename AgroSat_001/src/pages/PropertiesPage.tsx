import React, { useState, useEffect } from 'react';
import { Farm, Coordinates, FarmHealthStatus } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { FarmMapSelector, ANGOLA_PROVINCES_COORDS } from '../components/FarmMapSelector';
import {
  ANGOLA_MUNICIPALITIES,
  ANGOLA_21_PROVINCES,
} from '../data/angolaLocations';
import { farmService } from '../services/farmService';
import { farmSchema } from '../schemas/farm.schema';
import {
  MapPin,
  Plus,
  Sprout,
  Calendar,
  Droplet,
  FileText,
  Map,
  ArrowRight,
  ArrowLeft,
  Search,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
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
  const [editingFarmId, setEditingFarmId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCrop, setFilterCrop] = useState('all');

  // Form State
  const [name, setName] = useState('');
  const [province, setProvince] = useState('Huambo');
  const [municipality, setMunicipality] = useState('Caála');
  const [totalArea, setTotalArea] = useState<number>(42);
  const [mainCrop, setMainCrop] = useState('Milho');
  const [variety, setVariety] = useState('ZM 523 (Matuba)');
  const [status, setStatus] = useState<FarmHealthStatus>('Bom');
  const [plantingDate, setPlantingDate] = useState('2025-11-15');
  const [irrigationType, setIrrigationType] = useState<Farm['irrigationType']>('Sequeiro (Chuva)');
  const [notes, setNotes] = useState('');

  // Map Coordinates & Polygon State
  const [centerCoords, setCenterCoords] = useState<Coordinates>(
    ANGOLA_PROVINCES_COORDS['Huambo'] || { lat: -12.7761, lng: 15.7392 }
  );
  const [polygon, setPolygon] = useState<Coordinates[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  // Municipalities for selected province
  const availableMunicipalities = ANGOLA_MUNICIPALITIES.filter(
    (m) => m.province.toLowerCase() === province.toLowerCase()
  );

  // Update center coords when province/municipality changes (only if not editing polygon manually)
  useEffect(() => {
    if (!isModalOpen || currentStep === 2) return;

    const matchedMun = ANGOLA_MUNICIPALITIES.find(
      (m) =>
        m.province.toLowerCase() === province.toLowerCase() &&
        m.name.toLowerCase().includes(municipality.toLowerCase())
    );

    const coords = matchedMun
      ? { lat: matchedMun.lat, lng: matchedMun.lng }
      : ANGOLA_PROVINCES_COORDS[province] || { lat: -12.7761, lng: 15.7392 };

    setCenterCoords(coords);

    const delta = 0.003;
    setPolygon([
      { lat: coords.lat - delta, lng: coords.lng - delta },
      { lat: coords.lat - delta, lng: coords.lng + delta },
      { lat: coords.lat + delta, lng: coords.lng + delta },
      { lat: coords.lat + delta, lng: coords.lng - delta },
    ]);
  }, [province, municipality, isModalOpen, currentStep]);

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

  const handleOpenAddModal = () => {
    setEditingFarmId(null);
    setName('');
    setProvince('Huambo');
    setMunicipality('Caála');
    setTotalArea(42);
    setMainCrop('Milho');
    setVariety('ZM 523 (Matuba)');
    setStatus('Bom');
    setPlantingDate('2025-11-15');
    setIrrigationType('Sequeiro (Chuva)');
    setNotes('');
    setFormErrors({});
    setGeneralError('');
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (farm: Farm) => {
    setEditingFarmId(farm.id);
    setName(farm.name);
    setProvince(farm.province);
    setMunicipality(farm.municipality || farm.locationName.split(',')[0].trim());
    setTotalArea(farm.totalArea);
    setMainCrop(farm.mainCrop);
    setVariety(farm.variety || '');
    setStatus(farm.status || 'Bom');
    setPlantingDate(farm.plantingDate);
    setIrrigationType(farm.irrigationType);
    setNotes(farm.notes || '');
    setCenterCoords(farm.centerCoords);
    setPolygon(farm.polygon);
    setFormErrors({});
    setGeneralError('');
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralError('');

    const validation = farmSchema.safeParse({
      name: name.trim(),
      province,
      municipality: municipality.trim() || 'Principal',
      totalArea: Number(totalArea),
      mainCrop,
      variety: variety.trim() || undefined,
      status,
      plantingDate,
      irrigationType,
      notes: notes.trim() || undefined,
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setCurrentStep(2);
  };

  const handleSubmitFarm = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const finalPolygon =
      polygon.length >= 3
        ? polygon
        : [
            { lat: centerCoords.lat - 0.003, lng: centerCoords.lng - 0.003 },
            { lat: centerCoords.lat - 0.003, lng: centerCoords.lng + 0.003 },
            { lat: centerCoords.lat + 0.003, lng: centerCoords.lng + 0.003 },
            { lat: centerCoords.lat + 0.003, lng: centerCoords.lng - 0.003 },
          ];

    try {
      if (editingFarmId) {
        farmService.updateFarm(editingFarmId, {
          name: name.trim(),
          locationName: municipality.trim() ? `${municipality.trim()}, ${province}` : province,
          province,
          municipality: municipality.trim(),
          totalArea: Number(totalArea),
          mainCrop,
          variety: variety.trim(),
          status,
          plantingDate,
          irrigationType,
          notes: notes.trim(),
          centerCoords,
          polygon: finalPolygon,
        });
      } else {
        farmService.addFarm({
          userId: 'usr_001',
          name: name.trim(),
          locationName: municipality.trim() ? `${municipality.trim()}, ${province}` : province,
          province,
          municipality: municipality.trim(),
          totalArea: Number(totalArea),
          mainCrop,
          variety: variety.trim(),
          status,
          currentNdvi: 0.72,
          plantingDate,
          irrigationType,
          notes: notes.trim(),
          centerCoords,
          polygon: finalPolygon,
        });
      }

      setIsModalOpen(false);
      onRefreshFarms();
    } catch {
      setGeneralError('Erro ao guardar a propriedade. Tente novamente.');
    }
  };

  const handleDeleteFarm = (farmId: string) => {
    if (window.confirm('Tem certeza de que pretende eliminar esta propriedade agrícola do sistema?')) {
      farmService.deleteFarm(farmId);
      onRefreshFarms();
    }
  };

  // Filtered Farms
  const filteredFarms = farms.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.variety && f.variety.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCrop = filterCrop === 'all' || f.mainCrop === filterCrop;

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#2E3F2A]/10 text-[#2E3F2A] rounded-xl border border-[#2E3F2A]/20">
              <MapPin className="w-5 h-5 text-[#2E3F2A]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">Propriedades Agrícolas</h1>
          </div>
          <p className="text-xs text-[#525B4C] pl-0.5">
            Cadastre, edite e acompanhe os limites geoespaciais e a saúde das suas fazendas monitoradas por satélite.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center space-x-2 bg-[#2E3F2A] hover:bg-[#3D5237] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Propriedade</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-[#E0E2D9] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6B705C] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Pesquisar por nome, localização ou cultivar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-[#525B4C] whitespace-nowrap">Filtrar Cultura:</span>
          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3 py-2 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] cursor-pointer outline-none font-medium w-full sm:w-auto"
          >
            <option value="all">Todas as Culturas ({farms.length})</option>
            {cropOptions.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Farms or Empty State */}
      {filteredFarms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFarms.map((farm) => (
            <PropertyCard
              key={farm.id}
              farm={farm}
              onSelect={onSelectFarm}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteFarm}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchQuery ? 'Nenhuma propriedade encontrada' : 'Ainda não existem propriedades monitorizadas.'}
          description={
            searchQuery
              ? 'Não foram encontrados talhões com os critérios de pesquisa introduzidos. Tente limpar os filtros.'
              : 'Cadastre a sua primeira fazenda ou machamba para começar a monitorizar o índice NDVI e receber análises de satélite.'
          }
          actionLabel="+ Adicionar Propriedade"
          onAction={handleOpenAddModal}
          secondaryActionLabel={searchQuery ? 'Limpar Pesquisa' : undefined}
          onSecondaryAction={() => {
            setSearchQuery('');
            setFilterCrop('all');
          }}
        />
      )}

      {/* Modal: Adicionar ou Editar Propriedade (Passo 1: Dados / Passo 2: Mapa) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFarmId ? 'Editar Propriedade Agrícola' : 'Cadastrar Nova Propriedade'}
        size="lg"
      >
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-xs font-semibold mb-4">
            <span
              className={`px-3 py-1 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'bg-[#2E3F2A] text-white'
                  : 'bg-[#F2F4EB] text-[#556050]'
              }`}
            >
              1. Dados Agronómicos
            </span>
            <span className="text-[#888]">→</span>
            <span
              className={`px-3 py-1 rounded-lg transition-colors ${
                currentStep === 2
                  ? 'bg-[#2E3F2A] text-white'
                  : 'bg-[#F2F4EB] text-[#556050]'
              }`}
            >
              2. Delimitação Geoespacial
            </span>
          </div>

          {generalError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Passo 1: Formulário */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4 text-xs">
              <div>
                <label htmlFor="farm-name-input" className="block font-bold text-[#1E291B] mb-1">
                  Nome da Propriedade / Fazenda *
                </label>
                <input
                  id="farm-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Fazenda Esperança"
                  className={`w-full bg-[#F7F8F3] border rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white outline-none ${
                    formErrors.name ? 'border-red-400 bg-red-50/50' : 'border-[#CCD0C2]'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="farm-province-select" className="block font-bold text-[#1E291B] mb-1">
                    Província de Angola *
                  </label>
                  <select
                    id="farm-province-select"
                    value={province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white cursor-pointer outline-none font-medium"
                  >
                    {ANGOLA_21_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
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
                      className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white cursor-pointer outline-none font-medium"
                    >
                      {availableMunicipalities.map((mun) => (
                        <option key={mun.name} value={mun.name}>
                          {mun.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="farm-municipality-select"
                      type="text"
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      placeholder="Ex: Caála"
                      className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white outline-none"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="farm-area-input" className="block font-bold text-[#1E291B] mb-1">
                    Área (Hectares) *
                  </label>
                  <input
                    id="farm-area-input"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={totalArea}
                    onChange={(e) => setTotalArea(Number(e.target.value))}
                    className={`w-full bg-[#F7F8F3] border rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white outline-none ${
                      formErrors.totalArea ? 'border-red-400 bg-red-50/50' : 'border-[#CCD0C2]'
                    }`}
                  />
                  {formErrors.totalArea && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.totalArea}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="farm-crop-select" className="block font-bold text-[#1E291B] mb-1">
                    Cultura Principal *
                  </label>
                  <select
                    id="farm-crop-select"
                    value={mainCrop}
                    onChange={(e) => setMainCrop(e.target.value)}
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white cursor-pointer outline-none font-medium"
                  >
                    {cropOptions.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="farm-variety-input" className="block font-bold text-[#1E291B] mb-1">
                    Variedade / Cultivar
                  </label>
                  <input
                    id="farm-variety-input"
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="Ex: ZM 523, Matuba"
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="farm-status-select" className="block font-bold text-[#1E291B] mb-1">
                    Estado da Cultura
                  </label>
                  <select
                    id="farm-status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as FarmHealthStatus)}
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white cursor-pointer outline-none font-medium"
                  >
                    <option value="Excelente">🟢 Excelente</option>
                    <option value="Bom">🟡 Bom</option>
                    <option value="Atenção">🟠 Atenção</option>
                    <option value="Crítico">🔴 Crítico</option>
                  </select>
                </div>

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
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white outline-none"
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
                    className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white cursor-pointer outline-none font-medium"
                  >
                    <option value="Sequeiro (Chuva)">Sequeiro (Dependente de Chuva)</option>
                    <option value="Pivot Central">Pivot Central</option>
                    <option value="Gotejamento">Gotejamento</option>
                    <option value="Aspersão">Aspersão</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="farm-notes-textarea" className="block font-bold text-[#1E291B] mb-1">
                  Observações e Histórico da Parcela
                </label>
                <textarea
                  id="farm-notes-textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Solo corrigido com calcário dolomítico, ciclo de rotação com feijão mantido em bom vigor."
                  className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl p-3 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#EDF0E7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#CCD0C2] text-[#556050] font-semibold hover:bg-[#F2F4EB] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#2E3F2A] hover:bg-[#3D5237] text-white font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <span>Avançar para o Mapa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Passo 2: Localização e Polígono no Mapa */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="bg-[#F5F8F2] border border-[#CCD8C4] rounded-xl p-3 flex items-start space-x-2.5 text-[#2B3B27]">
                <MapPin className="w-4 h-4 text-[#3D5237] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1E291B]">Ajuste a localização da propriedade:</strong>
                  <p className="text-[11px] text-[#556050] mt-0.5">
                    Arraste o marcador central ou os vértices do polígono para delimitar com precisão o talhão em <strong>{province}</strong>.
                  </p>
                </div>
              </div>

              <FarmMapSelector
                centerCoords={centerCoords}
                polygon={polygon}
                onLocationChange={(newCenter, newPoly) => {
                  setCenterCoords(newCenter);
                  setPolygon(newPoly);
                }}
              />

              <div className="flex items-center justify-between pt-3 border-t border-[#EDF0E7]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-[#CCD0C2] text-[#556050] font-semibold hover:bg-[#F2F4EB] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar aos Dados</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitFarm}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#2E3F2A] hover:bg-[#3D5237] text-white font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingFarmId ? 'Guardar Alterações' : 'Concluir Registo'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
