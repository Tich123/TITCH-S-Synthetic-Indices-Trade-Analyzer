
import React from 'react';

interface AnalysisDisplayProps {
  analysis: string;
  isLoading: boolean;
  error: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-dark-base-200 p-6 rounded-lg border border-dark-base-300 w-full animate-pulse">
        <div className="h-4 bg-dark-base-300 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-dark-base-300 rounded w-full"></div>
          <div className="h-3 bg-dark-base-300 rounded w-5/6"></div>
          <div className="h-3 bg-dark-base-300 rounded w-full"></div>
          <div className="h-3 bg-dark-base-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-error text-error p-4 rounded-lg w-full">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-dark-base-200 p-6 text-center rounded-lg border border-dark-base-300 w-full">
        <p className="text-gray-400">Your analysis will appear here.</p>
      </div>
    );
  }
  
  // Basic markdown-like formatting for headings and bold text
  const formatText = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-bold my-2">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('* **') && line.endsWith('**')) {
            return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.slice(4,-2)}</h3>
        }
        if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
            return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line}</h3>
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-5 list-disc">{line.slice(2)}</li>;
        }
        return <p key={index}>{line}</p>;
      });
  };

  return (
    <div className="bg-dark-base-200 p-6 rounded-lg border border-dark-base-300 w-full">
      <h2 className="text-xl font-bold mb-4 text-brand-primary border-b border-dark-base-300 pb-2">AI Analysis</h2>
      <div className="prose prose-invert max-w-none text-dark-content whitespace-pre-wrap space-y-2">
        {formatText(analysis)}
      </div>
    </div>
  );
};

export default AnalysisDisplay;
