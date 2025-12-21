import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WarehouseTree } from './components/WarehouseTree';
import { TransferOrderList } from './components/TransferOrderList';
import { Warehouse, TransferOrder } from './types';
import { AnimatedBox } from '../../components/motion';
import { toast } from 'react-hot-toast'; // or use lib/toast

export function WarehouseView() {
  const { t } = useTranslation();
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | undefined>(undefined);

  const handleCreateTransfer = () => {
    toast.success(t('warehouse.create_transfer_mock'));
    // Open modal implementation would go here
  };

  const handleViewTransfer = (_order: TransferOrder) => {
    // Detail view navigation would go here
  };

  return (
    <AnimatedBox className="h-full flex flex-col bg-gray-50">
      {/* Header is handled by MainLayout generally, but we can add specific toolbar info here if needed */}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Hierarchy Tree */}
        <WarehouseTree selectedId={selectedWarehouse?.id} onSelect={setSelectedWarehouse} />

        {/* Right Panel: Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedWarehouse ? (
            <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedWarehouse.name}</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                    {selectedWarehouse.type}
                  </span>
                  {selectedWarehouse.code && <span>#{selectedWarehouse.code}</span>}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white border-b border-gray-100 shadow-sm">
              <h1 className="text-xl font-bold text-gray-900">{t('warehouse.all_warehouses')}</h1>
              <p className="text-sm text-gray-500">{t('warehouse.select_prompt')}</p>
            </div>
          )}

          <div className="flex-1 overflow-hidden p-6">
            <TransferOrderList
              warehouseId={selectedWarehouse?.id}
              onCreate={handleCreateTransfer}
              onView={handleViewTransfer}
            />
          </div>
        </div>
      </div>
    </AnimatedBox>
  );
}
