// @ts-nocheck
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
    startDate: string;
    endDate: string;
}

const InsightsGenerator: React.FC<InsightsGeneratorProps> = ({ data, metrics, startDate, endDate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleGenerateInsights = useCallback(async () => {
        setIsLoading(true);
        setInsights(null);
        setShowModal(true);
        const result = await generateInsights(data, metrics, startDate, endDate);
        setInsights(result);
        setIsLoading(false);
    }, [data, metrics, startDate, endDate]);

    const handleDownloadPdf = () => {
        if (!insights) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const contentWidth = pageWidth - margin * 2;
        let y = margin + 20;

        const checkPageBreak = (heightNeeded: number) => {
            if (y + heightNeeded > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        };

        // --- Header ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Análise de Performance Meta Ads', margin, margin);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const formattedStartDate = new Date(startDate + 'T12:00:00Z').toLocaleDateString('pt-BR');
        const formattedEndDate = new Date(endDate + 'T12:00:00Z').toLocaleDateString('pt-BR');
        doc.text(`Período: ${formattedStartDate} a ${formattedEndDate}`, margin, margin + 8);
        doc.setDrawColor(221, 221, 221);
        doc.line(margin, margin + 12, pageWidth - margin, margin + 12);

        // --- Content ---
        const lines = insights.split('\n');
        lines.forEach(line => {
            if (line.trim() === '') {
                y += 5;
                return;
            }

            const cleanLine = line.replace(/\*\*/g, ''); // Remove bold markers for PDF

            checkPageBreak(10); 
            
            if (line.startsWith('# ')) {
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                const splitText = doc.splitTextToSize(cleanLine.replace('# ', ''), contentWidth);
                doc.text(splitText, margin, y);
                y += (splitText.length * 7) + 4;
            } else if (line.startsWith('## ')) {
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                const splitText = doc.splitTextToSize(cleanLine.replace('## ', ''), contentWidth);
                doc.text(splitText, margin, y);
                y += (splitText.length * 6) + 3;
            } else if (line.startsWith('* ')) {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                const listItemText = cleanLine.replace('* ', '');
                const splitText = doc.splitTextToSize(listItemText, contentWidth - 5);
                doc.text('•', margin, y, { baseline: 'top' });
                doc.text(splitText, margin + 5, y);
                y += (splitText.length * 5) + 3;
            } else {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                const splitText = doc.splitTextToSize(cleanLine, contentWidth);
                doc.text(splitText, margin, y);
                y += (splitText.length * 5) + 3;
            }
        });

        // --- Footer ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        doc.save(`analise-campanha-${startDate}-a-${endDate}.pdf`);
    };

    const renderFormattedInsights = (text: string) => {
        let isList = false;
        return text.split('\n').map((line, index) => {
            const renderTextWithBold = (textLine: string) => {
                const parts = textLine.split(/\*\*(.*?)\*\*/g);
                return parts.map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                );
            };

            if (line.startsWith('# ')) {
                isList = false;
                return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
            }
            if (line.startsWith('## ')) {
                isList = false;
                return <h2 key={index} className="text-xl font-bold mt-5 mb-2">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('* ')) {
                const content = <li key={index} className="ml-5 list-disc">{renderTextWithBold(line.substring(2))}</li>;
                if (!isList) {
                    isList = true;
                    return <ul key={`ul-${index}`} className="mt-2">{content}</ul>;
                }
                return content;
            }
            isList = false;
            if (line.trim() === '') {
                return <div key={index} className="h-4" />;
            }
            return <p key={index} className="my-2">{renderTextWithBold(line)}</p>;
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
                        <div className="p-6 overflow-y-auto text-dark-text-secondary">
                            {isLoading && <div className="text-center text-dark-text-secondary">Gerando insights, por favor aguarde...</div>}
                            {insights && renderFormattedInsights(insights)}
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