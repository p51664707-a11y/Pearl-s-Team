
import React from 'react';
import { Stance, Category } from '../types';
import { Megaphone, AlertOctagon, Globe2, ShieldAlert } from 'lucide-react';

interface StanceSelectorProps {
  category: Category;
  onSelect: (stance: Stance) => void;
}

export const StanceSelector: React.FC<StanceSelectorProps> = ({ category, onSelect }) => {
  const isDomestic = category === Category.DOMESTIC;

  return (
    <div className="animate-fade-in pb-8">
      <div className="text-center mb-10">
         <span className="text-india-blue font-bold text-sm tracking-widest uppercase">Phase 4</span>
         <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">
            {isDomestic ? "Select Narrative Stance" : "Select Information Operation Goal"}
         </h2>
         <p className="text-gray-500 mt-1">
            {isDomestic ? "Determine the political alignment of the simulated vector" : "Define the objective of the foreign influence campaign"}
         </p>
      </div>

      <div className="max-w-4xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pro-India / Pro-Gov */}
            <button
                onClick={() => onSelect(Stance.PRO_GOVERNMENT)}
                className={`
                  group relative overflow-hidden rounded-2xl shadow-lg border-2 border-transparent p-8
                  transition-all duration-300 hover:-translate-y-2 bg-white
                  flex flex-col items-center text-center gap-4
                  hover:border-india-saffron/50
                `}
            >
                <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="w-20 h-20 rounded-full bg-orange-100 text-india-saffron flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                    {isDomestic ? <Megaphone size={40} /> : <Globe2 size={40} />}
                </div>

                <div className="relative z-10">
                    <h3 className="font-bold text-xl text-gray-900">
                        {isDomestic ? "Pro-Government" : "Pro-India Influence"}
                    </h3>
                    <p className="text-sm font-bold text-india-saffron uppercase tracking-wider mb-3">
                        {isDomestic ? "Support Establishment" : "Foreign Ally / Lobbying"}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        {isDomestic 
                            ? "Create narratives that praise the current administration, support nationalist sentiments, and highlight military/development achievements."
                            : "Simulate a foreign influence campaign (e.g., from Russia, Israel, or Diaspora) designed to boost India's global image and defend its policies."
                        }
                    </p>
                </div>
            </button>

            {/* Anti-India / Anti-Gov */}
            <button
                onClick={() => onSelect(Stance.ANTI_GOVERNMENT)}
                className={`
                  group relative overflow-hidden rounded-2xl shadow-lg border-2 border-transparent p-8
                  transition-all duration-300 hover:-translate-y-2 bg-white
                  flex flex-col items-center text-center gap-4
                  hover:border-red-500/50
                `}
            >
                <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                    {isDomestic ? <AlertOctagon size={40} /> : <ShieldAlert size={40} />}
                </div>

                <div className="relative z-10">
                    <h3 className="font-bold text-xl text-gray-900">
                        {isDomestic ? "Anti-Government" : "Anti-India Disinformation"}
                    </h3>
                    <p className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">
                        {isDomestic ? "Critical / Dissent" : "Hostile State Actor"}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        {isDomestic
                            ? "Create narratives that criticize the establishment, highlight policy failures, allege authoritarianism, and question decisions."
                            : "Simulate a hostile Information Warfare campaign (e.g., ISI, MSS) aimed at destabilizing India, exploiting fault lines, and damaging its reputation."
                        }
                    </p>
                </div>
            </button>
         </div>
      </div>
    </div>
  );
};
