import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'emerald' | 'blue' | 'amber' | 'purple';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'emerald',
}) => {
  const getColorStyles = () => {
    switch (colorScheme) {
      case 'blue':
        return 'bg-[#F0F2EB] text-[#33422F] border-[#E0E2D9]';
      case 'amber':
        return 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]';
      case 'purple':
        return 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]';
      case 'emerald':
      default:
        return 'bg-[#DDE5B6] text-[#1E291B] border-[#8BB174]/40';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E0E2D9] shadow-sm space-y-2 hover:border-[#8BB174] transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B705C] uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl border ${getColorStyles()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-extrabold font-display text-[#1E291B]">{value}</span>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trend.isPositive ? 'bg-[#DDE5B6] text-[#1E291B]' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-[#6B705C]">{subtitle}</p>}
    </div>
  );
};
