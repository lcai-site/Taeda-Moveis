import { CampaignData } from '../types';

// This is now a mock service that simulates an AI analysis.
// It does not require an API key and will always work for the prototype.

export const generateInsights = async (
  data: CampaignData[],
  metrics: { totalContacts: number; totalQualified: number; totalDisqualified: number; },
  startDate: string,
  endDate: string,
): Promise<string> => {

  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const qualificationRate = metrics.totalContacts > 0 ? (metrics.totalQualified / metrics.totalContacts * 100).toFixed(1) : '0';
  const disqualificationRate = metrics.totalContacts > 0 ? (metrics.totalDisqualified / metrics.totalContacts * 100).toFixed(1) : '0';

  // Return a pre-written, high-quality analysis using the provided metrics.
  const mockReport = `
# Análise de Performance das Campanhas de IA

## Resumo Geral dos Resultados
Apresentamos um resumo conciso do desempenho de suas campanhas no período de ${new Date(startDate + 'T12:00:00Z').toLocaleDateString('pt-BR')} a ${new Date(endDate + 'T12:00:00Z').toLocaleDateString('pt-BR')}.

* **Total de Contatos Gerados:** ${metrics.totalContacts}
* **Contatos Qualificados:** ${metrics.totalQualified} (aprox. ${qualificationRate}% do total)
* **Contatos Desqualificados:** ${metrics.totalDisqualified} (aprox. ${disqualificationRate}% do total)

## Pontos Fortes e Oportunidades (Key Wins)
1. **Geração Sólida de Contatos Qualificados:**
* A campanha conseguiu atrair um volume significativo de quase **${Math.round(metrics.totalQualified / 1000)} mil contatos qualificados**. Isso demonstra que há um público interessado e que as campanhas têm potencial para gerar leads de alto valor. A taxa de qualificação de **${qualificationRate}%** é um bom ponto de partida, indicando que mais da metade dos contatos está alinhada com seus objetivos.

## Áreas para Otimização (Areas for Improvement)
1. **Redução de Contatos Desqualificados:**
* Apesar do bom volume de qualificados, quase **${disqualificationRate}% dos contatos foram desqualificados**. Este número expressivo sugere que parte do investimento pode estar sendo direcionada a um público que não corresponde ao perfil ideal, ou que a mensagem dos anúncios não está clara o suficiente para filtrar os interessados.

## Próximos Passos e Recomendações
Para otimizar o investimento e aumentar a eficiência, sugerimos as seguintes ações:
* **Refinar a Segmentação de Público:** Revisar e ajustar o público-alvo das campanhas para focar ainda mais nas características dos contatos que se qualificam. Isso pode reduzir significativamente o número de contatos desqualificados e melhorar o Custo por Lead (CPL).
* **Análise de Criativos:** Testar diferentes abordagens de texto e imagem nos anúncios para identificar quais mensagens atraem o público mais qualificado. Uma comunicação mais clara sobre o produto ou serviço pode filtrar usuários menos interessados antes do clique.
  `;

  return mockReport.trim();
};
