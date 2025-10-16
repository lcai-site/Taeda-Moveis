import React, { useState, useEffect } from 'react';
import { Theme } from '../App';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  currentApiKey: string;
  onApiKeyChange: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  currentTheme,
  onThemeChange,
  currentApiKey,
  onApiKeyChange
}) => {
  const [localApiKey, setLocalApiKey] = useState(currentApiKey);
  const [localTheme, setLocalTheme] = useState(currentTheme);

  useEffect(() => {
    setLocalApiKey(currentApiKey);
    setLocalTheme(currentTheme);
  }, [isOpen, currentApiKey, currentTheme]);

  const handleSave = () => {
    // Save to parent state
    onApiKeyChange(localApiKey);
    onThemeChange(localTheme);
    
    // Save to localStorage
    localStorage.setItem('dashboard-api-key', localApiKey);
    localStorage.setItem('dashboard-theme', localTheme);
    
    onClose();
  };
  
  const handleCancel = () => {
    // Reset local state to what it was
    setLocalApiKey(currentApiKey);
    setLocalTheme(currentTheme);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl max-w-md w-full border border-light-border dark:border-dark-border">
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">Configurações</h2>
            <button onClick={handleCancel} className="text-light-text-secondary dark:text-dark-text-secondary text-2xl leading-none hover:text-light-text-primary dark:hover:text-dark-text-primary">&times;</button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
              Chave da API do Gemini
            </label>
            <input
              type="password"
              id="api-key"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Cole sua chave da API aqui"
              className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-md px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
            />
             <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                Sua chave é salva apenas no seu navegador.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
              Tema da Interface
            </label>
            <div className="flex items-center gap-4">
                <button onClick={() => setLocalTheme('light')} className={`px-4 py-2 rounded-md text-sm ${localTheme === 'light' ? 'bg-brand-primary text-white' : 'bg-light-border dark:bg-dark-border'}`}>
                    Claro
                </button>
                <button onClick={() => setLocalTheme('dark')} className={`px-4 py-2 rounded-md text-sm ${localTheme === 'dark' ? 'bg-brand-primary text-white' : 'bg-light-border dark:bg-dark-border'}`}>
                    Escuro
                </button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-light-bg dark:bg-dark-bg rounded-b-lg border-t border-light-border dark:border-dark-border flex justify-end gap-3">
            <button
                onClick={handleCancel}
                className="px-4 py-2 border border-light-border dark:border-dark-border text-sm font-medium rounded-md shadow-sm text-light-text-primary dark:text-dark-text-primary bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
                Cancelar
            </button>
            <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-700 focus:outline-none"
            >
                Salvar Alterações
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;