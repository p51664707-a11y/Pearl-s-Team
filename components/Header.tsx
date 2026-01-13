
import React from 'react';
import { AshokaChakra } from './AshokaChakra';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-t-4 border-india-saffron">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="relative">
            <AshokaChakra size={44} className="animate-spin-slow text-india-blue drop-shadow-sm transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-india-blue/5 blur-xl rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-serif tracking-tight leading-none">
              BHARAT <span className="text-india-saffron">MISINFO</span><span className="text-india-green">RMATION</span> MONITOR
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-india-blue/40">
           <ShieldCheck size={20} />
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-india-saffron/30 via-india-blue/30 to-india-green/30"></div>
    </header>
  );
};
