export interface AgroAIChatResponse {
  reply: string;
  disclaimer: string;
  isRealAI: boolean;
}

export interface AgroCropAnalysisResponse {
  analysis: string;
  timestamp: string;
  isRealAI: boolean;
  disclaimer: string;
}

const DISCLAIMER =
  'Simulação local de interface — recomendações demonstrativas baseadas em dados fictícios de exemplo.';

function generateLocalSimulatedReply(message: string, farmContext?: any): string {
  const q = message.toLowerCase();
  const farmName = farmContext?.name || 'sua propriedade';
  const crop = farmContext?.crop || farmContext?.mainCrop || 'cultura selecionada';
  const province = farmContext?.province || 'Huambo';

  if (q.includes('ndvi') || q.includes('vigor') || q.includes('satélite') || q.includes('satelite')) {
    return `**Análise Simulada de NDVI (${farmName}):**\n\nO índice NDVI varia de **-1 a +1** e mede o vigor fotossintético da vegetação:\n- **0.60 a 0.85:** Vegetação densa e vigorosa, boa cobertura foliar.\n- **0.40 a 0.60:** Vigor moderado, ideal para monitorar adubação de cobertura.\n- **Abaixo de 0.35:** Possível solo exposto, emergência inicial ou stress hídrico.\n\nPara **${crop}** em **${province}**, recomenda-se acompanhar a evolução quinzenal nos talhões com menor vigor.`;
  }

  if (q.includes('rega') || q.includes('irrig') || q.includes('água') || q.includes('agua') || q.includes('seca')) {
    return `**Orientação Simulada de Irrigação (${province}):**\n\n1. **Horário ideal:** Regar entre **05h30 e 08h30** ou após as **16h30** para reduzir perdas por evapotranspiração.\n2. **Frequência:** Ajustar a lâmina de água conforme a precipitação prevista para os próximos 3 dias.\n3. **Cobertura do solo:** Utilizar palhada (mulching) para conservar a humidade na zona radicular de **${crop}**.`;
  }

  if (q.includes('adub') || q.includes('fertiliz') || q.includes('solo') || q.includes('npk')) {
    return `**Plano Simulado de Adubação (${crop}):**\n\n- **Base (sementeira):** Aplicar adubo composto NPK equilibrado conforme análise prévia do solo.\n- **Cobertura:** Parcelar o azoto (ureia ou sulfato de amónio) em 2 aplicações nos estádios iniciais de crescimento vegetativo.\n- **Correção:** Em solos ácidos do Planalto Central (${province}), considerar calagem prévia para melhorar a absorção de nutrientes.`;
  }

  if (q.includes('praga') || q.includes('lagarta') || q.includes('doença') || q.includes('doenca') || q.includes('fungo')) {
    return `**Vistoria Fitossanitária Simulada (${farmName}):**\n\n- Inspecionar semanalmente o terço inferior das folhas e o cartucho das plantas em **${crop}**.\n- Atenção redobrada à **lagarta-do-cartucho** em períodos secos e a **doenças fúngicas** após chuvas intensas com alta humidade.\n- Priorizar o manejo integrado e evitar pulverizações em horários de vento forte.`;
  }

  if (q.includes('milho') || q.includes('feijão') || q.includes('feijao') || q.includes('mandioca') || q.includes('plantar') || q.includes('semear')) {
    return `**Calendário Agrícola Simulado (${province}):**\n\n- **Época das chuvas (Outubro a Abril):** Janela principal para culturas de sequeiro como milho, feijão e soja.\n- **Época do Cacimbo (Maio a Setembro):** Ideal para hortícolas em áreas de regadio (tomate, cebola, repolho, batata-rena).\n- Utilize sementes certificadas e mantenha o espaçamento recomendado para otimizar o aproveitamento solar.`;
  }

  return `**Assistente AgroSat (Simulação Local):**\n\nRecebi a sua consulta sobre *"${message}"* no contexto de **${farmName}** (${crop}, ${province}).\n\nSugestões rápidas:\n- Consulte o separador **Módulo NDVI** para visualizar o mapa de vigor foliar simulado.\n- Verifique a previsão de 7 dias no separador **Clima** antes de planear pulverizações ou rega.\n- Explore os cursos interativos em **Educação** para boas práticas agrícolas.`;
}

export const aiService = {
  async sendMessage(message: string, farmContext?: any): Promise<AgroAIChatResponse> {
    // Simulated local response delay for natural UI interaction
    await new Promise((resolve) => setTimeout(resolve, 450));

    return {
      reply: generateLocalSimulatedReply(message, farmContext),
      disclaimer: DISCLAIMER,
      isRealAI: false,
    };
  },

  async analyzeCrop(params: {
    cropType: string;
    ndviValue: number;
    history: any[];
    area: number;
    location: string;
  }): Promise<AgroCropAnalysisResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const vigorLabel =
      params.ndviValue >= 0.65
        ? 'Vigor Vegetativo Alto (Cobertura Foliar Densa)'
        : params.ndviValue >= 0.45
        ? 'Vigor Vegetativo Moderado (Desenvolvimento Regular)'
        : 'Vigor Reduzido (Atenção a Stress Hídrico ou Nutricional)';

    return {
      analysis: `### Relatório Simulado AgroSat\n**Cultura:** ${params.cropType}\n**Localização:** ${params.location} (${params.area} ha)\n**NDVI Registado:** ${params.ndviValue.toFixed(2)}\n**Classificação:** ${vigorLabel}\n\n**Recomendações Simuladas:**\n- Monitorar a uniformidade das bordaduras e zonas de menor vigor no mapa.\n- Ajustar o turno de rega de acordo com a previsão climática local.\n- Registar observações de campo para comparação na próxima leitura quinzenal.`,
      timestamp: new Date().toISOString(),
      isRealAI: false,
      disclaimer: DISCLAIMER,
    };
  },
};
