import React from 'react';
import { Farm } from '../types';
import { interpretNdvi, formatNdvi } from '../utils/ndviUtils';
import { MapPin, Sprout, Droplet, ArrowRight, Trash2, Calendar, Edit3, ShieldCheck, Tag } from 'lucide-react';

interface PropertyCardProps {
  farm: Farm;
  onSelect: (farmId: string) => void;
  onEdit?: (farm: Farm) => void;
  onDelete?: (farmId: string) => void;
  isSelected?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  farm,
  onSelect,
  onEdit,
  onDelete,
  isSelected,
}) => {
  const farmNdvi =
    farm.currentNdvi !== undefined
      ? farm.currentNdvi
      : farm.id === 'farm_001'
      ? 0.78
      : farm.id === 'farm_002'
      ? 0.54
      : farm.id === 'farm_003'
      ? 0.72
      : 0.68;

  const ndviInfo = interpretNdvi(farmNdvi);
  const status = farm.status || (farmNdvi > 0.65 ? 'Excelente' : farmNdvi > 0.45 ? 'Bom' : 'Atenção');

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm rounded-2xl p-5 border transition-all ${
        isSelected
          ? 'border-[#2E3F2A] ring-2 ring-[#2E3F2A]/20 shadow-md'
          : 'border-[#E0E2D9] hover:border-[#8BB174] shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#F0F2EB]">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-[#6B705C] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#3D5237]" />
            <span>{farm.locationName}</span>
          </div>
          <h3 className="text-base font-bold text-[#1E291B] mt-0.5 font-display">{farm.name}</h3>
        </div>

        {/* Status + NDVI Badges */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F2F4EB] text-[#2E3F2A] border border-[#CCD0C2] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#3D5237]" />
            <span>{status}</span>
          </span>

          <div
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-white shadow-sm flex items-center space-x-1"
            style={{ backgroundColor: ndviInfo.color }}
            title={ndviInfo.label}
          >
            <span>NDVI</span>
            <span>{formatNdvi(farmNdvi)}</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 py-3 text-xs">
        <div>
          <span className="text-[#6B705C] block text-[11px]">Área da Propriedade:</span>
          <strong className="text-[#1E291B] text-sm font-bold">{farm.totalArea} hectares</strong>
        </div>

        <div>
          <span className="text-[#6B705C] block text-[11px]">Cultura Principal:</span>
          <div className="flex items-center space-x-1 text-[#1E291B] font-bold text-sm">
            <Sprout className="w-3.5 h-3.5 text-[#3D5237]" />
            <span>{farm.mainCrop}</span>
          </div>
        </div>

        {farm.variety && (
          <div>
            <span className="text-[#6B705C] block text-[11px]">Variedade / Cultivar:</span>
            <div className="flex items-center space-x-1 text-[#2D3628] font-semibold mt-0.5">
              <Tag className="w-3 h-3 text-[#3D5237]" />
              <span>{farm.variety}</span>
            </div>
          </div>
        )}

        <div>
          <span className="text-[#6B705C] block text-[11px]">Sistema de Irrigação:</span>
          <div className="flex items-center space-x-1 text-[#2D3628] font-medium mt-0.5">
            <Droplet className="w-3.5 h-3.5 text-sky-700" />
            <span>{farm.irrigationType}</span>
          </div>
        </div>

        <div>
          <span className="text-[#6B705C] block text-[11px]">Data de Plantio:</span>
          <div className="flex items-center space-x-1 text-[#2D3628] font-medium mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#3D5237]" />
            <span>{farm.plantingDate}</span>
          </div>
        </div>
      </div>

      {farm.notes && (
        <p className="text-[11px] text-[#556050] bg-[#F7F8F3] p-2.5 rounded-xl border border-[#E0E2D9] italic line-clamp-2 mt-1">
          "{farm.notes}"
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#F0F2EB]">
        <button
          onClick={() => onSelect(farm.id)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2E3F2A] hover:bg-[#3D5237] text-white transition-colors shadow-sm cursor-pointer"
        >
          <span>Monitorar no Mapa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center space-x-1">
          {onEdit && (
            <button
              onClick={() => onEdit(farm)}
              className="p-2 text-[#556050] hover:text-[#1E291B] hover:bg-[#F2F4EB] rounded-xl transition-colors cursor-pointer"
              title="Editar dados da propriedade"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(farm.id)}
              className="p-2 text-[#888] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Excluir propriedade"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
