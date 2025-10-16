import { GoogleGenAI } from "@google/genai";
import { CampaignData } from '../types';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

export const generateInsights = async (
  data: CampaignData[],
  metrics: { totalContacts: number; totalQualified: number; totalDisqualified: number; },
  startDate: string,
  endDate: string,
): Promise<string> => {
  if (!ai) {
    return "## Erro de Configuração\n\nA chave da API para o Gemini não está configurada. Para habilitar esta funcionalidade, por favor, defina a variável de ambiente `API_KEY` nas configurações do seu projeto Vercel. O restante do dashboard continuará funcionando normalmente.";
  }
  
  const qualificationRate = metrics.totalContacts > 0 ? (metrics.totalQualified / metrics.totalContacts * 100).toFixed(1) : '0';
  const disqualificationRate = metrics.totalContacts > 0 ? (metrics.totalDisqualified / metrics.totalContacts * 100).toFixed(1) : '0';

  const prompt = `
    **Análise de Performance de Campanhas Meta Ads**

    **Contexto:** Você é um analista de marketing digital sênior preparando um relatório de performance para um cliente. O relatório deve ser claro, conciso e profissional.

    **Período da Análise:** ${startDate} a ${endDate}

    **Dados Agregados do Período:**
    - Total de Contatos Gerados: ${metrics.totalContacts}
    - Contatos Qualificados: ${metrics.totalQualified} (Taxa de Qualificação: ${qualificationRate}%)
    - Contatos Desqualificados: ${metrics.totalDisqualified} (Taxa de Desqualificação: ${disqualificationRate}%)

    **Instruções para o Relatório (em Português):**
    Com base nos dados agregados, gere um relatório em formato markdown que inclua as seguintes seções:
    1.  **# Análise de Performance das Campanhas Meta Ads**
    2.  **## Resumo Geral dos Resultados:** Um parágrafo introdutório e uma lista com os principais números (contatos gerados, qualificados, desqualificados).
    3.  **## Pontos Fortes e Oportunidades (Key Wins):** Analise o que está funcionando bem. Por exemplo, a taxa de qualificação é boa? O volume de contatos é alto?
    4.  **## Áreas para Otimização (Areas for Improvement):** Identifique os principais desafios. Por exemplo, um número alto de contatos desqualificados sugere problemas na segmentação ou na mensagem do anúncio.
    5.  **## Próximos Passos e Recomendações:** Forneça de 2 a 3 recomendações claras e acionáveis para melhorar o desempenho da campanha.

    **Formato de Saída:**
    - Use títulos markdown (ex: '## Resumo Geral dos Resultados').
    - Use listas com marcadores ('*') para os itens.
    - Use negrito ('**texto**') para destacar métricas e termos importantes.
    - O tom deve ser consultivo e orientado para a solução.
    - **Importante:** A saída deve ser apenas o relatório em markdown, sem nenhum texto introdutório como "Claro, aqui está o relatório".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insights with Gemini:", error);
    return "Ocorreu um erro ao gerar a análise. Por favor, tente novamente.";
  }
};