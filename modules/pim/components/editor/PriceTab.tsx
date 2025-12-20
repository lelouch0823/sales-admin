import React from 'react';
import { Toggle } from '../../../../components/Toggle';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from '../../../../hooks/useZodForm';

export const PriceTab: React.FC = () => {
    const { t } = useTranslation();
    const { register, control, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('pim.editor.retail_price')}</label>
                    <input
                        type="number"
                        className={`w-full border p-2 rounded text-sm bg-gray-50 focus:bg-white focus:border-brand transition-colors outline-none ${errors.price ? 'border-red-500' : ''}`}
                        {...register('price', { valueAsNumber: true })}
                        placeholder={t('pim.editor.price_placeholder')}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message as string}</p>}
                </div>
            </div>
            <div className="border-t pt-4">
                <h4 className="text-sm font-bold mb-3">{t('pim.editor.sales_rules')}</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">{t('pim.editor.allow_backorder')}</span>
                        <Controller
                            control={control}
                            name="allowBackorder"
                            render={({ field }) => (
                                <Toggle enabled={!!field.value} onToggle={() => field.onChange(!field.value)} />
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">{t('pim.editor.allow_transfer')}</span>
                        <Controller
                            control={control}
                            name="allowTransfer"
                            render={({ field }) => (
                                <Toggle enabled={!!field.value} onToggle={() => field.onChange(!field.value)} />
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};