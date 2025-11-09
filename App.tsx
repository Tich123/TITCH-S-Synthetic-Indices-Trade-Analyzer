
import React, { useState, useCallback } from 'react';
import { analyzeChartImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import Disclaimer from './components/Disclaimer';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageSelect = (file: File | null) => {
    setAnalysis('');
    setError('');
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove the data URI prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setAnalysis('');
    setError('');

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await analyzeChartImage(base64Image, imageFile.type);
      setAnalysis(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(`Analysis failed: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-dark-base-100 text-dark-content flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8">
          <ImageUploader 
            onImageSelect={handleImageSelect}
            imagePreviewUrl={imagePreviewUrl}
            isLoading={isLoading}
          />
          
          {imageFile && (
            <div className="flex justify-center">
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading}
                className="w-full md:w-auto flex items-center justify-center px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Chart'
                )}
              </button>
            </div>
          )}

          <AnalysisDisplay analysis={analysis} isLoading={isLoading} error={error} />
        </div>
      </main>
      <Disclaimer />
    </div>
  );
};

export default App;
