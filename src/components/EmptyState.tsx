import React from 'react';
import { LucideIcon, Sprout } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Sprout,
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3 shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-slate-800 text-base font-display">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
