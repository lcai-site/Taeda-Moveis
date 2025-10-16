// @ts-nocheck
import React, { useState, useCallback, useRef } from 'react';
import { generateInsights } from '../services/geminiService';
import { CampaignData } from '../types';

interface InsightsGeneratorProps {
    data: CampaignData[];
    metrics: {
        totalContacts: number;
        totalQualified: number;
        totalDisqualified: number;
    };
    startDate: string;
    endDate: string;
}

const InsightsGenerator: React.FC<InsightsGeneratorProps> = ({ data, metrics, startDate, endDate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const insightsRef = useRef<HTMLDivElement>(null);

    const handleGenerateInsights = useCallback(async () => {
        setIsLoading(true);
        setInsights(null);
        setShowModal(true);
        const result = await generateInsights(data, metrics, startDate, endDate);
        setInsights(result);
        setIsLoading(false);
    }, [data, metrics, startDate, endDate]);

    const handleDownloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const input = insightsRef.current;
        if (!input) return;

        html2canvas(input, { scale: 2, backgroundColor: '#1F2937' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const imgWidth = pdfWidth - 20; // with margin
            const imgHeight = imgWidth / ratio;

            // Header
            pdf.setFontSize(18);
            pdf.setTextColor('#111827');
            pdf.text('Análise de Performance Meta Ads', 10, 15);
            
            pdf.setFontSize(10);
            pdf.setTextColor('#374151');
            const formattedStartDate = new Date(startDate + 'T12:00:00Z').toLocaleDateString('pt-BR');
            const formattedEndDate = new Date(endDate + 'T12:00:00Z').toLocaleDateString('pt-BR');
            pdf.text(`Período: ${formattedStartDate} a ${formattedEndDate}`, 10, 22);
            
            pdf.setDrawColor('#e5e7eb');
            pdf.line(10, 25, pdfWidth - 10, 25);
            
            // Image of insights
            let yPosition = 30;
            if (yPosition + imgHeight > pdfHeight - 15) { // check if content fits
              // This basic implementation adds the image. For very long content, pagination would be needed.
              pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
            } else {
              pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
            }
            
            // Footer
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor('#9CA3AF');
                pdf.text(`Página ${i} de ${pageCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
            }

            pdf.save(`analise-campanha-${startDate}-a-${endDate}.pdf`);
        });
    };

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
                    <div className="bg-dark-card rounded-lg shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh] border border-dark-border">
                        <div className="p-6 border-b border-dark-border">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-dark-text-primary">Análise da Campanha</h2>
                                <button onClick={() => setShowModal(false)} className="text-dark-text-secondary text-2xl leading-none hover:text-dark-text-primary">&times;</button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {isLoading && <div className="text-center text-dark-text-secondary">Gerando insights, por favor aguarde...</div>}
                            {insights && (
                                <div ref={insightsRef} className="prose prose-invert prose-sm text-dark-text-secondary max-w-none">
                                    {renderFormattedInsights(insights)}
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-dark-bg rounded-b-lg border-t border-dark-border mt-auto">
                            {!isLoading && insights && (
                                <button
                                    onClick={handleDownloadPdf}
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-brand-secondary"
                                >
                                    Baixar PDF
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InsightsGenerator;