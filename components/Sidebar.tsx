import React from 'react';
import { SettingsIcon } from './SettingsIcon';

interface SidebarProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSetDateRange: (days: number) => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange, onSetDateRange, onOpenSettings }) => {
  const quickFilters = [
    { label: '7 Dias', days: 7 },
    { label: '15 Dias', days: 15 },
    { label: '30 Dias', days: 30 },
    { label: '90 Dias', days: 90 },
    { label: '180 Dias', days: 180 },
    { label: '1 Ano', days: 365 },
  ];

  return (
    <aside className="w-64 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border p-6 flex-shrink-0 hidden lg:flex flex-col">
      <div className="mb-8">
        <img 
          src="https://i.postimg.cc/y81Ncp2B/Chat-GPT-Image-16-de-out-de-2025-08-14-19.png" 
          alt="Taeda Móveis Logo" 
          className="w-40 h-auto"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-4">Filtros Rápidos</h3>
        <div className="flex flex-col gap-2 mb-8">
          {quickFilters.map(filter => (
            <button 
              key={filter.days} 
              onClick={() => onSetDateRange(filter.days)}
              className="w-full text-left px-3 py-2 text-sm rounded-md text-light-text-primary dark:text-dark-text-primary bg-light-bg dark:bg-dark-bg hover:bg-light-border dark:hover:bg-dark-border transition-colors duration-200"
            >
              Últimos {filter.label}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-4">Período Customizado</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="start-date" className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Início
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Fim
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border dark:hover:bg-dark-border hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors duration-200"
        >
          <SettingsIcon className="h-5 w-5" />
          Configurações
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;