import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SourcePieChartProps {
  data: { name: string; value: number }[];
  title: string;
}

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

const SourcePieChart: React.FC<SourcePieChartProps> = ({ data, title }) => {
  if (data.length === 0) {
    return (
      <div className="bg-dark-card p-6 rounded-lg border border-dark-border shadow-lg h-full flex flex-col">
        <h3 className="text-xl font-semibold mb-4 text-dark-text-primary">{title}</h3>
        <div className="flex-grow flex items-center justify-center">
            <p className="text-dark-text-secondary">Não há dados para exibir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-dark-text-primary">{title}</h3>
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
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              itemStyle={{ color: '#F9FAFB' }}
            />
            <Legend wrapperStyle={{ color: '#F9FAFB', paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SourcePieChart;