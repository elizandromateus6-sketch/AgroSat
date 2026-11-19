import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useFarmContext } from '../contexts/FarmContext';
import { INITIAL_USER } from '../data/mockData';
import farmFieldBg from '../assets/images/farm_field_8k_1787058978908.jpg';

interface AppLayoutProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onNavigate,
  children,
}) => {
  const { unreadAlertsCount } = useFarmContext();

  return (
    <div className="min-h-screen flex flex-col relative text-[#2D3628] font-sans antialiased selection:bg-[#4B6344] selection:text-white">
      {/* 8K Ultra HD Agricultural Field Wallpaper Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed transform-gpu"
        style={{
          backgroundImage: `url(${farmFieldBg})`,
        }}
      />
      {/* Ambient Contrast Tint (Preserving plantation details with high text legibility) */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-black/35 via-black/15 to-black/45" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <Navbar
          currentUser={INITIAL_USER}
          activeTab={activeTab}
          setActiveTab={onNavigate}
          unreadAlertsCount={unreadAlertsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Global Footer */}
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};
