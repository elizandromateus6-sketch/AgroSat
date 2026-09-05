import { Farm, NDVIPoint, Alert, Course, Quiz, User } from '../types';
import officialAvatar from '../assets/images/agrosat_official_avatar.svg';

export const INITIAL_USER: User = {
  id: 'usr_001',
  name: 'Mateus Eduardo',
  email: 'mateus.eduardo@agrosat.ao',
  role: 'agricultor',
  country: 'Angola',
  province: 'Huambo',
  avatarUrl: officialAvatar,
  createdAt: '2026-01-15',
};

export const MOCK_FARMS: Farm[] = [
  {
    id: 'farm_001',
    userId: 'usr_001',
    name: 'Fazenda Planalto Central',
    locationName: 'Caála, Huambo',
    province: 'Huambo',
    totalArea: 45,
    mainCrop: 'Milho Amarelo',
    plantingDate: '2025-10-15',
    irrigationType: 'Sequeiro (Chuva)',
    centerCoords: { lat: -12.8525, lng: 15.5611 },
    polygon: [
      { lat: -12.8500, lng: 15.5580 },
      { lat: -12.8500, lng: 15.5640 },
      { lat: -12.8550, lng: 15.5645 },
      { lat: -12.8550, lng: 15.5585 },
    ],
    notes: 'Polo de produção de cereais em rotação com feijão mantido em ótimo estado biológico.',
    createdAt: '2025-10-10',
  },
  {
    id: 'farm_002',
    userId: 'usr_001',
    name: 'Machamba do Kwanza',
    locationName: 'Sumbe, Cuanza Sul',
    province: 'Cuanza Sul',
    totalArea: 28,
    mainCrop: 'Mandioca',
    plantingDate: '2025-08-01',
    irrigationType: 'Gotejamento',
    centerCoords: { lat: -11.2061, lng: 13.8437 },
    polygon: [
      { lat: -11.2040, lng: 13.8410 },
      { lat: -11.2040, lng: 13.8460 },
      { lat: -11.2080, lng: 13.8460 },
      { lat: -11.2080, lng: 13.8410 },
    ],
    notes: 'Área irrigada por gotejamento próximo ao rio. Monitoramento quinzenal de viçosismo.',
    createdAt: '2025-08-01',
  },
  {
    id: 'farm_003',
    userId: 'usr_001',
    name: 'Roça Vale do Lubango',
    locationName: 'Humpata, Huíla',
    province: 'Huíla',
    totalArea: 62,
    mainCrop: 'Batata-rena & Hortaliças',
    plantingDate: '2025-11-20',
    irrigationType: 'Pivot Central',
    centerCoords: { lat: -14.9812, lng: 13.3622 },
    polygon: [
      { lat: -14.9780, lng: 13.3590 },
      { lat: -14.9780, lng: 13.3650 },
      { lat: -14.9840, lng: 13.3650 },
      { lat: -14.9840, lng: 13.3590 },
    ],
    notes: 'Cultivo intensivo de batata-rena com pivô central e estações meteorológicas de campo.',
    createdAt: '2025-11-01',
  },
  {
    id: 'farm_004',
    userId: 'usr_001',
    name: 'Agro-Polo de Quêssua',
    locationName: 'Quêssua, Malanje',
    province: 'Malanje',
    totalArea: 75,
    mainCrop: 'Milho & Soja',
    plantingDate: '2025-10-25',
    irrigationType: 'Aspersão',
    centerCoords: { lat: -9.4500, lng: 16.4167 },
    polygon: [
      { lat: -9.4470, lng: 16.4130 },
      { lat: -9.4470, lng: 16.4200 },
      { lat: -9.4530, lng: 16.4200 },
      { lat: -9.4530, lng: 16.4130 },
    ],
    notes: 'Novo município de Quêssua. Projeto agropecuário de cereais com irrigação e rotação com leguminosas.',
    createdAt: '2025-10-20',
  },
];

export const MOCK_NDVI_HISTORY: Record<string, NDVIPoint[]> = {
  farm_001: [
    { date: '01/10', ndvi: 0.22, nir: 0.35, red: 0.22, temp: 22, precipitation: 5 },
    { date: '15/10', ndvi: 0.28, nir: 0.40, red: 0.22, temp: 23, precipitation: 12 },
    { date: '01/11', ndvi: 0.41, nir: 0.52, red: 0.21, temp: 24, precipitation: 25 },
    { date: '15/11', ndvi: 0.56, nir: 0.64, red: 0.18, temp: 23, precipitation: 40 },
    { date: '01/12', ndvi: 0.68, nir: 0.72, red: 0.14, temp: 24, precipitation: 35 },
    { date: '15/12', ndvi: 0.74, nir: 0.78, red: 0.11, temp: 25, precipitation: 50 },
    { date: '01/01', ndvi: 0.78, nir: 0.81, red: 0.10, temp: 24, precipitation: 45 },
    { date: '15/01', ndvi: 0.72, nir: 0.76, red: 0.12, temp: 25, precipitation: 18 },
    { date: '01/02', ndvi: 0.65, nir: 0.71, red: 0.15, temp: 26, precipitation: 10 },
  ],
  farm_002: [
    { date: '01/10', ndvi: 0.51, nir: 0.60, red: 0.19, temp: 28, precipitation: 8 },
    { date: '15/10', ndvi: 0.55, nir: 0.63, red: 0.18, temp: 29, precipitation: 10 },
    { date: '01/11', ndvi: 0.59, nir: 0.66, red: 0.17, temp: 28, precipitation: 14 },
    { date: '15/11', ndvi: 0.62, nir: 0.68, red: 0.16, temp: 28, precipitation: 20 },
    { date: '01/12', ndvi: 0.66, nir: 0.72, red: 0.15, temp: 29, precipitation: 22 },
    { date: '15/12', ndvi: 0.64, nir: 0.70, red: 0.15, temp: 30, precipitation: 15 },
    { date: '01/01', ndvi: 0.61, nir: 0.67, red: 0.16, temp: 31, precipitation: 8 },
    { date: '15/01', ndvi: 0.58, nir: 0.65, red: 0.17, temp: 30, precipitation: 5 },
    { date: '01/02', ndvi: 0.54, nir: 0.62, red: 0.18, temp: 31, precipitation: 2 },
  ],
  farm_003: [
    { date: '01/10', ndvi: 0.18, nir: 0.31, red: 0.24, temp: 20, precipitation: 0 },
    { date: '15/10', ndvi: 0.25, nir: 0.38, red: 0.23, temp: 22, precipitation: 4 },
    { date: '01/11', ndvi: 0.38, nir: 0.49, red: 0.21, temp: 21, precipitation: 18 },
    { date: '15/11', ndvi: 0.52, nir: 0.61, red: 0.19, temp: 22, precipitation: 30 },
    { date: '01/12', ndvi: 0.67, nir: 0.72, red: 0.14, temp: 23, precipitation: 28 },
    { date: '15/12', ndvi: 0.75, nir: 0.79, red: 0.11, temp: 22, precipitation: 38 },
    { date: '01/01', ndvi: 0.82, nir: 0.85, red: 0.08, temp: 23, precipitation: 32 },
    { date: '15/01', ndvi: 0.80, nir: 0.83, red: 0.09, temp: 24, precipitation: 25 },
    { date: '01/02', ndvi: 0.79, nir: 0.82, red: 0.10, temp: 24, precipitation: 20 },
  ],
  farm_004: [
    { date: '01/10', ndvi: 0.20, nir: 0.32, red: 0.23, temp: 26, precipitation: 10 },
    { date: '15/10', ndvi: 0.31, nir: 0.44, red: 0.22, temp: 27, precipitation: 22 },
    { date: '01/11', ndvi: 0.48, nir: 0.58, red: 0.20, temp: 27, precipitation: 35 },
    { date: '15/11', ndvi: 0.64, nir: 0.70, red: 0.16, temp: 26, precipitation: 48 },
    { date: '01/12', ndvi: 0.73, nir: 0.77, red: 0.12, temp: 27, precipitation: 40 },
    { date: '15/12', ndvi: 0.79, nir: 0.82, red: 0.10, temp: 28, precipitation: 55 },
    { date: '01/01', ndvi: 0.81, nir: 0.84, red: 0.09, temp: 27, precipitation: 38 },
    { date: '15/01', ndvi: 0.78, nir: 0.81, red: 0.11, temp: 28, precipitation: 20 },
    { date: '01/02', ndvi: 0.74, nir: 0.78, red: 0.13, temp: 29, precipitation: 15 },
  ],
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alt_101',
    farmId: 'farm_001',
    farmName: 'Fazenda Planalto Central',
    title: '⚠️ Possível redução do viço vegetal (NDVI)',
    message: 'O índice NDVI reduziu de 0.78 para 0.65 nos últimos 15 dias no setor Leste da fazenda.',
    severity: 'medium',
    type: 'ndvi_drop',
    date: '2026-02-08',
    read: false,
    recommendation: 'Inspecione a área para verificar falta de água ou início de lagarta do cartucho.',
  },
  {
    id: 'alt_102',
    farmId: 'farm_002',
    farmName: 'Machamba do Kwanza',
    title: '⚠️ Estresse hídrico moderado retetado por satélite',
    message: 'Precipitação acumulada abaixo de 10mm na última quinzena combinada com temperaturas elevadas (31°C).',
    severity: 'high',
    type: 'water_stress',
    date: '2026-02-05',
    read: false,
    recommendation: 'Ative o sistema de gotejamento no período matutino para otimizar absorção do solo.',
  },
  {
    id: 'alt_103',
    farmId: 'farm_003',
    farmName: 'Roça Vale do Lubango',
    title: '☀️ Alerta de Chuva Moderada para Quarta-feira',
    message: 'Previsão de 25mm de precipitação no município de Humpata com ventos de 12 km/h.',
    severity: 'low',
    type: 'weather',
    date: '2026-02-10',
    read: true,
    recommendation: 'Ideal para pausar fertirrigação foliar antes da precipitação natural.',
  },
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'quiz_01',
    courseId: 'crs_01',
    title: 'Quiz de Fundamentos do NDVI e Sensoriamento Remoto',
    category: 'precisao',
    description: 'Teste os seus conhecimentos sobre os espectros de luz de satélite, a fórmula do NDVI e como interpretar os valores de saúde da vegetação.',
    questions: [
      {
        id: 'q1',
        question: 'Qual índice é utilizado para avaliar a saúde e a densidade da vegetação através de imagens de satélite?',
        options: ['GPS (Global Positioning System)', 'NDVI (Normalized Difference Vegetation Index)', 'PIB (Produto Interno Bruto)', 'HTML (HyperText Markup Language)'],
        correctOptionIndex: 1,
        explanation: 'O NDVI (Índice de Vegetação por Diferença Normalizada) mede o contraste entre a absorção da luz vermelha pela clorofila e a reflexão do infravermelho próximo pelas células das folhas.',
      },
      {
        id: 'q2',
        question: 'Qual é a fórmula exata do cálculo do NDVI?',
        options: [
          'NDVI = (NIR + RED) / (NIR - RED)',
          'NDVI = (NIR - RED) / (NIR + RED)',
          'NDVI = NIR × RED',
          'NDVI = RED / NIR',
        ],
        correctOptionIndex: 1,
        explanation: 'A fórmula correta é NDVI = (NIR - RED) / (NIR + RED), onde NIR é o Infravermelho Próximo (Near-Infrared) e RED é a luz Vermelha visível.',
      },
      {
        id: 'q3',
        question: 'Um valor de NDVI próximo a 0.75 a 0.85 em uma lavoura de milho indica:',
        options: [
          'Presença de água em abundância ou solo completamente exposto',
          'Vegetação muito densa, vigorosa e com alta atividade de clorofila',
          'Ataque severo de pragas ou cultura totalmente seca',
          'Efeito de nuvens espessas sobre o satélite',
        ],
        correctOptionIndex: 1,
        explanation: 'Valores positivos elevados (próximos de 1.0) indicam biomassa vegetal abundante, fotossíntese ativa e excelente saúde foliar.',
      },
      {
        id: 'q4',
        question: 'Valores negativos de NDVI (ex: -0.2 a -0.5) representam normalmente:',
        options: [
          'Corpos d\'água, rios, lagos ou nuvens densas',
          'Florestas tropicais nativas fechadas',
          'Campos de trigo em fase de colheita',
          'Solo fertilizado com nitrogênio',
        ],
        correctOptionIndex: 0,
        explanation: 'A água absorve fortemente o infravermelho e reflete mais luz visível, gerando valores negativos na fórmula do NDVI.',
      },
    ],
  },
  {
    id: 'quiz_02',
    courseId: 'crs_02',
    title: 'Quiz de Agricultura de Precisão e Manejo do Solo',
    category: 'agricultura',
    description: 'Avalie suas práticas de preparo do solo, amostragem geoespacial e irrigação inteligente em Angola.',
    questions: [
      {
        id: 'q1',
        question: 'Qual é a principal vantagem da amostragem de solo em grade georreferenciada (GPS)?',
        options: [
          'Elimina completamente a necessidade de adubar a terra',
          'Permite aplicar fertilizantes em taxa variável, apenas onde o solo precisa',
          'Aumenta o preço da semente no mercado internacional',
          'Diminui o consumo de combustível dos tratores sem rastreamento',
        ],
        correctOptionIndex: 1,
        explanation: 'A amostragem georreferenciada identifica as manchas de fertilidade no campo, otimizando o gasto com adubo e aumentando a produtividade.',
      },
      {
        id: 'q2',
        question: 'O que caracteriza o estresse hídrico em plantas agrícolas?',
        options: [
          'Excesso de clorofila produzida durante a noite',
          'Incapacidade da planta em absorver água suficiente para suprir a transpiração foliar',
          'Crescimento exagerado das raízes secundárias devido ao excesso de chuva',
          'Melhoria no sabor dos frutos colhidos prematuramente',
        ],
        correctOptionIndex: 1,
        explanation: 'O estresse hídrico ocorre quando a evapotranspiração excede a absorção de água, levando ao murchamento, fechamento dos estômatos e queda no NDVI.',
      },
    ],
  },
  {
    id: 'quiz_03',
    courseId: 'crs_03',
    title: 'Quiz de Inteligência Artificial e Drones no Campo',
    category: 'ia',
    description: 'Aprenda como algoritmos de machine learning e visão computacional estão revolucionando o campo em África.',
    questions: [
      {
        id: 'q1',
        question: 'Como os modelos de Inteligência Artificial auxiliam no diagnóstico de plantações por imagem?',
        options: [
          'Modificando geneticamente as sementes pelo computador',
          'Identificando padrões de cores, texturas e anomalias de NDVI antes de se tornarem visíveis a olho nu',
          'Substituindo a necessidade de chuva no cultivo',
          'Fazendo a colheita mecânica automaticamente sem máquinas',
        ],
        correctOptionIndex: 1,
        explanation: 'Modelos de visão computacional analisam milhares de pixels de imagem de satélite ou drone para detectar pragas, deficiências nutricionais e estresse prematuro.',
      },
    ],
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs_01',
    title: 'Sensoriamento Remoto & NDVI na Prática',
    category: 'precisao',
    categoryLabel: 'Agricultura de Precisão',
    level: 'Iniciante',
    description: 'Aprenda os princípios físicos dos satélites Sentinel-2 e Landsat, o espectro da luz e como interpretar mapas de calor NDVI para a tomada de decisões agrícolas no campo angolano.',
    duration: '2h 30m',
    lessonsCount: 4,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=600',
    quizId: 'quiz_01',
    lessons: [
      {
        id: 'ls_101',
        courseId: 'crs_01',
        title: '1. O que é Sensoriamento Remoto Agrícola?',
        duration: '15 min',
        summary: 'Entenda como os satélites capturam a energia refletida pelas folhas da plantação a centenas de quilômetros de altitude.',
        contentText: `### O que é Sensoriamento Remoto Agrícola?

O sensoriamento remoto é a tecnologia que nos permite obter dados sobre a superfície terrestre sem entrar em contato direto com ela. Na agricultura, utilizamos **sensores a bordo de satélites** (como os satélites europeus Sentinel-2 ou americanos Landsat) para fotografar a Terra em diferentes comprimentos de onda de luz.

#### Como a luz interage com as plantas?
- **Luz Visível (Vermelho - RED):** As plantas em crescimento ativo contêm clorofila, pigmento que absorve fortemente a luz vermelha para realizar a fotossíntese.
- **Infravermelho Próximo (NIR):** As estruturas celulares internas de folhas saudáveis refletem intensamente a luz infravermelha próxima, invisível ao olho humano.

Com essa diferença ótica, conseguimos calcular a saúde da plantação antes mesmo de aparecerem sintomas visíveis a olho nu!`,
      },
      {
        id: 'ls_102',
        courseId: 'crs_01',
        title: '2. A Fórmula do NDVI e a Escala de Cores',
        duration: '25 min',
        summary: 'Desmistificando o cálculo do NDVI e aprendendo a interpretar o gradiente de cores do vermelho ao verde escuro.',
        contentText: `### A Fórmula Matemática do NDVI

O NDVI é calculado pela seguinte relação matemática normalizada:

$$NDVI = \\frac{NIR - RED}{NIR + RED}$$

#### Tabela de Interpretação dos Valores de NDVI:
- **-1.0 a 0.0 (Tons de Azul/Cinza):** Água, nuvens, superfícies sem vegetação, solo alagado.
- **0.0 a 0.2 (Tons Vermelhos/Laranjas):** Solo exposto, rocha, palhada seca, estradas.
- **0.2 a 0.4 (Tons Amarelados):** Vegetação muito jovem, rasteira, estresse hídrico severo ou fase inicial de brotação.
- **0.4 a 0.6 (Tons Verdes Cluros):** Vegetação em desenvolvimento médio, lavoura saudável intermediária.
- **0.6 a 0.9 (Tons Verde Escuro/Vigoroso):** Cultura em pleno ápice vegetativo, com alta biomassa e dossel fechado.`,
      },
      {
        id: 'ls_103',
        courseId: 'crs_01',
        title: '3. Identificando Padrões de Estresse Hídrico e Nutricional',
        duration: '30 min',
        summary: 'Aprenda a diferenciação visual entre falhas de irrigação, ataque de pragas e mancha amarela no mapa de propriedades.',
        contentText: `### Detectando anomalias em mapas georreferenciados

Quando observamos um mapa NDVI de uma fazenda no Huambo ou Cuanza Sul:
1. **Manchas Circulares ou Uniformes:** Geralmente indicam limitações do solo (falta de calcário ou compactação).
2. **Faixas Lineares:** Podem indicar falhas de regulagem na semeadora ou pulverizador.
3. **Padrões de Borda:** Comum em ataques de pragas migrantes ou falta de água nas extremidades dos pivôs.`,
      },
      {
        id: 'ls_104',
        courseId: 'crs_01',
        title: '4. Integração do NDVI no Calendário Agrícola Angolano',
        duration: '40 min',
        summary: 'Adaptando o monitoramento de satélite às estações de chuva (Época das Chuvas) e seca (Cacimbo) em Angola.',
        contentText: `### O Clima e os Satélites em Angola

Em Angola, a época das chuvas (outubro a abril) traz um desafio: a presença de nuvens. Por isso, os algoritmos do AgroSat aplicam máscaras de nuvens nos dados Sentinel-2 para extrair imagens límpidas sempre que o satélite passa sobre o território nacional (a cada 5 dias).`,
      },
    ],
  },
  {
    id: 'crs_02',
    title: 'Manejo do Solo & Irrigação de Precisão',
    category: 'agricultura',
    categoryLabel: 'Agricultura Geral',
    level: 'Intermediário',
    description: 'Guia completo de preparação do solo, adubação de cobertura, conservação de água e otimização dos sistemas de irrigação nas províncias de Angola.',
    duration: '3h 15m',
    lessonsCount: 3,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600',
    quizId: 'quiz_02',
    lessons: [
      {
        id: 'ls_201',
        courseId: 'crs_02',
        title: '1. Análise Físico-Química do Solo e Correção de Acidez',
        duration: '30 min',
        summary: 'Como realizar a amostragem de solo corretiva e aplicar calcário agrícola para elevar o pH do solo.',
        contentText: `### Preparação Eficiente do Solo em Angola

O solo das regiões planálticas de Angola frequentemente apresenta acidez moderada a elevada. A calagem (aplicação de calcário) neutraliza o alumínio tóxico e disponibiliza cálcio e magnésio para as raízes da mandioca, milho e feijão.`,
      },
      {
        id: 'ls_202',
        courseId: 'crs_02',
        title: '2. Técnicas Eficientes de Irrigação (Gotejamento vs Pivot)',
        duration: '45 min',
        summary: 'Comparativo econômico e de economia de água entre sistemas de irrigação localizada e aspersão.',
        contentText: `### Economizando Água na Agricultura

A irrigação por gotejamento atinge eficiências de até 95%, entregando a água e fertilizantes solúveis diretamente na zona radicular das plantas, reduzindo drasticamente a evaporação superficial durante períodos quentes.`,
      },
      {
        id: 'ls_203',
        courseId: 'crs_02',
        title: '3. Adubação de Cobertura Baseada em Dados de Vegetação',
        duration: '30 min',
        summary: 'Aplicação direcionada de nitrogênio e potássio guiada por mapas de taxa variável do AgroSat.',
        contentText: `### Adubação de Precisão

Ao aplicar adubo nitrogenado apenas onde o NDVI indica menor vigor, o agricultor economiza fertilizante e evita a poluição do lençol freático, mantendo um estande de plantas homogêneo.`,
      },
    ],
  },
  {
    id: 'crs_03',
    title: 'Inteligência Artificial & Drones na Agricultura',
    category: 'ia',
    categoryLabel: 'Inteligência Artificial',
    level: 'Avançado',
    description: 'Descubra como os modelos de linguagem avançados (como o Google Gemini) e imagens multiespectrais ajudam a diagnosticar pragas, prever safras e automatizar alertas no campo.',
    duration: '2h 45m',
    lessonsCount: 3,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600',
    quizId: 'quiz_03',
    lessons: [
      {
        id: 'ls_301',
        courseId: 'crs_03',
        title: '1. O Papel da IA no AgroSat',
        duration: '25 min',
        summary: 'Entenda como o assistente AgroSat AI cruza dados de clima, cultura e histórico de satélite para responder dúvidas instantaneamente.',
        contentText: `### Inteligência Artificial Transformando a Produção Agricola

Modelos de IA Generativa treinados com dados agronômicos conseguem analisar diagnósticos complexos em segundos. No AgroSat, o modelo Google Gemini recebe o histórico de vegetação da fazenda e emite pareceres práticos de manejo.`,
      },
      {
        id: 'ls_302',
        courseId: 'crs_03',
        title: '2. Drones Multiespectrais e Varredura de Baixa Altitude',
        duration: '35 min',
        summary: 'Complementando o satélite com voos de drone para resolução de milímetros por pixel.',
        contentText: `### Drones no Campo

Enquanto os satélites capturam grandes extensões territoriais a cada 5 dias, os drones agrícolas permitem sobrevoar parcelas específicas em dias nublados para contagem automatizada de plantas e mapeamento prévio de ervas daninhas.`,
      },
      {
        id: 'ls_303',
        courseId: 'crs_03',
        title: '3. Previsão de Produtividade Agrícola com IA',
        duration: '40 min',
        summary: 'Estimativa de sacas por hectare a partir de curvas integradas de NDVI e balanço hídrico.',
        contentText: `### Previsão de Safras

Modelos preditivos acumulam a integral da área sob a curva de NDVI ao longo do ciclo fenológico da cultura para estimar com precisão a produtividade esperada no momento da colheita.`,
      },
    ],
  },
];
