import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CampaignData, AggregationLevel } from '../types';
import { Theme } from '../App';

interface CostChartProps {
  data: CampaignData[];
  aggregation: AggregationLevel;
  theme: Theme;
}

const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

const CostChart: React.FC<CostChartProps> = ({ data, aggregation, theme }) => {
  const aggregatedData = useMemo(() => {
    const periodData: { [key: string]: { date: string; cost: number } } = {};

    data.forEach(item => {
      let key: string;
      if (aggregation === 'daily') {
        key = item.date;
      } else if (aggregation === 'weekly') {
        key = getStartOfWeek(new Date(item.date)).toISOString().split('T')[0];
      } else { // monthly
        key = new Date(item.date).toISOString().slice(0, 7) + '-01';
      }
      
      if (!periodData[key]) {
        periodData[key] = { date: key, cost: 0 };
      }
      periodData[key].cost += item.cost;
    });
    
    return Object.values(periodData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, aggregation]);

  const formatDate = (tickItem: string) => {
    const date = new Date(tickItem);
    date.setUTCHours(12);
    if (aggregation === 'monthly') return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const formatCurrency = (value: number) => `R$${value.toFixed(2)}`;

  const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const tooltipBackgroundColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';
  const tooltipBorderColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const legendColor = theme === 'dark' ? '#F9FAFB' : '#374151';

  return (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">Análise de Custos</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke={tickColor} />
            <YAxis stroke={tickColor} tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{ backgroundColor: tooltipBackgroundColor, border: `1px solid ${tooltipBorderColor}` }}
              labelStyle={{ color: legendColor }}
              labelFormatter={formatDate}
              formatter={(value: number) => [formatCurrency(value), 'Custo']}
            />
            <Area type="monotone" dataKey="cost" stroke="#F59E0B" fill="url(#colorCost)" name="Custo" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostChart;