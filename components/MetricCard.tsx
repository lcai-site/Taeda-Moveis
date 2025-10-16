
import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, description }) => {
  return (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border shadow-lg flex items-start gap-4">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-dark-text-secondary uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-dark-text-primary mt-1">{value}</p>
        {description && <p className="text-xs text-dark-text-secondary mt-2">{description}</p>}
      </div>
    </div>
  );
};

export default MetricCard;
