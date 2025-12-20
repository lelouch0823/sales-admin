import React from 'react';
import { Modal } from '../common/Modal';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '../ui';

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
        <Input
          label={t('inventory.settings.low_stock_label')}
          type="number"
          min={0}
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(Number(e.target.value))}
          helperText={t('inventory.settings.low_stock_desc')}
        />
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={onClose}>{t('common.done')}</Button>
      </div>
    </Modal>
  );
};