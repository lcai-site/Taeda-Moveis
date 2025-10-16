import React from 'react';

interface SidebarProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSetDateRange: (days: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange, onSetDateRange }) => {
  const quickFilters = [
    { label: '7 Dias', days: 7 },
    { label: '15 Dias', days: 15 },
    { label: '30 Dias', days: 30 },
    { label: '90 Dias', days: 90 },
    { label: '180 Dias', days: 180 },
    { label: '1 Ano', days: 365 },
  ];

  return (
    <aside className="w-64 bg-dark-card border-r border-dark-border p-6 flex-shrink-0 hidden lg:flex flex-col">
      <div className="mb-8">
        <img 
          src="https://i.postimg.cc/y81Ncp2B/Chat-GPT-Image-16-de-out-de-2025-08-14-19.png" 
          alt="Taeda Móveis Logo" 
          className="w-40 h-auto"
        />
      </div>
      
      <h3 className="text-sm font-semibold text-dark-text-secondary uppercase tracking-wider mb-4">Filtros Rápidos</h3>
      <div className="flex flex-col gap-2 mb-8">
        {quickFilters.map(filter => (
          <button 
            key={filter.days} 
            onClick={() => onSetDateRange(filter.days)}
            className="w-full text-left px-3 py-2 text-sm rounded-md text-dark-text-primary bg-dark-bg hover:bg-dark-border transition-colors duration-200"
          >
            Últimos {filter.label}
          </button>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-dark-text-secondary uppercase tracking-wider mb-4">Período Customizado</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="start-date" className="block text-xs font-medium text-dark-text-secondary mb-1">
            Início
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text-primary rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-xs font-medium text-dark-text-secondary mb-1">
            Fim
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border text-dark-text-primary rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
