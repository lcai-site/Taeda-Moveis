import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CampaignData, AggregationLevel } from '../types';

interface CostChartProps {
  data: CampaignData[];
  aggregation: AggregationLevel;
}

const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

const CostChart: React.FC<CostChartProps> = ({ data, aggregation }) => {
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