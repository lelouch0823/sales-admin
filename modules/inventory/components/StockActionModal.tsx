import React, { useState, useEffect } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import { Warehouse } from '../types';
import { Modal } from '../../../components/common/Modal';
import { useTranslation } from 'react-i18next';

interface StockActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'RECEIVE' | 'ISSUE' | 'TRANSFER' | 'RESERVE';
  sku: string;
  warehouses: Warehouse[];
  getStock: (sku: string, whId: string) => any;
  onConfirm: (data: { quantity: number; from: string; to: string; reason: string }) => void;
  preSelectedWhId?: string;
}

export const StockActionModal: React.FC<StockActionModalProps> = ({ isOpen, onClose, type, sku, warehouses, getStock, onConfirm, preSelectedWhId }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ quantity: 1, from: '', to: '', reason: '' });

  useEffect(() => {
    if (isOpen) {
        setForm({ quantity: 1, from: preSelectedWhId || '', to: '', reason: '' });
    }
  }, [isOpen, preSelectedWhId]);

  const handleSubmit = () => {
    onConfirm(form);
  };

  const getTitle = () => {
      switch(type) {
          case 'RECEIVE': return t('inventory.modal.title_receive');
          case 'ISSUE': return t('inventory.modal.title_issue');
          case 'TRANSFER': return t('inventory.modal.title_transfer');
          case 'RESERVE': return t('inventory.modal.title_reserve');
          default: return '';
      }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} className="max-w-sm">
        <div className="text-sm text-gray-500 mb-4 font-mono bg-gray-50 p-2 rounded">SKU: {sku}</div>

        <div className="space-y-3">
            {/* For RESERVE or ISSUE or TRANSFER, we need a source warehouse */}
            {(type === 'TRANSFER' || type === 'ISSUE' || type === 'RESERVE') && (
                <div>
                    <label className="block text-xs font-bold mb-1">{t('inventory.modal.from_wh')}</label>
                    <select 
                    className="w-full border p-2 rounded text-sm" 
                    value={form.from} 
                    onChange={e => setForm({...form, from: e.target.value})}
                    disabled={!!preSelectedWhId} 
                    >
                        <option value="">Select...</option>
                        {warehouses.map(w => {
                            const stock = getStock(sku, w.id);
                            return (
                                <option key={w.id} value={w.id}>
                                    {w.name} ({t('inventory.table.available')}: {stock.onHand - stock.reserved})
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}

            {(type === 'TRANSFER' || type === 'RECEIVE') && (
                <div>
                    <label className="block text-xs font-bold mb-1">{type === 'TRANSFER' ? t('inventory.modal.to_wh') : t('inventory.modal.target_wh')}</label>
                    <select className="w-full border p-2 rounded text-sm" value={form.to} onChange={e => setForm({...form, to: e.target.value})}>
                        <option value="">Select...</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>
            )}

            <div>
                <label className="block text-xs font-bold mb-1">{t('inventory.modal.qty')}</label>
                <input type="number" min="1" className="w-full border p-2 rounded text-sm" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} />
            </div>
        </div>
        
        {type === 'ISSUE' && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded flex items-start gap-2">
                <AlertCircle size={16} />
                <div>{t('inventory.modal.issue_warn')}</div>
            </div>
        )}

        {type === 'RESERVE' && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded flex items-start gap-2">
                <Lock size={16} />
                <div>{t('inventory.modal.reserve_warn')}</div>
            </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">{t('common.cancel')}</button>
            <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg">{t('common.confirm')}</button>
        </div>
    </Modal>
  );
};