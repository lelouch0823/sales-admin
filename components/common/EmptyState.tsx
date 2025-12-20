import React from 'react';
import { FolderOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  onAction,
  actionLabel
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <FolderOpen size={32} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title || t('common.empty_title')}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description || t('common.empty_desc')}</p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};