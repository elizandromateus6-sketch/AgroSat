export type UserRole = 
  | 'agricultor' 
  | 'estudante' 
  | 'tecnico' 
  | 'investigador' 
  | 'gestor'
  | 'admin'
  | 'producer' 
  | 'agronomist' 
  | 'researcher';

export interface UserPreferences {
  emailNotifications: boolean;
  weatherAlerts: boolean;
  ndviDropThreshold: number; // e.g. 0.15
  satelliteResolution: 'hd' | 'standard';
  language: 'pt-AO' | 'en';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  country: string;
  province?: string;
  avatarUrl?: string;
  createdAt: string;
  completedCourses?: string[];
  preferences?: UserPreferences;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type FarmHealthStatus = 'Excelente' | 'Bom' | 'Atenção' | 'Crítico';

export interface Farm {
  id: string;
  userId: string;
  name: string;
  locationName: string; // e.g., "Huambo, Caála"
  province: string;
  municipality?: string;
  totalArea: number; // in hectares (ha)
  mainCrop: string; // e.g., "Milho", "Mandioca", "Feijão", "Batata-rena", "Café"
  variety?: string; // e.g., "ZM 523", "Matuba", "Catuaí Vermelho"
  status?: FarmHealthStatus;
  currentNdvi?: number;
  plantingDate: string; // YYYY-MM-DD
  irrigationType: 'Gotejamento' | 'Aspersão' | 'Pivot Central' | 'Sequeiro (Chuva)' | 'Manual';
  centerCoords: Coordinates;
  polygon: Coordinates[];
  notes?: string;
  createdAt: string;
}

export interface Field {
  id: string;
  farmId: string;
  name: string;
  area: number;
  cropType: string;
  currentNdvi: number;
  status: 'Excelente' | 'Saudável' | 'Atenção' | 'Estresse Crítico';
}

export interface NDVIPoint {
  date: string;
  ndvi: number;
  nir?: number;
  red?: number;
  temp?: number;
  precipitation?: number;
  satellitePass?: string;
}

export interface WeatherForecastDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  rainProb: number;
  precipitationSum: number;
  windSpeedMax?: number;
  uvIndexMax?: number;
  condition: string;
  icon: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  rainProb: number;
  condition: string;
  humidity: number;
}

export interface WeatherData {
  location: string;
  country: string;
  province?: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature?: number;
  humidity: number;
  precipitation: string;
  rainSumMm?: number;
  windSpeed: number;
  windDirection?: number;
  uvIndex?: number;
  pressure?: number;
  condition: string;
  weatherCode?: number;
  isMock: boolean;
  notice: string;
  lastUpdated: string;
  forecast: WeatherForecastDay[];
  hourly?: HourlyForecast[];
  agriRecommendations?: {
    planting: string;
    irrigation: string;
    pestRisk: string;
    sprayCondition: string;
  };
}

export type AlertSeverity = 'INFO' | 'ATENÇÃO' | 'ALERTA' | 'CRÍTICO' | 'high' | 'medium' | 'low';
export type AlertType = 'ndvi_drop' | 'water_stress' | 'weather' | 'pest_risk' | 'soil_anomaly' | 'inspection_required';

export interface Alert {
  id: string;
  farmId: string;
  farmName: string;
  affectedAreaHa?: number;
  title: string;
  message: string;
  severity: AlertSeverity;
  type: AlertType;
  date: string;
  read: boolean;
  recommendation?: string;
}

export interface AIAnalysis {
  id: string;
  farmId: string;
  farmName: string;
  date: string;
  analysisText: string;
  isRealAI: boolean;
  disclaimer: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'precisao' | 'ndvi' | 'satelite' | 'irrigacao' | 'solos' | 'pragas' | 'gestao';
  categoryLabel: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  author: string;
  publishedAt: string;
  level: 'Iniciante' | 'Intermédio' | 'Avançado';
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  summary: string;
  contentText: string;
  videoPlaceholderUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId?: string;
  title: string;
  category: 'agricultura' | 'precisao' | 'ia';
  description: string;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  category: 'agricultura' | 'precisao' | 'ia';
  categoryLabel: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  description: string;
  duration: string;
  lessonsCount: number;
  rating: number;
  image: string;
  lessons: Lesson[];
  quizId?: string;
}

export interface UserProgress {
  userId: string;
  completedLessonIds: string[];
  quizScores: Record<string, number>; // quizId -> score percentage
  totalPoints: number;
}

