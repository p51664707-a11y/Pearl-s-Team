
import React from 'react';
import { LANGUAGES } from '../types';
import { Languages } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelect: (lang: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelect }) => {
  return (
    <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-4 text-gray-700 font-serif font-bold">
            <div className="p-1.5 bg-india-blue/10 rounded-lg">
                <Languages size={18} className="text-india-blue" />
            </div>
            <h3>Select Target Language</h3>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
            {LANGUAGES.map((lang) => (
                <Tooltip key={lang.name} content={`Simulate content in ${lang.name} (${lang.native})`} position="top">
                    <button
                        onClick={() => onSelect(lang.name)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                            flex items-center gap-2
                            ${selectedLanguage === lang.name 
                                ? 'bg-india-blue text-white border-india-blue shadow-md ring-2 ring-india-blue ring-offset-1' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-india-saffron hover:text-india-saffron hover:bg-orange-50'
                            }
                        `}
                    >
                        {lang.name} 
                        <span className={`text-xs ${selectedLanguage === lang.name ? 'text-blue-200' : 'text-gray-400'}`}>
                            | {lang.native}
                        </span>
                    </button>
                </Tooltip>
            ))}
        </div>
    </div>
  );
};
