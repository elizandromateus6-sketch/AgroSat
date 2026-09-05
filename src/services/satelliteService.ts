export interface SpectralBands {
  b02_blue: number;
  b03_green: number;
  b04_red: number;
  b08_nir: number;
  b11_swir?: number;
}

export interface NDVIAnalysisResult {
  ndvi: number;
  nir: number;
  red: number;
  healthCategory: 'Água / Inerte' | 'Solo Exposto' | 'Vegetação Baixa' | 'Vegetação Moderada' | 'Vegetação Densa / Vigorosa';
  colorHex: string;
  provider: string;
  isMock: boolean;
  notice: string;
}

export interface ISatelliteProvider {
  name: string;
  resolution: string;
  fetchBands(lat: number, lng: number): Promise<SpectralBands>;
  calculateNDVI(bands: SpectralBands): number;
}

/**
 * Standard NDVI Formula Calculation:
 * NDVI = (NIR - RED) / (NIR + RED)
 */
export function calculateNdviFormula(nir: number, red: number): number {
  if (nir + red === 0) return 0;
  const val = (nir - red) / (nir + red);
  return Number(val.toFixed(3));
}

/**
 * Maps an NDVI value (-1 to +1) to its corresponding color gradient and classification
 */
export function getNdviClassification(ndvi: number): {
  category: NDVIAnalysisResult['healthCategory'];
  colorHex: string;
  description: string;
} {
  if (ndvi <= 0) {
    return {
      category: 'Água / Inerte',
      colorHex: '#2563eb', // Blue
      description: 'Superfícies aquáticas, sombras ou estruturas não vegetadas.',
    };
  } else if (ndvi <= 0.2) {
    return {
      category: 'Solo Exposto',
      colorHex: '#d97706', // Amber / Brown
      description: 'Solo arado, palhada seca ou áreas rochosas sem folhas verdes.',
    };
  } else if (ndvi <= 0.4) {
    return {
      category: 'Vegetação Baixa',
      colorHex: '#eab308', // Yellow
      description: 'Cultura em germinação, brotação inicial ou estresse moderado a alto.',
    };
  } else if (ndvi <= 0.6) {
    return {
      category: 'Vegetação Moderada',
      colorHex: '#84cc16', // Lime green
      description: 'Desenvolvimento vegetativo intermediário com boa síntese de clorofila.',
    };
  } else {
    return {
      category: 'Vegetação Densa / Vigorosa',
      colorHex: '#15803d', // Deep green
      description: 'Dossel agrícola fechado, altíssimo viço e síntese foliar ótima.',
    };
  }
}

/**
 * Default Sentinel-2 Provider Implementation (Mocked for offline/dev preview, ready for Sentinel Hub API key substitution)
 */
export class MockSentinel2Provider implements ISatelliteProvider {
  name = 'Sentinel-2 (Copernicus ESA)';
  resolution = '10 metros';

  async fetchBands(lat: number, lng: number): Promise<SpectralBands> {
    // Deterministic simulation based on coordinates to mimic spatial variance
    const pseudoSeed = Math.sin(lat * 100 + lng * 50);
    const nir = 0.65 + pseudoSeed * 0.15;
    const red = 0.12 + Math.cos(pseudoSeed) * 0.05;
    return {
      b02_blue: 0.08,
      b03_green: 0.14,
      b04_red: Number(red.toFixed(2)),
      b08_nir: Number(nir.toFixed(2)),
      b11_swir: 0.22,
    };
  }

  calculateNDVI(bands: SpectralBands): number {
    return calculateNdviFormula(bands.b08_nir, bands.b04_red);
  }
}

class SatelliteServiceManager {
  private activeProvider: ISatelliteProvider = new MockSentinel2Provider();

  setProvider(provider: ISatelliteProvider) {
    this.activeProvider = provider;
  }

  getProviderName(): string {
    return this.activeProvider.name;
  }

  async getNDVIPoint(lat: number, lng: number): Promise<NDVIAnalysisResult> {
    const bands = await this.activeProvider.fetchBands(lat, lng);
    const ndvi = this.activeProvider.calculateNDVI(bands);
    const classification = getNdviClassification(ndvi);

    return {
      ndvi,
      nir: bands.b08_nir,
      red: bands.b04_red,
      healthCategory: classification.category,
      colorHex: classification.colorHex,
      provider: this.activeProvider.name,
      isMock: true,
      notice: 'Dados demonstrativos — conecte uma fonte de dados de satélite real (Sentinel Hub API) para obter medições ao vivo.',
    };
  }
}

export const satelliteService = new SatelliteServiceManager();
