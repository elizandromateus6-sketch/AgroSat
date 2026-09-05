import React from 'react';
import { Farm } from '../types';
import { getNdviClassification } from '../services/satelliteService';
import { MapPin, Sprout, Droplet, ArrowRight, Trash2, Calendar } from 'lucide-react';

interface PropertyCardProps {
  farm: Farm;
  onSelect: (farmId: string) => void;
  onDelete?: (farmId: string) => void;
  isSelected?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  farm,
  onSelect,
  onDelete,
  isSelected,
}) => {
  const farmNdvi = farm.id === 'farm_001' ? 0.78 : farm.id === 'farm_002' ? 0.54 : 0.79;
  const ndviMeta = getNdviClassification(farmNdvi);

  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all ${
        isSelected
          ? 'border-[#4B6344] ring-2 ring-[#4B6344]/20 shadow-md'
          : 'border-[#E0E2D9] hover:border-[#8BB174] shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#F0F2EB]">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-[#6B705C] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#4B6344]" />
            <span>{farm.locationName}</span>
          </div>
          <h3 className="text-base font-bold text-[#1E291B] mt-0.5 font-display">{farm.name}</h3>
        </div>

        {/* NDVI Pill */}
        <div
          className="px-2.5 py-1 rounded-xl text-xs font-bold text-white shadow-sm flex items-center space-x-1"
          style={{ backgroundColor: ndviMeta.colorHex }}
        >
          <span>NDVI</span>
          <span>{farmNdvi.toFixed(2)}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 py-3 text-xs">
        <div>
          <span className="text-[#6B705C] block">Área da Propriedade:</span>
          <strong className="text-[#1E291B] text-sm">{farm.totalArea} ha</strong>
        </div>

        <div>
          <span className="text-[#6B705C] block">Cultura Principal:</span>
          <div className="flex items-center space-x-1 text-[#1E291B] font-bold text-sm">
            <Sprout className="w-3.5 h-3.5 text-[#4B6344]" />
            <span>{farm.mainCrop}</span>
          </div>
        </div>

        <div>
          <span className="text-[#6B705C] block">Sistema de Irrigação:</span>
          <div className="flex items-center space-x-1 text-[#2D3628] font-medium mt-0.5">
            <Droplet className="w-3.5 h-3.5 text-sky-600" />
            <span>{farm.irrigationType}</span>
          </div>
        </div>

        <div>
          <span className="text-[#6B705C] block">Data de Plantio:</span>
          <div className="flex items-center space-x-1 text-[#2D3628] font-medium mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#8BB174]" />
            <span>{farm.plantingDate}</span>
          </div>
        </div>
      </div>

      {farm.notes && (
        <p className="text-[11px] text-[#6B705C] bg-[#F0F2EB] p-2.5 rounded-xl border border-[#E0E2D9] italic line-clamp-2">
          "{farm.notes}"
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#F0F2EB]">
        <button
          onClick={() => onSelect(farm.id)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#4B6344] text-white hover:bg-[#3B4E35] transition-colors shadow-sm"
        >
          <span>Monitorar no Mapa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(farm.id)}
            className="p-2 text-[#6B705C] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Excluir propriedade"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
