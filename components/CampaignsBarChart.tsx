import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { CampaignData } from '../types';

interface CampaignsBarChartProps {
  data: CampaignData[];
}

const CampaignsBarChart: React.FC<CampaignsBarChartProps> = ({ data }) => {
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

  return (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-dark-text-primary">Desempenho por Campanha</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={aggregatedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9CA3AF" />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#9CA3AF" 
              width={120} 
              tick={{ fontSize: 12 }} 
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#F9FAFB' }}
            />
            <Legend wrapperStyle={{ color: '#F9FAFB' }} />
            <Bar dataKey="qualified" fill="#10B981" name="Leads Qualificados">
                <LabelList dataKey="qualified" position="right" style={{ fill: '#F9FAFB', fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CampaignsBarChart;
