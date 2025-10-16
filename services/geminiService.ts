import { GoogleGenAI } from "@google/genai";
import { CampaignData } from '../types';

// DEVELOPER ACTION REQUIRED:
// Replace "YOUR_API_KEY_HERE" with your actual Gemini API key for the prototype to work.
const API_KEY = "YOUR_API_KEY_HERE";

let ai: GoogleGenAI | null = null;
let initError: string | null = null;

// Initialize the AI client, but only if the placeholder API key has been replaced.
if (API_KEY && API_KEY !== "YOUR_API_KEY_HERE") {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    initError = "## Erro de Inicialização\n\nOcorreu um erro ao inicializar a API Gemini. Verifique o console para mais detalhes.";
  }
} else {
  initError = "## Erro de Configuração: API Gemini\n\nA chave da API do Gemini não foi adicionada ao código-fonte. Para habilitar esta funcionalidade, o desenvolvedor precisa editar o arquivo `services/geminiService.ts` e substituir o placeholder pela chave de API válida.";
}

export const generateInsights = async (
  data: CampaignData[],
  metrics: { totalContacts: number; totalQualified: number; totalDisqualified: number; },
  startDate: string,
  endDate: string,
): Promise<string> => {
  // Return the initialization error if the API key is not set correctly.
  if (initError) {
    return initError;
  }
  if (!ai) {
    // This is a fallback case, should not be reached if initError is handled properly.
    return "## Erro Inesperado\n\nA API Gemini não foi inicializada. Contacte o suporte.";
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
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "## Erro de Autenticação: API Gemini\n\nA chave da API do Gemini fornecida é inválida ou expirou. Por favor, verifique a chave no código-fonte em `services/geminiService.ts`.";
    }
    return "Ocorreu um erro ao gerar a análise. Por favor, tente novamente.";
  }
};