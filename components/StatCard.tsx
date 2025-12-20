import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GridPattern } from './GridPattern';

interface StatCardProps {
  title: string;
  current: number;
  total?: number;
  unit?: string;
  icon?: LucideIcon;
  variant: 'gradient' | 'grid';
  totalLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, current, total, unit, icon: Icon, variant, totalLabel = 'total' }) => {
  return (
    <div className="relative h-32 rounded-xl border border-gray-200/60 bg-white p-6 overflow-hidden flex flex-col justify-between shadow-[0px_2px_4px_rgba(0,0,0,0.02),0px_10px_20px_rgba(0,0,0,0.02)] hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05),0px_15px_30px_rgba(0,0,0,0.03)] transition-shadow duration-300">
      {variant === 'grid' && <GridPattern />}
      
      {variant === 'gradient' && (
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 bg-gradient-to-br from-pink-300 via-red-300 to-purple-300 rounded-full blur-3xl opacity-40 pointer-events-none" />
      )}

      <div className="flex justify-between items-start relative z-10">
        <h3 className="font-semibold text-gray-700 text-sm tracking-wide">{title}</h3>
        {Icon && <Icon size={18} className="text-gray-400" />}
      </div>

      <div className="relative z-10">
        <div className="flex items-baseline gap-1.5">
          {unit && <span className="text-xl font-bold text-gray-500 mr-1">{unit}</span>}
          <span className="text-2xl font-bold text-gray-900">{current.toLocaleString()}</span>
          {(total !== undefined && total > 0) && <span className="text-sm font-medium text-gray-400">/ {total.toLocaleString()}</span>}
        </div>
        {(total !== undefined && total > 0) && <p className="text-xs text-gray-400 mt-1 font-medium">{totalLabel}</p>}
      </div>
    </div>
  );
};