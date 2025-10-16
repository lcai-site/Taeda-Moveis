import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CampaignData } from '../types';

interface CplTimelineChartProps {
  data: CampaignData[];
}

const CplTimelineChart: React.FC<CplTimelineChartProps> = ({ data }) => {
  const aggregatedData = useMemo(() => {
    const dailyData: { [key: string]: { date: string; cost: number; contacts: number } } = {};

    data.forEach(item => {
      if (!dailyData[item.date]) {
        dailyData[item.date] = { date: item.date, cost: 0, contacts: 0 };
      }
      dailyData[item.date].cost += item.cost;
      dailyData[item.date].contacts += item.contacts;
    });
    
    return Object.values(dailyData)
      .map(item => ({
        date: item.date,
        cpl: item.contacts > 0 ? item.cost / item.contacts : 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const formatDate = (tickItem: string) => {
    return new Date(tickItem).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  
  const formatCurrency = (value: number) => `R$${value.toFixed(2)}`;

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-dark-text-primary">Evolução do Custo por Lead (CPL)</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={aggregatedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#F9FAFB' }}
              formatter={(value: number) => [formatCurrency(value), 'CPL']}
            />
            <Legend wrapperStyle={{ color: '#F9FAFB' }} />
            <Line type="monotone" dataKey="cpl" stroke="#6366F1" name="CPL" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CplTimelineChart;
