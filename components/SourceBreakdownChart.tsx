import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Theme } from '../App';

interface SourcePieChartProps {
  data: { name: string; value: number }[];
  title: string;
  theme: Theme;
}

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

const SourcePieChart: React.FC<SourcePieChartProps> = ({ data, title, theme }) => {
  const legendColor = theme === 'dark' ? '#F9FAFB' : '#374151';
  const tooltipBackgroundColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';
  const tooltipBorderColor = theme === 'dark' ? '#374151' : '#E5E7EB';

  if (data.length === 0) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border shadow-lg h-full flex flex-col">
        <h3 className="text-xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">{title}</h3>
        <div className="flex-grow flex items-center justify-center">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">Não há dados para exibir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">{title}</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: tooltipBackgroundColor, border: `1px solid ${tooltipBorderColor}` }}
              itemStyle={{ color: legendColor }}
            />
            <Legend wrapperStyle={{ color: legendColor, paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SourcePieChart;