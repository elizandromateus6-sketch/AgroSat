import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Farm, Alert } from '../types';
import { farmService } from '../services/farmService';

interface FarmContextType {
  farms: Farm[];
  selectedFarmId: string;
  selectedFarm: Farm | undefined;
  alerts: Alert[];
  unreadAlertsCount: number;
  isLoading: boolean;
  error: string | null;
  selectFarm: (farmId: string) => void;
  addFarm: (farmData: Omit<Farm, 'id' | 'createdAt'>) => Farm;
  updateFarm: (id: string, updates: Partial<Farm>) => Farm | undefined;
  deleteFarm: (id: string) => void;
  markAlertRead: (id: string) => void;
  refreshData: () => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedFarms = farmService.getFarms();
      const loadedAlerts = farmService.getAlerts();
      setFarms(loadedFarms);
      setAlerts(loadedAlerts);

      setSelectedFarmId((prev) => {
        if (prev && loadedFarms.some((f) => f.id === prev)) {
          return prev;
        }
        return loadedFarms.length > 0 ? loadedFarms[0].id : '';
      });
    } catch (err: any) {
      console.error('Erro ao carregar propriedades:', err);
      setError('Não foi possível carregar os dados das propriedades.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const selectFarm = useCallback((farmId: string) => {
    setSelectedFarmId(farmId);
  }, []);

  const addFarm = useCallback((farmData: Omit<Farm, 'id' | 'createdAt'>): Farm => {
    const newFarm = farmService.addFarm(farmData);
    refreshData();
    setSelectedFarmId(newFarm.id);
    return newFarm;
  }, [refreshData]);

  const updateFarm = useCallback((id: string, updates: Partial<Farm>): Farm | undefined => {
    const updated = farmService.updateFarm(id, updates);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteFarm = useCallback((id: string) => {
    farmService.deleteFarm(id);
    refreshData();
  }, [refreshData]);

  const markAlertRead = useCallback((id: string) => {
    farmService.markAlertRead(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const selectedFarm = useMemo(() => {
    return farms.find((f) => f.id === selectedFarmId) || farms[0];
  }, [farms, selectedFarmId]);

  const unreadAlertsCount = useMemo(() => {
    return alerts.filter((a) => !a.read).length;
  }, [alerts]);

  return (
    <FarmContext.Provider
      value={{
        farms,
        selectedFarmId,
        selectedFarm,
        alerts,
        unreadAlertsCount,
        isLoading,
        error,
        selectFarm,
        addFarm,
        updateFarm,
        deleteFarm,
        markAlertRead,
        refreshData,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarmContext = (): FarmContextType => {
  const context = useContext(FarmContext);
  if (!context) {
    console.warn('useFarmContext used outside FarmProvider, using fallback farm methods.');
    const farms = farmService.getFarms();
    const alerts = farmService.getAlerts();
    return {
      farms,
      selectedFarmId: farms.length > 0 ? farms[0].id : '',
      selectedFarm: farms.length > 0 ? farms[0] : undefined,
      alerts,
      unreadAlertsCount: alerts.filter((a) => !a.read).length,
      isLoading: false,
      error: null,
      selectFarm: () => {},
      addFarm: (data) => farmService.addFarm(data),
      updateFarm: (id, updates) => farmService.updateFarm(id, updates),
      deleteFarm: (id) => farmService.deleteFarm(id),
      markAlertRead: (id) => farmService.markAlertRead(id),
      refreshData: () => {},
    };
  }
  return context;
};
