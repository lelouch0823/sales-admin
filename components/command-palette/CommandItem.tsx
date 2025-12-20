import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SearchResult } from './types';

interface CommandItemProps {
  item: SearchResult;
  isActive: boolean;
  query: string;
  onSelect: () => void;
  onMouseEnter: () => void;
  index: number; // passed for data-index identification
}

export const CommandItem: React.FC<CommandItemProps> = ({ 
  item, 
  isActive, 
  query, 
  onSelect, 
  onMouseEnter,
  index 
}) => {
  // Helper to highlight matching text
  const renderHighlightedText = (text: string, match: string) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === match.toLowerCase() ? (
        <span key={i} className="text-brand font-bold underline decoration-brand/30 underline-offset-2">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div 
      data-index={index}
      className={`
        group flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-150 ease-out
        ${isActive 
          ? 'bg-gray-100 border-l-4 border-brand pl-3 shadow-sm scale-[1.01]' 
          : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
        }
      `}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
    >
      {/* Icon Container */}
      <div className={`
        w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors
        ${isActive ? 'bg-white text-brand shadow-sm' : 'bg-gray-100 text-gray-500'}
      `}>
        <item.icon size={18} />
      </div>
      
      {/* Text Info */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
          {renderHighlightedText(item.label, query)}
        </div>
        {item.sub && (
          <div className="text-xs text-gray-400 truncate mt-0.5 font-mono">
            {renderHighlightedText(item.sub, query)}
          </div>
        )}
      </div>

      {/* Action Icon / Shortcut hint */}
      {isActive && (
        <div className="flex items-center gap-2 animate-in slide-in-from-left-2 fade-in duration-200">
           <span className="text-[10px] text-gray-400 font-medium hidden sm:inline-block">Jump to</span>
           <ArrowRight size={16} className="text-brand" />
        </div>
      )}
    </div>
  );
};