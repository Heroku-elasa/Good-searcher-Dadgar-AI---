import React from 'react';
import DraftingForm from './GeneratorForm';
import DocumentDisplay from './ReportDisplay';
import DeeperAnalysis from './DeeperAnalysis';

interface LegalDrafterProps {
  onGenerate: (topic: string, description: string, docType: string) => void;
  generatedDocument: string;
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
  topic: string;
  description: string;
  docType: string;
  setTopic: (value: string) => void;
  setDescription: (value: string) => void;
  setDocType: (value: string) => void;
  isQuotaExhausted: boolean;
  onAnalyze: () => void;
  analysisResult: string;
  isAnalyzing: boolean;
  analysisError: string | null;
}

const LegalDrafter: React.FC<LegalDrafterProps> = ({ 
  onGenerate, 
  generatedDocument, 
  isLoading, 
  error, 
  isComplete, 
  topic, 
  description, 
  docType, 
  setTopic, 
  setDescription, 
  setDocType,
  isQuotaExhausted,
  onAnalyze,
  analysisResult,
  isAnalyzing,
  analysisError
}) => {
  return (
    <section id="generator" className="py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="lg:sticky top-28">
          <DraftingForm 
            onGenerate={onGenerate} 
            isLoading={isLoading} 
            isComplete={isComplete}
            topic={topic}
            description={description}
            docType={docType}
            setTopic={setTopic}
            setDescription={setDescription}
            setDocType={setDocType}
            isQuotaExhausted={isQuotaExhausted}
          />
        </div>
        <div className="space-y-8">
            <div className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700">
                <DocumentDisplay generatedDocument={generatedDocument} isLoading={isLoading} error={error} />
            </div>
            {isComplete && (
                <DeeperAnalysis
                    onAnalyze={onAnalyze}
                    result={analysisResult}
                    isLoading={isAnalyzing}
                    error={analysisError}
                    isQuotaExhausted={isQuotaExhausted}
                />
            )}
        </div>
      </div>
    </section>
  );
};

export default LegalDrafter;