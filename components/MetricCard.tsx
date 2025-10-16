import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, description }) => {
  return (
    <div className="bg-light-card dark:bg-dark-card p-4 sm:p-6 rounded-lg border border-light-border dark:border-dark-border shadow-lg flex items-start gap-4">
      <div className="flex-shrink-0 pt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider truncate">{title}</h3>
        <p className="text-2xl xl:text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mt-1 break-words">{value}</p>
        {description && <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-2">{description}</p>}
      </div>
    </div>
  );
};

export default MetricCard;