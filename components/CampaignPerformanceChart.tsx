import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CampaignData } from '../types';

interface CampaignPerformanceChartProps {
  data: CampaignData[];
  startDate: string;
  endDate: string;
}

type AggregationLevel = 'daily' | 'weekly' | 'monthly';

// Helper to get the start of the week (Sunday)
const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

const CampaignPerformanceChart: React.FC<CampaignPerformanceChartProps> = ({ data, startDate, endDate }) => {
  const [aggregation, setAggregation] = useState<AggregationLevel>('daily');

  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 180) {
      setAggregation('monthly');
    } else if (diffDays > 60) {
      setAggregation('weekly');
    } else {
      setAggregation('daily');
    }
  }, [startDate, endDate]);

  const aggregatedData = useMemo(() => {
    const dailyData: { [key: string]: { date: string; qualified: number; disqualified: number } } = {};

    data.forEach(item => {
      if (!dailyData[item.date]) {
        dailyData[item.date] = { date: item.date, qualified: 0, disqualified: 0 };
      }
      dailyData[item.date].qualified += item.qualified;
      dailyData[item.date].disqualified += item.disqualified;
    });

    const sortedDailyData = Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (aggregation === 'daily') {
      return sortedDailyData;
    }

    if (aggregation === 'weekly') {
      const weeklyData: { [key: string]: { date: string; qualified: number; disqualified: number } } = {};
      sortedDailyData.forEach(item => {
        const weekStartDate = getStartOfWeek(new Date(item.date)).toISOString().split('T')[0];
        if (!weeklyData[weekStartDate]) {
          weeklyData[weekStartDate] = { date: weekStartDate, qualified: 0, disqualified: 0 };
        }
        weeklyData[weekStartDate].qualified += item.qualified;
        weeklyData[weekStartDate].disqualified += item.disqualified;
      });
      return Object.values(weeklyData);
    }
    
    if (aggregation === 'monthly') {
      const monthlyData: { [key: string]: { date: string; qualified: number; disqualified: number } } = {};
      sortedDailyData.forEach(item => {
        const monthStartDate = new Date(item.date).toISOString().slice(0, 7) + '-01';
        if (!monthlyData[monthStartDate]) {
          monthlyData[monthStartDate] = { date: monthStartDate, qualified: 0, disqualified: 0 };
        }
        monthlyData[monthStartDate].qualified += item.qualified;
        monthlyData[monthStartDate].disqualified += item.disqualified;
      });
      return Object.values(monthlyData);
    }

    return [];
  }, [data, aggregation]);

  const formatDate = (tickItem: string) => {
    const date = new Date(tickItem);
    date.setUTCHours(12); // Avoid timezone issues
    if (aggregation === 'monthly') return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const AggregationButton: React.FC<{level: AggregationLevel, label: string}> = ({ level, label }) => (
      <button
        onClick={() => setAggregation(level)}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${aggregation === level ? 'bg-brand-primary text-white' : 'bg-dark-border text-dark-text-secondary hover:bg-gray-600'}`}
      >
        {label}
      </button>
  );

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-xl font-semibold text-dark-text-primary">Desempenho da Campanha</h3>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <AggregationButton level="daily" label="Diário" />
          <AggregationButton level="weekly" label="Semanal" />
          <AggregationButton level="monthly" label="Mensal" />
        </div>
      </div>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={aggregatedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#F9FAFB' }}
              labelFormatter={formatDate}
            />
            <Legend wrapperStyle={{ color: '#F9FAFB' }} />
            <Bar dataKey="qualified" stackId="a" fill="#10B981" name="Qualificados" />
            <Bar dataKey="disqualified" stackId="a" fill="#EF4444" name="Desqualificados" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignPerformanceChart;
