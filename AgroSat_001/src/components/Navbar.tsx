import React, { useState } from 'react';
import { User } from '../types';
import { AgroSatLogo } from './AgroSatLogo';
import {
  Sprout,
  LayoutDashboard,
  Map,
  Activity,
  Calendar,
  CloudSun,
  Bot,
  GraduationCap,
  HelpCircle,
  Bell,
  User as UserIcon,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  unreadAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadAlertsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: Sprout },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Propriedades', icon: Map },
    { id: 'ndvi', label: 'Módulo NDVI', icon: Activity },
    { id: 'monitoring', label: 'Histórico', icon: Calendar },
    { id: 'weather', label: 'Clima', icon: CloudSun },
    { id: 'agro-ai', label: 'AgroSat AI', icon: Bot, highlight: true },
    { id: 'education', label: 'Educação', icon: GraduationCap },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'alerts', label: 'Alertas', icon: Bell, badge: unreadAlertsCount },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1E291B] text-[#E8EDDF] border-b border-[#2A3826] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2.5 cursor-pointer group py-1"
          >
            <AgroSatLogo size="md" variant="icon" className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold font-display tracking-tight text-white">
                  AgroSat
                </span>
              </div>
              <p className="text-[10px] text-[#A3B18A] font-medium tracking-wide">
                Inteligência Agrícola vinda do Espaço
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#33422F] text-white shadow-sm border border-[#8BB174]/20'
                      : item.highlight
                      ? 'bg-[#2A3826] text-[#8BB174] hover:text-white hover:bg-[#33422F] border border-[#8BB174]/30'
                      : 'text-[#D0D7C9] hover:text-white hover:bg-[#2A3826]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-[#8BB174]' : ''}`} />
                  <span>{item.label}</span>

                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-[#8BB174] text-[#1E291B] rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Area */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-[#2A3826] transition-colors border border-[#33422F] cursor-pointer"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-[#8BB174]/50"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-white leading-none">{currentUser.name}</p>
                  <span className="text-[10px] uppercase font-semibold text-[#8BB174] tracking-wider">
                    {currentUser.role}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1E291B] rounded-xl shadow-2xl border border-[#33422F] py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-2 border-b border-[#2A3826]">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-[#A3B18A] truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full text-left px-3.5 py-2 text-xs text-[#E8EDDF] hover:bg-[#2A3826] flex items-center space-x-2 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#8BB174]" />
                    <span>Meu Perfil</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#D0D7C9] hover:text-white hover:bg-[#2A3826] rounded-lg cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#1E291B] border-b border-[#2A3826] px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-[#2A3826]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#33422F] text-white font-bold'
                      : 'text-[#D0D7C9] hover:bg-[#2A3826]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-[#8BB174]" />
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-[#8BB174] text-[#1E291B] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#8BB174]"
              />
              <div>
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[10px] text-[#8BB174] capitalize">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('profile')}
              className="px-3 py-1.5 text-xs text-[#E8EDDF] hover:bg-[#2A3826] rounded-lg border border-[#33422F] cursor-pointer"
            >
              Perfil
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
