
import React, { useState, useCallback } from 'react';
import { generateInsights } from '../services/geminiService';
import { CampaignData } from '../types';

interface InsightsGeneratorProps {
    data: CampaignData[];
    metrics: {
        totalContacts: number;
        totalQualified: number;
        totalDisqualified: number;
    };
}

const InsightsGenerator: React.FC<InsightsGeneratorProps> = ({ data, metrics }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleGenerateInsights = useCallback(async () => {
        setIsLoading(true);
        setInsights(null);
        setShowModal(true);
        const result = await generateInsights(data, metrics);
        setInsights(result);
        setIsLoading(false);
    }, [data, metrics]);

    const renderFormattedInsights = (text: string) => {
        return text
            .split('\n')
            .map((line, index) => {
                if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                if (line.startsWith('* ')) return <li key={index} className="ml-4 list-disc">{line.replace('* ', '')}</li>;
                return <p key={index} className="my-2">{line}</p>;
            });
    };

    return (
        <>
            <button
                onClick={handleGenerateInsights}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-primary disabled:bg-gray-500"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analisando...
                    </>
                ) : (
                    "Gerar Análise com IA"
                )}
            </button>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-border">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-dark-text-primary">Análise da Campanha</h2>
                                <button onClick={() => setShowModal(false)} className="text-dark-text-secondary hover:text-dark-text-primary">&times;</button>
                            </div>
                            {isLoading && <p>Gerando insights, por favor aguarde...</p>}
                            {insights && (
                                <div className="prose prose-invert prose-sm text-dark-text-secondary">
                                    {renderFormattedInsights(insights)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InsightsGenerator;
