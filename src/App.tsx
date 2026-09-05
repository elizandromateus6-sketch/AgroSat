import React, { useState, useEffect, useCallback } from 'react';
import { User, Farm, Alert } from './types';
import { authService } from './services/authService';
import { farmService } from './services/farmService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import farmFieldBg from './assets/images/farm_field_8k_1787058978908.jpg';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { NDVIPage } from './pages/NDVIPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { AgroAIPage } from './pages/AgroAIPage';
import { EducationPage } from './pages/EducationPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { QuizPage } from './pages/QuizPage';
import { WeatherPage } from './pages/WeatherPage';
import { AlertsPage } from './pages/AlertsPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalIsRegister, setAuthModalIsRegister] = useState<boolean>(false);
  const [authModalMessage, setAuthModalMessage] = useState<string>('');

  // Core Datasets
  const [farms, setFarms] = useState<Farm[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Initial Data Refresh
  const refreshData = useCallback(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    const userFarms = farmService.getFarms();
    setFarms(userFarms);

    const userAlerts = farmService.getAlerts();
    setAlerts(userAlerts);

    if (userFarms.length > 0 && !selectedFarmId) {
      setSelectedFarmId(userFarms[0].id);
    }
  }, [selectedFarmId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Enforce auth check: if not logged in, only allow 'home' tab
  useEffect(() => {
    if (!currentUser && activeTab !== 'home') {
      setActiveTab('home');
    }
  }, [currentUser, activeTab]);

  const handleOpenAuthModal = (isRegister: boolean = false, message?: string) => {
    setAuthModalIsRegister(isRegister);
    setAuthModalMessage(
      message ||
        'Apenas utilizadores com conta registada têm acesso às abas do AgroSat. Inicie sessão ou crie uma conta gratuita.'
    );
    setIsAuthModalOpen(true);
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'home') {
      setActiveTab('home');
      return;
    }

    if (!currentUser) {
      handleOpenAuthModal(
        false,
        'Apenas utilizadores com conta registada têm acesso ao Dashboard, NDVI, Propriedades, Clima, IA e Educação.'
      );
      return;
    }

    setActiveTab(tab);
  };

  const handleSelectFarm = (farmId: string) => {
    setSelectedFarmId(farmId);
  };

  const handleSelectCourse = (courseId: string) => {
    if (!currentUser) {
      handleOpenAuthModal(false, 'Registe-se ou inicie sessão para aceder aos cursos de agricultura.');
      return;
    }
    setSelectedCourseId(courseId);
    setActiveTab('course-detail');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col relative text-[#2D3628] font-sans antialiased selection:bg-[#4B6344] selection:text-white">
      {/* 8K Ultra HD Agricultural Field Wallpaper Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-fixed transform-gpu"
        style={{
          backgroundImage: `url(${farmFieldBg})`,
        }}
      />
      {/* Ambient Contrast Tint (Semi-solid, preserving vivid plantation details) */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-black/35 via-black/15 to-black/45" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar Header */}
        <Navbar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          onOpenAuthModal={handleOpenAuthModal}
          onLogout={handleLogout}
          unreadAlertsCount={alerts.filter((a) => !a.read).length}
        />

        {/* Main Page Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              currentUser={currentUser}
              onOpenAuthModal={handleOpenAuthModal}
            />
          )}

          {currentUser && activeTab === 'dashboard' && (
            <DashboardPage
              farms={farms}
              alerts={alerts}
              currentUser={currentUser}
              onSelectFarm={handleSelectFarm}
              onNavigate={handleNavigate}
              onRefreshData={refreshData}
            />
          )}

          {currentUser && activeTab === 'properties' && (
            <PropertiesPage
              farms={farms}
              onSelectFarm={(id) => {
                handleSelectFarm(id);
                setActiveTab('dashboard');
              }}
              onRefreshFarms={refreshData}
            />
          )}

          {currentUser && activeTab === 'ndvi' && <NDVIPage farms={farms} />}

          {currentUser && activeTab === 'monitoring' && (
            <MonitoringPage farms={farms} onSelectFarm={handleSelectFarm} />
          )}

          {currentUser && activeTab === 'agro-ai' && (
            <AgroAIPage farms={farms} selectedFarmId={selectedFarmId} />
          )}

          {currentUser && activeTab === 'education' && (
            <EducationPage
              currentUser={currentUser}
              onSelectCourse={handleSelectCourse}
              onNavigateQuizzes={() => handleNavigate('quizzes')}
            />
          )}

          {currentUser && activeTab === 'course-detail' && (
            <CourseDetailPage
              courseId={selectedCourseId || 'course_ndvi_101'}
              currentUser={currentUser}
              onBack={() => handleNavigate('education')}
              onNavigateQuizzes={() => handleNavigate('quizzes')}
              onRefreshUser={refreshData}
            />
          )}

          {currentUser && activeTab === 'quizzes' && (
            <QuizPage currentUser={currentUser} onRefreshUser={refreshData} />
          )}

          {currentUser && activeTab === 'weather' && <WeatherPage />}

          {currentUser && activeTab === 'alerts' && (
            <AlertsPage alerts={alerts} onRefreshData={refreshData} />
          )}

          {currentUser && activeTab === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              onRefreshUser={refreshData}
              onLogout={handleLogout}
              onOpenAuthModal={() => handleOpenAuthModal(false)}
            />
          )}
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultIsRegister={authModalIsRegister}
        message={authModalMessage}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          refreshData();
          if (activeTab === 'home') {
            setActiveTab('dashboard');
          }
        }}
      />
    </div>
  );
}

export default App;
