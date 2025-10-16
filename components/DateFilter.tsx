
import React from 'react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <label htmlFor="start-date" className="text-sm font-medium text-dark-text-secondary">
        Período:
      </label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="bg-dark-card border border-dark-border text-dark-text-primary rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
        />
        <span className="text-dark-text-secondary">até</span>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="bg-dark-card border border-dark-border text-dark-text-primary rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
    </div>
  );
};

export default DateFilter;
