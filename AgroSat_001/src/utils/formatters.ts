/**
 * General Formatters for AgroSat
 */

export function formatHectares(ha: number | undefined): string {
  if (ha === undefined || ha === null || isNaN(ha)) return '0 ha';
  return `${ha.toLocaleString('pt-PT', { maximumFractionDigits: 1 })} ha`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeString?: string): string {
  if (!timeString) {
    return new Date().toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return timeString;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'O'}`;
  return `${latStr}, ${lngStr}`;
}
