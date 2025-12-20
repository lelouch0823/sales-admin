import React, { useState, useEffect } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import { Warehouse } from '../types';
import { Modal } from '../../../components/common/Modal';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '../../../components/ui';

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
        switch (type) {
            case 'RECEIVE': return t('inventory.modal.title_receive');
            case 'ISSUE': return t('inventory.modal.title_issue');
            case 'TRANSFER': return t('inventory.modal.title_transfer');
            case 'RESERVE': return t('inventory.modal.title_reserve');
            default: return '';
        }
    };

    const fromOptions = warehouses.map(w => {
        const stock = getStock(sku, w.id);
        return { value: w.id, label: `${w.name} (${t('inventory.table.available')}: ${stock.onHand - stock.reserved})` };
    });

    const toOptions = warehouses.map(w => ({ value: w.id, label: w.name }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} className="max-w-sm">
            <div className="text-sm text-muted mb-4 font-mono bg-gray-50 p-2 rounded">SKU: {sku}</div>

            <div className="space-y-3">
                {/* For RESERVE or ISSUE or TRANSFER, we need a source warehouse */}
                {(type === 'TRANSFER' || type === 'ISSUE' || type === 'RESERVE') && (
                    <Select
                        label={t('inventory.modal.from_wh')}
                        placeholder="Select..."
                        options={fromOptions}
                        value={form.from}
                        onChange={e => setForm({ ...form, from: e.target.value })}
                        disabled={!!preSelectedWhId}
                    />
                )}

                {(type === 'TRANSFER' || type === 'RECEIVE') && (
                    <Select
                        label={type === 'TRANSFER' ? t('inventory.modal.to_wh') : t('inventory.modal.target_wh')}
                        placeholder="Select..."
                        options={toOptions}
                        value={form.to}
                        onChange={e => setForm({ ...form, to: e.target.value })}
                    />
                )}

                <Input
                    label={t('inventory.modal.qty')}
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                />
            </div>

            {type === 'ISSUE' && (
                <div className="mt-4 p-3 bg-danger-light text-danger text-xs rounded flex items-start gap-2">
                    <AlertCircle size={16} />
                    <div>{t('inventory.modal.issue_warn')}</div>
                </div>
            )}

            {type === 'RESERVE' && (
                <div className="mt-4 p-3 bg-primary-light text-primary text-xs rounded flex items-start gap-2">
                    <Lock size={16} />
                    <div>{t('inventory.modal.reserve_warn')}</div>
                </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
                <Button variant="primary" onClick={handleSubmit}>{t('common.confirm')}</Button>
            </div>
        </Modal>
    );
};