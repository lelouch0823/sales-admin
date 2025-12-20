import React from 'react';
import { Product } from '../../types';
import { Toggle } from '../../../../components/Toggle';
import { useTranslation } from 'react-i18next';

interface PriceTabProps {
  form: Partial<Product>;
  onChange: (updates: Partial<Product>) => void;
}

export const PriceTab: React.FC<PriceTabProps> = ({ form, onChange }) => {
  const { t } = useTranslation();

  return (
      <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.retail_price')}</label>
                  <input 
                    type="number" 
                    className="w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none" 
                    value={form.price} 
                    onChange={e => onChange({ price: parseFloat(e.target.value) })} 
                    placeholder={t('pim.editor.price_placeholder')}
                  />
              </div>
          </div>
          <div className="border-t pt-4">
              <h4 className="text-sm font-bold mb-3">{t('pim.editor.sales_rules')}</h4>
              <div className="space-y-3">
                  <div className="flex items-center justify-between">
                      <span className="text-sm">{t('pim.editor.allow_backorder')}</span>
                      <Toggle enabled={!!form.allowBackorder} onToggle={() => onChange({ allowBackorder: !form.allowBackorder })} />
                  </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm">{t('pim.editor.allow_transfer')}</span>
                      <Toggle enabled={!!form.allowTransfer} onToggle={() => onChange({ allowTransfer: !form.allowTransfer })} />
                  </div>
              </div>
          </div>
      </div>
  );
};