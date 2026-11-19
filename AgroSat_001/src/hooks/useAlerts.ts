import { useFarmContext } from '../contexts/FarmContext';

export const useAlerts = () => {
  const { alerts, unreadAlertsCount, markAlertRead, refreshData } = useFarmContext();
  return {
    alerts,
    unreadAlertsCount,
    markAlertRead,
    refreshAlerts: refreshData,
  };
};
