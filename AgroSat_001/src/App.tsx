import React, { useState, useEffect, useCallback } from 'react';
import { User, Farm, Alert } from './types';
import { INITIAL_USER } from './data/mockData';
import { farmService } from './services/farmService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
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
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Core Datasets (Local Frontend State)
  const [farms, setFarms] = useState<Farm[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const refreshData = useCallback(() => {
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

  const handleNavigate = (tab: string) => {
    const normalizedTab = tab === 'ai' ? 'agro-ai' : tab;
    setActiveTab(normalizedTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFarm = (farmId: string) => {
    setSelectedFarmId(farmId);
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
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
          unreadAlertsCount={alerts.filter((a) => !a.read).length}
        />

        {/* Main Page Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'home' && (
            <HomePage onNavigate={handleNavigate} />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage
              farms={farms}
              alerts={alerts}
              currentUser={currentUser}
              onSelectFarm={handleSelectFarm}
              onNavigate={handleNavigate}
              onRefreshData={refreshData}
            />
          )}

          {activeTab === 'properties' && (
            <PropertiesPage
              farms={farms}
              onSelectFarm={(id) => {
                handleSelectFarm(id);
                setActiveTab('dashboard');
              }}
              onRefreshFarms={refreshData}
            />
          )}

          {activeTab === 'ndvi' && <NDVIPage farms={farms} />}

          {activeTab === 'monitoring' && (
            <MonitoringPage farms={farms} onSelectFarm={handleSelectFarm} />
          )}

          {(activeTab === 'agro-ai' || activeTab === 'ai') && (
            <AgroAIPage farms={farms} selectedFarmId={selectedFarmId} />
          )}

          {activeTab === 'education' && (
            <EducationPage
              currentUser={currentUser}
              onSelectCourse={handleSelectCourse}
              onNavigateQuizzes={() => handleNavigate('quizzes')}
            />
          )}

          {activeTab === 'course-detail' && (
            <CourseDetailPage
              courseId={selectedCourseId || 'course_ndvi_101'}
              currentUser={currentUser}
              onBack={() => handleNavigate('education')}
              onNavigateQuizzes={() => handleNavigate('quizzes')}
              onRefreshUser={refreshData}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizPage currentUser={currentUser} onRefreshUser={refreshData} />
          )}

          {activeTab === 'weather' && <WeatherPage />}

          {activeTab === 'alerts' && (
            <AlertsPage alerts={alerts} onRefreshData={refreshData} />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {![
            'home',
            'dashboard',
            'properties',
            'ndvi',
            'monitoring',
            'agro-ai',
            'ai',
            'education',
            'course-detail',
            'quizzes',
            'weather',
            'alerts',
            'profile',
          ].includes(activeTab) && <HomePage onNavigate={handleNavigate} />}
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export default App;
