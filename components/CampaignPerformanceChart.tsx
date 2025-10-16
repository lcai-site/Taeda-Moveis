import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CampaignData, AggregationLevel } from '../types';
import { Theme } from '../App';

interface CampaignPerformanceChartProps {
  data: CampaignData[];
  aggregation: AggregationLevel;
  theme: Theme;
}

// Helper to get the start of the week (Sunday)
const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

const CampaignPerformanceChart: React.FC<CampaignPerformanceChartProps> = ({ data, aggregation, theme }) => {

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
  
  const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const tooltipBackgroundColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';
  const tooltipBorderColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const legendColor = theme === 'dark' ? '#F9FAFB' : '#374151';

  return (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">Desempenho da Campanha</h3>
      </div>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={aggregatedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke={tickColor} />
            <YAxis stroke={tickColor} />
            <Tooltip
              contentStyle={{ backgroundColor: tooltipBackgroundColor, border: `1px solid ${tooltipBorderColor}`, color: tickColor }}
              labelStyle={{ color: legendColor }}
              labelFormatter={formatDate}
            />
            <Legend wrapperStyle={{ color: legendColor }} />
            <Bar dataKey="qualified" stackId="a" fill="#10B981" name="Qualificados" />
            <Bar dataKey="disqualified" stackId="a" fill="#EF4444" name="Desqualificados" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignPerformanceChart;