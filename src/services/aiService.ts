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

export const aiService = {
  async sendMessage(message: string, farmContext?: any): Promise<AgroAIChatResponse> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, farmContext }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('Servidor AgroSat AI indisponível, usando motor de fallback:', e);
    }

    return {
      reply: `[AgroSat AI] Recebi sua pergunta: "${message}". O NDVI atual é um indicador chave para avaliar a densidade foliar. Para diagnósticos completos gerados ao vivo por Inteligência Artificial, verifique a conexão com o servidor e a chave do Gemini nas configurações.`,
      disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
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
    try {
      const response = await fetch('/api/ai/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('Erro ao chamar /api/ai/analyze-crop:', e);
    }

    return {
      analysis: `### Análise de Diagnóstico AgroSat
**Cultura:** ${params.cropType}
**NDVI Registrado:** ${params.ndviValue}
**Avaliação:** Desenvolvendo vigorosamente com cobertura vegetal sólida.
**Ações Recomendadas:**
- Manter plano de irrigação ajustado ao índice de chuva regional.
- Inspecionar áreas periféricas para prevenção de pragas de início de safra.`,
      timestamp: new Date().toISOString(),
      isRealAI: false,
      disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
    };
  },
};
