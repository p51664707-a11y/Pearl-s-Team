
import React from 'react';
import { Target, ChevronRight } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface TopicGridProps {
  topics: string[];
  onSelect: (topic: string) => void;
  selectedTopic: string | null;
}

export const TopicGrid: React.FC<TopicGridProps> = ({ topics, onSelect, selectedTopic }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {topics.map((topic) => (
        <Tooltip key={topic} content={`Generate a simulation about ${topic}.`} className="w-full">
          <button
            onClick={() => onSelect(topic)}
            className={`
              w-full group relative p-5 rounded-xl text-left transition-all duration-300 transform hover:-translate-y-1
              flex items-center justify-between border-l-4
              ${
                selectedTopic === topic
                  ? 'bg-india-blue text-white border-l-india-saffron shadow-xl ring-2 ring-india-blue ring-offset-2'
                  : 'bg-white text-gray-700 border-l-gray-200 hover:border-l-india-saffron shadow-md hover:shadow-lg'
              }
            `}
          >
            <div className="flex items-center gap-3">
               <div className={`
                  p-2 rounded-lg 
                  ${selectedTopic === topic ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-orange-50'}
               `}>
                 <Target size={18} className={selectedTopic === topic ? 'text-white' : 'text-gray-400 group-hover:text-india-saffron'} />
               </div>
               <span className="font-semibold text-sm md:text-base tracking-wide">{topic}</span>
            </div>
            
            <ChevronRight 
              size={16} 
              className={`
                transition-transform duration-300 
                ${selectedTopic === topic ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}
              `} 
            />
          </button>
        </Tooltip>
      ))}
    </div>
  );
};
