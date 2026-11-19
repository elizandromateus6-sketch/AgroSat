export interface RouteConfig {
  id: string;
  path: string;
  title: string;
  description: string;
  isPublic: boolean;
}

export const APP_ROUTES: Record<string, RouteConfig> = {
  home: {
    id: 'home',
    path: '/',
    title: 'Início | AgroSat',
    description: 'Transformamos dados de satélite em decisões agrícolas.',
    isPublic: true,
  },
  dashboard: {
    id: 'dashboard',
    path: '/dashboard',
    title: 'Painel Agrícola | AgroSat',
    description: 'Indicadores gerais, estatísticas de área e saúde das culturas.',
    isPublic: true,
  },
  properties: {
    id: 'properties',
    path: '/properties',
    title: 'Gestão de Propriedades | AgroSat',
    description: 'Adicionar, editar e visualizar talhões e fazendas agrícolas.',
    isPublic: true,
  },
  ndvi: {
    id: 'ndvi',
    path: '/ndvi',
    title: 'Monitorização NDVI | AgroSat',
    description: 'Análise de viço e biomassa foliar por satélite Sentinel-2.',
    isPublic: true,
  },
  monitoring: {
    id: 'monitoring',
    path: '/monitoring',
    title: 'Histórico de Monitoramento | AgroSat',
    description: 'Séries temporais e comparação de dados agronómicos.',
    isPublic: true,
  },
  weather: {
    id: 'weather',
    path: '/weather',
    title: 'Previsão Agrometeorológica | AgroSat',
    description: 'Previsão de precipitação, vento e índices agrícolas.',
    isPublic: true,
  },
  'agro-ai': {
    id: 'agro-ai',
    path: '/ai',
    title: 'AgroSat AI | Assistente Simulado',
    description: 'Recomendações agronómicas simuladas para apoio à decisão.',
    isPublic: true,
  },
  education: {
    id: 'education',
    path: '/academia',
    title: 'Academia AgroSat | Formação Agrícola',
    description: 'Artigos técnicos, cursos e capacitação em agricultura de precisão.',
    isPublic: true,
  },
  quizzes: {
    id: 'quizzes',
    path: '/quizzes',
    title: 'Quizzes Agrícolas | AgroSat',
    description: 'Avaliação de conhecimentos em sensoriamento remoto e boas práticas.',
    isPublic: true,
  },
  alerts: {
    id: 'alerts',
    path: '/alerts',
    title: 'Central de Alertas | AgroSat',
    description: 'Deteção de anomalias, stress hídrico e notificações no campo.',
    isPublic: true,
  },
  profile: {
    id: 'profile',
    path: '/profile',
    title: 'Perfil do Utilizador | AgroSat',
    description: 'Visualização e edição local de dados pessoais e preferências.',
    isPublic: true,
  },
};
