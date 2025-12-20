import React from 'react';
import { InventoryMovement } from '../../types';
import { Drawer } from '../common/Drawer';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LedgerModalProps {
    sku: string | null;
    onClose: () => void;
    movements: InventoryMovement[];
    getWarehouseName: (id: string) => string;
    getUserName: (id: string) => string;
}

export const LedgerModal: React.FC<LedgerModalProps> = ({ sku, onClose, movements, getWarehouseName, getUserName }) => {
    const { t } = useTranslation();

    if (!sku) return null;

    const skuMovements = movements.filter(m => m.sku === sku);

    return (
        <Drawer isOpen={!!sku} onClose={onClose} className="max-w-lg">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                    <h3 className="font-bold text-lg">{t('inventory.ledger_modal.title')}</h3>
                    <p className="text-muted text-sm font-mono">{sku}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-900 rounded-full p-2 hover:bg-gray-50"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 relative">
                <div className="absolute left-9 top-8 bottom-8 w-0.5 bg-gray-100"></div>
                {skuMovements.length === 0 && (
                    <p className="text-center text-muted py-10">{t('inventory.ledger_modal.no_movements')}</p>
                )}
                {skuMovements.map(move => (
                    <div key={move.id} className="relative pl-8">
                        <div className={`absolute left-[0.2rem] top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ring-gray-200 ${move.type === 'RECEIVE' ? 'bg-success' :
                                move.type === 'ISSUE' ? 'bg-danger' : 'bg-info'
                            }`}></div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                            <div className="flex justify-between items-start">
                                <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${move.type === 'RECEIVE' ? 'bg-success-light text-success' :
                                        move.type === 'ISSUE' ? 'bg-danger-light text-danger' : 'bg-info-light text-info'
                                    }`}>{t(`consts.action.${move.type}`)}</span>
                                <span className="text-xs text-muted">{move.timestamp}</span>
                            </div>
                            <div className="mt-2 font-medium">
                                {move.type === 'RECEIVE' ? '+' : '-'}{move.quantity} {t('inventory.ledger_modal.units')}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                                {t('inventory.ledger_modal.wh')} {getWarehouseName(move.warehouseId)}
                            </div>
                            <div className="mt-1 text-xs text-muted">
                                {t('inventory.ledger_modal.by')} {getUserName(move.operatorId)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Drawer>
    );
};