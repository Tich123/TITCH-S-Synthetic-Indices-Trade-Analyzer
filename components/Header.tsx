
import React from 'react';
import { ChartBarIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-dark-base-200 border-b border-dark-base-300 shadow-md">
      <div className="container mx-auto px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <ChartBarIcon className="h-8 w-8 text-brand-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-dark-content">
            Synthetic Indices Trade Analyzer
          </h1>
        </div>
        <p className="mt-2 text-sm md:text-base text-gray-400">
          Upload a chart screenshot and get an AI-powered technical analysis.
        </p>
      </div>
    </header>
  );
};

export default Header;
