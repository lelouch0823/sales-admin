import React from 'react';
import { Modal } from '../common/Modal';
import { useTranslation } from 'react-i18next';

interface InventorySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  lowStockThreshold: number;
  setLowStockThreshold: (val: number) => void;
}

export const InventorySettings: React.FC<InventorySettingsProps> = ({ isOpen, onClose, lowStockThreshold, setLowStockThreshold }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('inventory.settings.title')} className="max-w-sm">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('inventory.settings.low_stock_label')}</label>
                <input 
                type="number" 
                min="0"
                className="w-full border border-gray-300 rounded p-2"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">{t('inventory.settings.low_stock_desc')}</p>
            </div>
        </div>
        <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg">{t('common.done')}</button>
        </div>
    </Modal>
  );
};