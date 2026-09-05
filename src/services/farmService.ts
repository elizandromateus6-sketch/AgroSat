import { Farm, NDVIPoint, Alert } from '../types';
import { MOCK_FARMS, MOCK_NDVI_HISTORY, MOCK_ALERTS } from '../data/mockData';

const FARMS_STORAGE_KEY = 'agrosat_farms_list';
const ALERTS_STORAGE_KEY = 'agrosat_alerts_list';

export const farmService = {
  getFarms(): Farm[] {
    const saved = localStorage.getItem(FARMS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler fazendas do localStorage:', e);
      }
    }
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(MOCK_FARMS));
    return MOCK_FARMS;
  },

  getFarmById(id: string): Farm | undefined {
    const farms = this.getFarms();
    return farms.find((f) => f.id === id);
  },

  addFarm(farmData: Omit<Farm, 'id' | 'createdAt'>): Farm {
    const farms = this.getFarms();
    const newFarm: Farm = {
      ...farmData,
      id: 'farm_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newFarm, ...farms];
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(updated));
    return newFarm;
  },

  updateFarm(id: string, updates: Partial<Farm>): Farm | undefined {
    const farms = this.getFarms();
    const index = farms.findIndex((f) => f.id === id);
    if (index === -1) return undefined;
    farms[index] = { ...farms[index], ...updates };
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(farms));
    return farms[index];
  },

  deleteFarm(id: string): void {
    const farms = this.getFarms();
    const filtered = farms.filter((f) => f.id !== id);
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(filtered));
  },

  getNdviHistory(farmId: string): NDVIPoint[] {
    if (MOCK_NDVI_HISTORY[farmId]) {
      return MOCK_NDVI_HISTORY[farmId];
    }
    // Generated default temporal history for new farm
    return [
      { date: '01/10', ndvi: 0.25, nir: 0.38, red: 0.23, temp: 24, precipitation: 10 },
      { date: '15/10', ndvi: 0.35, nir: 0.46, red: 0.22, temp: 25, precipitation: 15 },
      { date: '01/11', ndvi: 0.48, nir: 0.58, red: 0.20, temp: 24, precipitation: 30 },
      { date: '15/11', ndvi: 0.62, nir: 0.68, red: 0.16, temp: 25, precipitation: 45 },
      { date: '01/12', ndvi: 0.71, nir: 0.75, red: 0.13, temp: 26, precipitation: 40 },
      { date: '15/12', ndvi: 0.76, nir: 0.80, red: 0.11, temp: 25, precipitation: 55 },
      { date: '01/01', ndvi: 0.74, nir: 0.78, red: 0.12, temp: 26, precipitation: 35 },
      { date: '15/01', ndvi: 0.69, nir: 0.74, red: 0.14, temp: 27, precipitation: 20 },
      { date: '01/02', ndvi: 0.63, nir: 0.70, red: 0.16, temp: 27, precipitation: 12 },
    ];
  },

  getAlerts(): Alert[] {
    const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler alertas:', e);
      }
    }
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(MOCK_ALERTS));
    return MOCK_ALERTS;
  },

  markAlertRead(id: string): void {
    const alerts = this.getAlerts();
    const updated = alerts.map((a) => (a.id === id ? { ...a, read: true } : a));
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updated));
  },
};
