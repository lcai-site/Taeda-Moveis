import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CampaignData, AggregationLevel } from './types';
import { fetchCampaignData } from './services/googleSheetsService';
import Sidebar from './components/Sidebar';
import DashboardGrid from './components/DashboardGrid';
import InsightsGenerator from './components/InsightsGenerator';
import SettingsModal from './components/SettingsModal';
import { useSummaryMetrics } from './hooks/useSummaryMetrics';

type ActiveTab = 'consolidated' | 'facebook' | 'instagram';
export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));

  const [startDate, setStartDate] = useState<string>(thirtyDaysAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);
  const [data, setData] = useState<CampaignData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('consolidated');
  const [aggregation, setAggregation] = useState<AggregationLevel>('daily');
  
  // Settings State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // Load settings from localStorage on initial render
    const savedTheme = localStorage.getItem('dashboard-theme') as Theme | null;
    const savedApiKey = localStorage.getItem('dashboard-api-key');
    if (savedTheme) setTheme(savedTheme);
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);
  
  useEffect(() => {
    // Apply theme class to the root element
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    // Add a day to the end date to make it inclusive in the filter
    const inclusiveEndDate = new Date(endDate);
    inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);

    fetchCampaignData(new Date(startDate), new Date(inclusiveEndDate))
      .then(result => {
        setData(result);
        setIsLoading(false);
      })
      .catch(err => {
        setError("Failed to load campaign data.");
        setIsLoading(false);
        console.error(err);
      });
  }, [startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 180) {
      setAggregation('monthly');
    } else if (diffDays > 60) {
      setAggregation('weekly');
    } else {
      setAggregation('daily');
    }
  }, [startDate, endDate]);

  const handleSetDateRange = (days: number) => {
    const newEndDate = new Date();
    const newStartDate = new Date();
    newStartDate.setDate(newEndDate.getDate() - days);
    setEndDate(newEndDate.toISOString().split('T')[0]);
    setStartDate(newStartDate.toISOString().split('T')[0]);
  };
  
  const filteredData = useMemo(() => {
    if (activeTab === 'facebook') {
      return data.filter(d => d.source.toLowerCase() === 'facebook');
    }
    if (activeTab === 'instagram') {
      return data.filter(d => d.source.toLowerCase() === 'instagram');
    }
    return data;
  }, [data, activeTab]);

  const summaryMetrics = useSummaryMetrics(filteredData);
  
  const TABS: { id: ActiveTab; label: string }[] = [
    { id: 'consolidated', label: 'Consolidado' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
  ];
  
  const AggregationButton: React.FC<{level: AggregationLevel, label: string}> = ({ level, label }) => (
      <button
        onClick={() => setAggregation(level)}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${aggregation === level ? 'bg-brand-primary text-white' : 'bg-light-border dark:bg-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'}`}
      >
        {label}
      </button>
  );

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary font-sans">
      <Sidebar 
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSetDateRange={handleSetDateRange}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                  <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary tracking-tight">
                    Meta Ads Performance
                  </h1>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
                    Dashboard de resultados de campanhas para clientes.
                  </p>
              </div>
              <InsightsGenerator 
                data={filteredData} 
                metrics={summaryMetrics} 
                startDate={startDate} 
                endDate={endDate} 
                apiKey={apiKey}
              />
          </div>

          <div className="border-b border-light-border dark:border-dark-border mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:border-gray-300 dark:hover:border-gray-500'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Visualizar por:</span>
            <AggregationButton level="daily" label="Diário" />
            <AggregationButton level="weekly" label="Semanal" />
            <AggregationButton level="monthly" label="Mensal" />
          </div>

          <DashboardGrid 
            data={filteredData} 
            isLoading={isLoading} 
            error={error}
            aggregation={aggregation}
            activeTab={activeTab}
            theme={theme}
          />
        </div>
      </main>
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        currentApiKey={apiKey}
        onApiKeyChange={setApiKey}
      />
    </div>
  );
};

export default App;