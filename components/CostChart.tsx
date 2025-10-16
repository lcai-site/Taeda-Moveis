import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CampaignData } from '../types';

interface CostChartProps {
  data: CampaignData[];
}

const CostChart: React.FC<CostChartProps> = ({ data }) => {
  const aggregatedData = useMemo(() => {
    const dailyData: { [key: string]: { date: string; cost: number } } = {};

    data.forEach(item => {
      if (!dailyData[item.date]) {
        dailyData[item.date] = { date: item.date, cost: 0 };
      }
      dailyData[item.date].cost += item.cost;
    });
    
    return Object.values(dailyData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const formatDate = (tickItem: string) => {
    return new Date(tickItem).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const formatCurrency = (value: number) => `R$${value.toFixed(2)}`;

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-dark-text-primary">Análise de Custos</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#F9FAFB' }}
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
