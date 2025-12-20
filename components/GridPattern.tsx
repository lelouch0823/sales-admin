import React from 'react';

export const GridPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      <svg
        className="absolute w-full h-full stroke-gray-200/[0.6]"
        fill="none"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="grid-pattern"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path d="M24 0V24H0" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
};