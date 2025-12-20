import React from 'react';
import { Recommendation } from '../types';
import { Product, StockStatus } from '../../../types';
import { Modal } from '../../../components/common/Modal';
import { useTranslation } from 'react-i18next';

interface RecsProductPickerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentRecs: Recommendation[];
  mode: 'GLOBAL' | 'STORE';
  selectedTenantId: string;
  getStock: (productId: string, tenantId: string) => StockStatus;
  onAdd: (product: Product) => void;
}

export const RecsProductPicker: React.FC<RecsProductPickerProps> = ({
  isOpen, onClose, products, currentRecs, mode, selectedTenantId, getStock, onAdd
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('recs.picker.title')} className="max-w-lg">
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
           {products.map(p => {
             const isAdded = currentRecs.some(r => r.productId === p.id);
             const stock = mode === 'STORE' ? getStock(p.id, selectedTenantId) : null;
             const isOffShelf = p.globalStatus === 'OFF_SHELF';
             const isUnavailable = stock === 'UNAVAILABLE';
             
             return (
               <div key={p.id} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${isOffShelf ? 'bg-gray-50 border-gray-100 opacity-70' : 'border-gray-200 hover:bg-gray-50'}`}>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded shrink-0">
                         <img src={p.imageUrl} className="w-full h-full object-cover rounded"/>
                    </div>
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        {p.name}
                        {isOffShelf && <span className="text-[10px] bg-gray-200 text-gray-600 px-1 rounded">{t('consts.status.OFF_SHELF')}</span>}
                        {isUnavailable && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">{t('consts.stock.UNAVAILABLE')}</span>}
                      </div>
                      <div className="text-xs text-gray-500">{p.brand}</div>
                    </div>
                 </div>
                 <button 
                   disabled={isAdded || isOffShelf || isUnavailable}
                   onClick={() => onAdd(p)}
                   className={`text-xs px-3 py-1.5 rounded font-medium ${isAdded || isOffShelf || isUnavailable ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white'}`}
                 >
                   {isAdded ? t('recs.picker.added') : t('recs.picker.add')}
                 </button>
               </div>
             )
           })}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">{t('common.cancel')}</button>
        </div>
    </Modal>
  );
};
