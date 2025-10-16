import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CampaignData, AggregationLevel } from '../types';
import { Theme } from '../App';

interface CplTimelineChartProps {
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

const CplTimelineChart: React.FC<CplTimelineChartProps> = ({ data, aggregation, theme }) => {
  const aggregatedData = useMemo(() => {
    const periodData: { [key: string]: { date: string; cost: number; contacts: number } } = {};

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
        periodData[key] = { date: key, cost: 0, contacts: 0 };
      }
      periodData[key].cost += item.cost;
      periodData[key].contacts += item.contacts;
    });
    
    return Object.values(periodData)
      .map(item => ({
        date: item.date,
        cpl: item.contacts > 0 ? item.cost / item.contacts : 0,
      }))
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
      <h3 className="text-xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">Evolução do Custo por Lead (CPL)</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={aggregatedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke={tickColor} />
            <YAxis stroke={tickColor} tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{ backgroundColor: tooltipBackgroundColor, border: `1px solid ${tooltipBorderColor}` }}
              labelStyle={{ color: legendColor }}
              labelFormatter={formatDate}
              formatter={(value: number) => [formatCurrency(value), 'CPL']}
            />
            <Legend wrapperStyle={{ color: legendColor }} />
            <Line type="monotone" dataKey="cpl" stroke="#6366F1" name="CPL" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CplTimelineChart;