
import React from 'react';
import { AshokaChakra } from './AshokaChakra';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg border-t-4 border-india-saffron">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <AshokaChakra size={48} className="animate-spin-slow text-india-blue drop-shadow-sm" />
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-10 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 font-serif tracking-tight leading-none">
              BHARAT <span className="text-india-saffron">MISINFO</span><span className="text-india-green">RMATION</span> MONITOR
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-0.5 w-8 bg-india-blue rounded-full"></span>
              <p className="text-[10px] md:text-xs text-gray-500 font-sans font-semibold tracking-[0.2em] uppercase">
                Strategic Information Warfare Simulator
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-india-saffron via-white to-india-green opacity-50"></div>
    </header>
  );
};
