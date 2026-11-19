/**
 * AgroSat NDVI Utility Functions
 * Normalized Difference Vegetation Index: (NIR - RED) / (NIR + RED)
 */

export interface NDVIInterpretation {
  label: string;
  category: 'baixo' | 'medio' | 'alto' | 'muito_alto' | 'agua_ou_solo';
  color: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  recommendation: string;
}

export function interpretNdvi(value: number): NDVIInterpretation {
  if (value < 0.1) {
    return {
      label: 'Solo Exposto / Sem Vegetação',
      category: 'agua_ou_solo',
      color: '#A68A68',
      badgeBg: '#F5EFEB',
      badgeBorder: '#DDC7B4',
      description: 'Superfície sem cobertura vegetal ativa (solo preparado, água ou infraestruturas).',
      recommendation: 'Verifique se a parcela está em pousio ou no período de pré-sementeira.',
    };
  }

  if (value < 0.35) {
    return {
      label: 'Vegetação Fraca / Possível Stress',
      category: 'baixo',
      color: '#D97706',
      badgeBg: '#FEF3C7',
      badgeBorder: '#FCD34D',
      description: 'Baixa densidade foliar ou biomassa reduzida. Pode indicar germinação inicial, stress hídrico ou carência de nutrientes.',
      recommendation: 'Inspecione o terreno para despistar falta de irrigação ou presença inicial de pragas.',
    };
  }

  if (value < 0.65) {
    return {
      label: 'Vegetação Moderada / Em Desenvolvimento',
      category: 'medio',
      color: '#65A30D',
      badgeBg: '#ECFCCB',
      badgeBorder: '#BEF264',
      description: 'Culturas em desenvolvimento vegetativo estável, com cobertura de dossel regular.',
      recommendation: 'Mantenha a monitorização semanal e avalie a necessidade de adubação de cobertura.',
    };
  }

  if (value < 0.85) {
    return {
      label: 'Vegetação Vigorosa / Alta Atividade',
      category: 'alto',
      color: '#16A34A',
      badgeBg: '#DCFCE7',
      badgeBorder: '#86EFAC',
      description: 'Elevada concentração de clorofila, fotossíntese vigorosa e excelente vigor vegetativo.',
      recommendation: 'Cultura em ótimo estado produtivo. Mantenha o plano nutricional e fitossanitário preventivo.',
    };
  }

  return {
    label: 'Vegetação Densa / Dossel Fechado',
    category: 'muito_alto',
    color: '#15803D',
    badgeBg: '#BBF7D0',
    badgeBorder: '#4ADE80',
    description: 'Máxima densidade foliar. Típico de culturas em plena maturação com dossel fechado.',
    recommendation: 'Acompanhe a humidade do solo para evitar proliferação de fungos em dosséis muito densos.',
  };
}

export function formatNdvi(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return '0.00';
  return Number(value).toFixed(2);
}

export function getNdviColor(value: number): string {
  return interpretNdvi(value).color;
}
