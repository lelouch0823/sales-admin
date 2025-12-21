import React, { useEffect } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import { Warehouse, InventoryBalance } from '../types';
import { Modal } from '../../../components/common/Modal';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '../../../components/ui';
import { useZodForm, Controller } from '../../../hooks/useZodForm';
import { stockActionSchema, StockActionFormData } from '../../../lib/schemas';

interface StockActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'RECEIVE' | 'ISSUE' | 'TRANSFER' | 'RESERVE';
  sku: string;
  warehouses: Warehouse[];
  getStock: (sku: string, whId: string) => Pick<InventoryBalance, 'onHand' | 'reserved'>;
  onConfirm: (data: { quantity: number; from: string; to: string; reason: string }) => void;
  preSelectedWhId?: string;
}

export const StockActionModal: React.FC<StockActionModalProps> = ({
  isOpen,
  onClose,
  type,
  sku,
  warehouses,
  getStock,
  onConfirm,
  preSelectedWhId,
}) => {
  const { t } = useTranslation();

  const form = useZodForm<StockActionFormData>({
    schema: stockActionSchema,
    defaultValues: {
      quantity: 1,
      warehouseId: '',
      toWarehouseId: '',
      reason: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        quantity: 1,
        warehouseId: preSelectedWhId || '',
        toWarehouseId: '',
        reason: '',
      });
    }
  }, [isOpen, preSelectedWhId, form]);

  const onSubmit = (data: StockActionFormData) => {
    // Map form data back to the structure expected by performStockAction
    // warehouseId maps to 'from' (or target for RECEIVE)
    // toWarehouseId maps to 'to'

    let from = '';
    let to = '';

    if (type === 'RECEIVE') {
      to = data.warehouseId;
    } else if (type === 'TRANSFER') {
      from = data.warehouseId;
      to = data.toWarehouseId || '';
    } else {
      from = data.warehouseId;
    }

    onConfirm({
      quantity: data.quantity,
      from,
      to,
      reason: data.reason || '',
    });
  };

  const getTitle = () => {
    switch (type) {
      case 'RECEIVE':
        return t('inventory.modal.title_receive');
      case 'ISSUE':
        return t('inventory.modal.title_issue');
      case 'TRANSFER':
        return t('inventory.modal.title_transfer');
      case 'RESERVE':
        return t('inventory.modal.title_reserve');
      default:
        return '';
    }
  };

  const fromOptions = warehouses.map(w => {
    const stock = getStock(sku, w.id);
    return {
      value: w.id,
      label: `${w.name} (${t('inventory.table.available')}: ${stock.onHand - stock.reserved})`,
    };
  });

  const toOptions = warehouses.map(w => ({ value: w.id, label: w.name }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} className="max-w-sm">
      <div className="text-sm text-muted mb-4 font-mono bg-gray-50 p-2 rounded">SKU: {sku}</div>

      {/* @ts-expect-error - Known react-hook-form + zod type compatibility issue */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* For RESERVE or ISSUE or TRANSFER, we need a source warehouse */}
        {(type === 'TRANSFER' || type === 'ISSUE' || type === 'RESERVE') && (
          <Controller
            control={form.control}
            name="warehouseId"
            render={({ field, fieldState }) => (
              <Select
                label={t('inventory.modal.from_wh')}
                placeholder="Select..."
                options={fromOptions}
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                disabled={!!preSelectedWhId}
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        {(type === 'TRANSFER' || type === 'RECEIVE') && (
          <Controller
            control={form.control}
            name={type === 'RECEIVE' ? 'warehouseId' : 'toWarehouseId'} // For RECEIVE, warehouseId is the target
            render={({ field, fieldState }) => (
              <Select
                label={
                  type === 'TRANSFER' ? t('inventory.modal.to_wh') : t('inventory.modal.target_wh')
                }
                placeholder="Select..."
                options={toOptions}
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                error={fieldState.error?.message}
              />
            )}
          />
        )}

        <Input
          label={t('inventory.modal.qty')}
          type="number"
          min={1}
          {...form.register('quantity', { valueAsNumber: true })}
          error={form.formState.errors.quantity?.message}
        />

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
          <Button variant="secondary" onClick={onClose} type="button">
            {t('common.cancel')}
          </Button>
          <Button variant="primary" type="submit">
            {t('common.confirm')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
