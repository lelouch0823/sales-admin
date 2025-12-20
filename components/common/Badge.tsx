import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    // Using semantic colors defined in index.html
    default: 'bg-brand-light text-brand hover:bg-brand-light/80 border-blue-200', 
    success: 'bg-success-light text-success-text border-success-border',
    warning: 'bg-warning-light text-warning-text border-warning-border',
    danger:  'bg-danger-light text-danger-text border-danger-border',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};