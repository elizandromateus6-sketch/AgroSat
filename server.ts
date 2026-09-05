import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI SDK safely
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'AgroSat API',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Gemini AI Chat Endpoint for AgroSat Assistente
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, contextHistory, farmContext } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Mensagem é obrigatória' });
      }

      const systemInstruction = `Você é o AgroSat Assistente, um especialista virtual em agricultura de precisão, sensoriamento remoto, NDVI, manejo de culturas e clima, focado especialmente em Angola e na África Subsaariana.

Diretrizes de resposta:
1. Forneça explicações claras, práticas e acessíveis para agricultores, técnicos e estudantes agrícolas.
2. Explique termos técnicos (como NDVI, espectro NIR, estresse hídrico) em linguagem simples.
3. Se houver dados da fazenda/propriedade fornecidos no contexto, analise-os com atenção ao histórico e ao NDVI.
4. IMPORTANTE: Sempre inclua uma ressalva ética quando aplicável: "Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo."
5. Seja cortês, encorajador e focado no aumento da produtividade agrícola sustentável.`;

      let promptText = message;
      if (farmContext) {
        promptText = `[Contexto da Propriedade: Nome: ${farmContext.name || 'N/A'}, Cultura: ${farmContext.crop || 'N/A'}, Localização: ${farmContext.location || 'Angola'}, NDVI Atual: ${farmContext.ndvi || 'N/A'}, Área: ${farmContext.area || 'N/A'} ha]\n\nPergunta do utilizador: ${message}`;
      }

      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        return res.json({
          reply: response.text || 'Não foi possível gerar uma resposta no momento.',
          disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
          isRealAI: true,
        });
      } else {
        // Fallback response when key is not configured
        const fallbackReply = `[AgroSat AI - Modo de Demonstração] Olá! Analisei a sua questão sobre "${message}". O NDVI (Índice de Vegetação por Diferença Normalizada) mede a clorofila e biomassa foliar. Para uma análise completa e em tempo real via Inteligência Artificial, certifique-se de configurar a chave GEMINI_API_KEY nas definições da plataforma.`;
        return res.json({
          reply: fallbackReply,
          disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
          isRealAI: false,
        });
      }
    } catch (error: any) {
      console.error('Erro na API AgroSat AI:', error);
      res.status(500).json({
        error: 'Falha ao processar solicitação de IA',
        details: error.message,
        reply: 'Desculpe, ocorreu um erro ao consultar o assistente de IA. Por favor tente novamente em instantes.',
        disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
      });
    }
  });

  // AgroSat Crop & NDVI AI Analysis Endpoint
  app.post('/api/ai/analyze-crop', async (req, res) => {
    try {
      const { cropType, ndviValue, history, area, weather, location } = req.body;

      const prompt = `Analise os dados de monitoramento da seguinte propriedade agrícola em Angola:
- Cultura: ${cropType || 'Milho'}
- Valor de NDVI Atual: ${ndviValue}
- Histórico Recente de NDVI: ${JSON.stringify(history || [])}
- Área da propriedade: ${area || '15'} hectares
- Localização: ${location || 'Huambo, Angola'}
- Clima Atual: ${JSON.stringify(weather || { temp: '24°C', rain: '12mm' })}

Forneça uma análise estruturada contendo:
1. Resumo do Estado da Cultura (Ótimo, Bom, Moderado, Estresse Moderado, Estresse Crítico)
2. Análise detalhada do valor de NDVI (${ndviValue}) e tendência histórica
3. Possíveis causas de estresse ou desenvolvimento observado
4. Recomendações práticas passo a passo para o agricultor (ex: irrigação, adubação, controle fitossanitário)
5. Nível de confiança da análise (Baixo, Médio, Alto) com justificativa.`;

      const systemInstruction = `Você é o motor de diagnósticos inteligentes do AgroSat. Seja objetivo, pragmático e utilize linguagem adaptada à realidade da agricultura angolana. Inclua a nota obrigatoria: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola.'`;

      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.5,
          },
        });

        return res.json({
          analysis: response.text,
          timestamp: new Date().toISOString(),
          isRealAI: true,
          disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
        });
      } else {
        return res.json({
          analysis: `### Análise AgroSat (Modo Simulado)
**Estado Geral:** Desenvolvimento Positivo
**NDVI Atual:** ${ndviValue} (Vegetação saudável em fase vegetativa avançada)
**Tendência:** Crescimento estável nos últimos 30 dias.
**Recomendações:**
- Manter o plano de irrigação atual conforme a precipitação prevista.
- Realizar inspeção visual no setor Norte para verificar possíveis manchas foliares.
- Aplicar adubação de cobertura nas áreas com NDVI abaixo de 0.50.

*Nota: Conecte a chave GEMINI_API_KEY para gerar análises geradas diretamente pelo modelo avançado de IA.*`,
          timestamp: new Date().toISOString(),
          isRealAI: false,
          disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
        });
      }
    } catch (error: any) {
      console.error('Erro na análise de cultura AgroSat AI:', error);
      res.status(500).json({ error: 'Erro ao gerar análise de IA', details: error.message });
    }
  });

  // Satellite Mock Data API with info metadata for Sentinel-2 integration readiness
  app.get('/api/satellite/provider-info', (_req, res) => {
    res.json({
      activeProvider: 'Sentinel-2 (Simulado)',
      resolution: '10m',
      bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)', 'B11 (SWIR)'],
      formula: 'NDVI = (NIR - RED) / (NIR + RED)',
      isMock: true,
      notice: 'Dados demonstrativos — conecte uma fonte de dados de satélite real (Copernicus Sentinel Hub / Landsat API) para obter dados em tempo real.',
    });
  });

  // Weather API provider endpoint
  app.get('/api/weather/province/:province', (req, res) => {
    const province = req.params.province || 'Huambo';
    res.json({
      location: `${province}, Angola`,
      temperature: Math.floor(Math.random() * 6) + 21,
      humidity: Math.floor(Math.random() * 20) + 60,
      precipitation: (Math.random() * 15).toFixed(1),
      windSpeed: Math.floor(Math.random() * 10) + 8,
      condition: 'Parcialmente Nublado com Sol',
      isMock: true,
      notice: 'Dados meteorológicos demonstrativos para Angola.',
      forecast: [
        { day: 'Hoje', tempMax: 26, tempMin: 15, rainProb: 20, icon: 'sun-cloud' },
        { day: 'Amanhã', tempMax: 25, tempMin: 16, rainProb: 40, icon: 'cloud-rain' },
        { day: 'Quarta', tempMax: 27, tempMin: 14, rainProb: 10, icon: 'sun' },
        { day: 'Quinta', tempMax: 24, tempMin: 15, rainProb: 60, icon: 'rain' },
        { day: 'Sexta', tempMax: 26, tempMin: 16, rainProb: 30, icon: 'sun-cloud' },
        { day: 'Sábado', tempMax: 28, tempMin: 17, rainProb: 15, icon: 'sun' },
        { day: 'Domingo', tempMax: 27, tempMin: 15, rainProb: 25, icon: 'sun-cloud' },
      ],
    });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 AgroSat Server rodando na porta ${PORT} [http://localhost:${PORT}]`);
  });
}

startServer();
