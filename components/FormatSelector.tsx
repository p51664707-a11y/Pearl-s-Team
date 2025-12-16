
import React from 'react';
import { ContentFormat } from '../types';
import { FileText, Image } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface FormatSelectorProps {
  onSelect: (format: ContentFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ onSelect }) => {
  const formats = [
    { 
      id: ContentFormat.TEXT, 
      icon: FileText, 
      color: 'bg-blue-50 text-blue-600', 
      label: 'Text / News', 
      desc: 'Standard articles, posts, or messages.' 
    },
    { 
      id: ContentFormat.MEME, 
      icon: Image, 
      color: 'bg-purple-50 text-purple-600', 
      label: 'Meme / Satire', 
      desc: 'Viral images with humorous or sarcastic text overlays.' 
    }
  ];

  return (
    <div className="animate-fade-in pb-8">
      <div className="text-center mb-10">
         <span className="text-india-blue font-bold text-sm tracking-widest uppercase">Phase 4</span>
         <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Select Content Format</h2>
         <p className="text-gray-500 mt-1">Choose the medium of misinformation</p>
      </div>

      <div className="max-w-4xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formats.map((f) => (
              <Tooltip key={f.id} content={`Generate ${f.label} content for analysis.`} className="h-full">
                  <button
                    onClick={() => onSelect(f.id)}
                    className={`
                      w-full h-full group relative overflow-hidden rounded-2xl shadow-sm border border-gray-200 p-8
                      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white
                      flex flex-col items-center text-center gap-4 hover:border-india-blue/30
                    `}
                  >
                    {/* Background Hover Effect */}
                    <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className={`
                      w-20 h-20 rounded-full shadow-sm flex items-center justify-center shrink-0
                      ${f.color} transition-transform group-hover:scale-110 z-10
                    `}>
                      <f.icon className="w-10 h-10" />
                    </div>
                    
                    <div className="z-10">
                        <h3 className="font-bold text-xl text-gray-800 leading-tight group-hover:text-india-blue transition-colors">
                          {f.label}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">{f.desc}</p>
                    </div>
                  </button>
              </Tooltip>
            ))}
         </div>
      </div>
    </div>
  );
};
