import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/90 border border-[#E0E2D9] rounded-2xl p-5 space-y-4 animate-pulse shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-[#E5E8DD] rounded w-2/3"></div>
            <div className="h-5 bg-[#E5E8DD] rounded-full w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-[#EEF1E6] rounded w-1/2"></div>
            <div className="h-3 bg-[#EEF1E6] rounded w-3/4"></div>
          </div>
          <div className="pt-3 border-t border-[#EDF0E7] flex justify-between">
            <div className="h-3 bg-[#E5E8DD] rounded w-1/4"></div>
            <div className="h-3 bg-[#E5E8DD] rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white/90 border border-[#E0E2D9] rounded-2xl p-6 animate-pulse space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-[#E5E8DD] rounded w-1/3"></div>
        <div className="h-4 bg-[#EEF1E6] rounded w-24"></div>
      </div>
      <div className="h-64 bg-[#F2F4EB] rounded-xl flex items-end p-4 space-x-3">
        <div className="h-1/3 bg-[#D9DEC9] rounded w-full"></div>
        <div className="h-1/2 bg-[#D9DEC9] rounded w-full"></div>
        <div className="h-2/3 bg-[#D9DEC9] rounded w-full"></div>
        <div className="h-3/4 bg-[#D9DEC9] rounded w-full"></div>
        <div className="h-4/5 bg-[#D9DEC9] rounded w-full"></div>
        <div className="h-3/5 bg-[#D9DEC9] rounded w-full"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="bg-white/90 border border-[#E0E2D9] rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-12 bg-[#EEF1E6] border-b border-[#E0E2D9]"></div>
      <div className="divide-y divide-[#EEF1E6]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between space-x-4">
            <div className="h-4 bg-[#E5E8DD] rounded w-1/4"></div>
            <div className="h-4 bg-[#EEF1E6] rounded w-1/6"></div>
            <div className="h-4 bg-[#EEF1E6] rounded w-1/6"></div>
            <div className="h-4 bg-[#E5E8DD] rounded w-1/8"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
