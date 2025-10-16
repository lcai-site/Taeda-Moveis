import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { CampaignData } from '../types';
import { Theme } from '../App';


interface CampaignsBarChartProps {
  data: CampaignData[];
  theme: Theme;
}

const CampaignsBarChart: React.FC<CampaignsBarChartProps> = ({ data, theme }) => {
  const aggregatedData = useMemo(() => {
    const campaignData: { [key: string]: { name: string; qualified: number } } = {};

    data.forEach(item => {
      if (!campaignData[item.campaign]) {
        campaignData[item.campaign] = { name: item.campaign, qualified: 0 };
      }
      campaignData[item.campaign].qualified += item.qualified;
    });

    return Object.values(campaignData).sort((a, b) => a.qualified - b.qualified);
  }, [data]);
  
  const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const tooltipBackgroundColor = theme === 'dark' ? '#1F2937' : '#FFFFFF';
  const tooltipBorderColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const legendColor = theme === 'dark' ? '#F9FAFB' : '#374151';
  const labelColor = theme === 'dark' ? '#F9FAFB' : '#111827';

  return (
    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg border border-light-border dark:border-dark-border shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-light-text-primary dark:text-dark-text-primary">Desempenho por Campanha</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={aggregatedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis type="number" stroke={tickColor} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke={tickColor} 
              width={120} 
              tick={{ fontSize: 12 }} 
            />
            <Tooltip
              contentStyle={{ backgroundColor: tooltipBackgroundColor, border: `1px solid ${tooltipBorderColor}` }}
              labelStyle={{ color: legendColor }}
            />
            <Legend wrapperStyle={{ color: legendColor }} />
            <Bar dataKey="qualified" fill="#10B981" name="Leads Qualificados">
                <LabelList dataKey="qualified" position="right" style={{ fill: labelColor, fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignsBarChart;