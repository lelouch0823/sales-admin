import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-surface rounded-xl border border-gray-200/60 shadow-[0px_2px_4px_rgba(0,0,0,0.02),0px_8px_16px_rgba(0,0,0,0.02)] overflow-hidden ${className}`}>
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; description?: React.ReactNode; actions?: React.ReactNode }> = ({ title, description, actions }) => (
  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
    <div>
      <h2 className="text-lg font-bold text-primary">{title}</h2>
      {description && <div className="text-sm text-gray-500 mt-1.5">{description}</div>}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);