import React from 'react';
import { Theme } from '../App';

interface SidebarProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSetDateRange: (days: number) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onSetDateRange, 
  theme,
  onThemeChange,
  isOpen,
  onClose
}) => {
  const quickFilters = [
    { label: '7 Dias', days: 7 },
    { label: '15 Dias', days: 15 },
    { label: '30 Dias', days: 30 },
    { label: '90 Dias', days: 90 },
    { label: '180 Dias', days: 180 },
    { label: '1 Ano', days: 365 },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border p-6 flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:flex ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <img 
            src="https://i.postimg.cc/y81Ncp2B/Chat-GPT-Image-16-de-out-de-2025-08-14-19.png" 
            alt="Taeda Móveis Logo" 
            className="w-40 h-auto"
          />
          <button onClick={onClose} className="lg:hidden p-1 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border dark:hover:bg-dark-border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <h3 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-4">Filtros Rápidos</h3>
          <div className="flex flex-col gap-2 mb-8">
            {quickFilters.map(filter => (
              <button 
                key={filter.days} 
                onClick={() => { onSetDateRange(filter.days); onClose(); }}
                className="w-full text-left px-3 py-2 text-sm rounded-md text-light-text-primary dark:text-dark-text-primary bg-light-bg dark:bg-dark-bg hover:bg-light-border dark:hover:bg-dark-border transition-colors duration-200"
              >
                Últimos {filter.label}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-4">Período Customizado</h3>
          <div className="flex flex-col gap-4 mb-8">
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

          <h3 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-4">Configurações</h3>
          <div>
              <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Tema da Interface
              </label>
              <div className="flex items-center gap-2">
                  <button onClick={() => onThemeChange('light')} className={`w-full text-center px-4 py-2 rounded-md text-sm ${theme === 'light' ? 'bg-brand-primary text-white' : 'bg-light-bg dark:bg-dark-bg'}`}>
                      Claro
                  </button>
                  <button onClick={() => onThemeChange('dark')} className={`w-full text-center px-4 py-2 rounded-md text-sm ${theme === 'dark' ? 'bg-brand-primary text-white' : 'bg-light-bg dark:bg-dark-bg'}`}>
                      Escuro
                  </button>
              </div>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;