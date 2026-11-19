import React from 'react';
import { LucideIcon, Sprout, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Sprout,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-[#E0E2D9] rounded-2xl p-10 text-center max-w-lg mx-auto shadow-sm my-6">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EAF0E6] text-[#3D5237] flex items-center justify-center mb-4 border border-[#CCD7C5]">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[#1E291B] mb-2">{title}</h3>
      <p className="text-xs text-[#525B4C] leading-relaxed mb-6 max-w-md mx-auto">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 bg-[#2E3F2A] hover:bg-[#3D5237] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="inline-flex items-center space-x-2 bg-[#F4F6EE] hover:bg-[#E9ECE0] text-[#2E3F2A] border border-[#CCD0C2] px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>{secondaryActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
