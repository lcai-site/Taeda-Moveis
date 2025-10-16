import React, { useMemo } from 'react';
import { CampaignData, AggregationLevel } from '../types';
import { useSummaryMetrics } from '../hooks/useSummaryMetrics';
import MetricCard from './MetricCard';
import CampaignPerformanceChart from './CampaignPerformanceChart';
import SourcePieChart from './SourceBreakdownChart';
import CampaignsBarChart from './CampaignsBarChart';
import CplTimelineChart from './CplTimelineChart';
import CostChart from './CostChart';
import { Theme } from '../App';

interface DashboardGridProps {
  data: CampaignData[];
  isLoading: boolean;
  error: string | null;
  aggregation: AggregationLevel;
  activeTab: 'consolidated' | 'facebook' | 'instagram';
  theme: Theme;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ data, isLoading, error, aggregation, activeTab, theme }) => {
  const { 
    totalContacts, 
    totalQualified, 
    totalDisqualified, 
    contactsToday,
    totalCost,
    avgCpl,
    qualificationRate 
  } = useSummaryMetrics(data);

  const breakdownChartInfo = useMemo(() => {
    if (activeTab === 'consolidated') {
      const sourceMap = new Map<string, number>();
      data.forEach(item => {
        sourceMap.set(item.source, (sourceMap.get(item.source) || 0) + item.contacts);
      });
      return {
          title: "Origem dos Contatos",
          data: Array.from(sourceMap.entries()).map(([name, value]) => ({ name, value }))
      };
    } else {
      const placementMap = new Map<string, number>();
      data.forEach(item => {
        if (item.placement) {
            placementMap.set(item.placement, (placementMap.get(item.placement) || 0) + item.contacts);
        }
      });
      return {
          title: "Contatos por Posicionamento",
          data: Array.from(placementMap.entries()).map(([name, value]) => ({ name, value }))
      };
    }
  }, [data, activeTab]);

  const ICONS = {
    contacts: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-light-text-secondary dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    qualified: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    disqualified: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    cost: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h4z" /></svg>,
    cpl: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    rate: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
  };

  if (isLoading) {
    return <div className="text-center p-10">Carregando dados...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Contatos no Dia" value={contactsToday.toString()} icon={ICONS.contacts} />
        <MetricCard title="Qualificados" value={totalQualified.toString()} icon={ICONS.qualified} description="No período" />
        <MetricCard title="Desqualificados" value={totalDisqualified.toString()} icon={ICONS.disqualified} description="No período" />
        <MetricCard title="Total Investido" value={totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} prefix="R$" icon={ICONS.cost} description="No período" />
        <MetricCard title="Custo por Lead" value={avgCpl.toFixed(2).replace('.', ',')} prefix="R$" icon={ICONS.cpl} description="Média no período" />
        <MetricCard title="Taxa de Qualif." value={qualificationRate.toFixed(1).replace('.', ',')} suffix="%" icon={ICONS.rate} description="No período" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <CampaignPerformanceChart data={data} aggregation={aggregation} theme={theme} />
        </div>
        <div>
            <SourcePieChart title={breakdownChartInfo.title} data={breakdownChartInfo.data} theme={theme} />
        </div>
        <div className="lg:col-span-2">
            <CampaignsBarChart data={data} theme={theme} />
        </div>
        <div>
            <CplTimelineChart data={data} aggregation={aggregation} theme={theme} />
        </div>
        <div className="lg:col-span-3">
            <CostChart data={data} aggregation={aggregation} theme={theme} />
        </div>
      </div>
    </>
  );
};

export default DashboardGrid;