
import React from 'react';

interface AshokaChakraProps {
  className?: string;
  size?: number;
}

export const AshokaChakra: React.FC<AshokaChakraProps> = ({ className = '', size = 24 }) => {
  // 24 Spokes (360 / 24 = 15 degrees each)
  const spokes = Array.from({ length: 24 }).map((_, i) => (
    <line
      key={`spoke-${i}`}
      x1="12"
      y1="12"
      x2="12"
      y2="3.5"
      transform={`rotate(${i * 15} 12 12)`}
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
    />
  ));

  // 24 semi-circle lobes on the rim
  const lobes = Array.from({ length: 24 }).map((_, i) => (
    <circle
      key={`lobe-${i}`}
      cx="12"
      cy="2.5"
      r="0.5"
      transform={`rotate(${i * 15 + 7.5} 12 12)`}
      fill="currentColor"
    />
  ));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`text-india-blue ${className}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Outer Rim */}
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Inner Hub */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      
      {/* Spokes */}
      <g>{spokes}</g>
      
      {/* Rim Details */}
      <g>{lobes}</g>
    </svg>
  );
};
