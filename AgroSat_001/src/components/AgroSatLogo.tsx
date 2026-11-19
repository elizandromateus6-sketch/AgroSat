import React from 'react';
import agrosatLogoImg from '../assets/images/agrosat_logo_1786455799069.jpg';

interface AgroSatLogoProps {
  variant?: 'full' | 'icon' | 'compact';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AgroSatLogo: React.FC<AgroSatLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  }[size];

  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm border border-[#E0E2D9] ${sizeClasses} aspect-square ${className}`}>
        <img
          src={agrosatLogoImg}
          alt="AgroSat Angola Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2.5 ${className}`}>
        <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm border border-[#E0E2D9] ${sizeClasses} aspect-square shrink-0`}>
          <img
            src={agrosatLogoImg}
            alt="AgroSat Angola Emblem"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <div className="flex items-center space-x-1">
            <span className="font-extrabold font-display tracking-tight text-[#1E291B] text-lg">
              AGROSAT
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#33422F] text-[#8BB174] font-bold">
              ANGOLA
            </span>
          </div>
          <span className="text-[10px] text-[#6B705C] font-medium tracking-wide">
            Inteligência Agrícola vinda do Espaço
          </span>
        </div>
      </div>
    );
  }

  // Full variant showing the complete logo image
  return (
    <div className={`inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-sm border border-[#E0E2D9] ${className}`}>
      <img
        src={agrosatLogoImg}
        alt="AgroSat Angola - Inteligência agrícola vinda do espaço"
        referrerPolicy="no-referrer"
        className={`object-contain max-w-full ${sizeClasses}`}
      />
    </div>
  );
};
