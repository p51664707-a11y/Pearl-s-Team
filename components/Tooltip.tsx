
import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative flex flex-col items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-xl w-max max-w-[200px] text-center pointer-events-none animate-fade-in border border-gray-700 whitespace-normal leading-snug
          ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
        `}>
          {content}
          <div className={`
            absolute left-1/2 -translate-x-1/2 border-4 border-transparent
            ${position === 'top' ? 'border-t-gray-900 top-full' : 'border-b-gray-900 bottom-full'}
          `}></div>
        </div>
      )}
    </div>
  );
};
