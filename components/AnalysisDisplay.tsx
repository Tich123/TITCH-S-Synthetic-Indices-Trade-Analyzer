
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
  
  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const formatText = (text: string) => {
    const blocks = text.split('\n\n');
    return blocks.map((block, index) => {
      const lines = block.split('\n');
      
      // Check for numbered lists
      if (lines.every(line => /^\d+\.\s/.test(line))) {
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 my-4">
            {lines.map((item, itemIndex) => (
              <li key={itemIndex}>{parseInlineFormatting(item.replace(/^\d+\.\s/, ''))}</li>
            ))}
          </ol>
        );
      }

      // Check for bulleted lists
      if (lines.every(line => /^- /.test(line))) {
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4">
            {lines.map((item, itemIndex) => (
              <li key={itemIndex}>{parseInlineFormatting(item.substring(2))}</li>
            ))}
          </ul>
        );
      }

      // Handle paragraphs and headings
      return (
        <div key={index}>
          {lines.map((line, lineIndex) => {
            if (/^\*\*.*\*\*$/.test(line)) {
              return <h3 key={lineIndex} className="text-lg font-semibold mt-4 mb-2">{line.slice(2, -2)}</h3>
            }
            return <p key={lineIndex} className="my-2">{parseInlineFormatting(line)}</p>;
          })}
        </div>
      );
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
