import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowRightLeft,
  PackagePlus,
  PackageMinus,
  MapPin,
  History,
  ClipboardList,
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  PackageX,
  Settings,
} from 'lucide-react';
import { useApp } from '../lib/context';
import { useToast } from '../lib/toast';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import { StockActionModal } from '../modules/inventory/components/StockActionModal';
import { LedgerModal } from '../modules/inventory/components/LedgerModal';
import { InventorySettings } from '../modules/inventory/components/InventorySettings';
import { useTranslation } from 'react-i18next';

export const InventoryView: React.FC = () => {
  const {
    products,
    inventory,
    warehouses,
    movements,
    adjustInventory,
    transferInventory,
    currentUser,
    users,
  } = useApp();
  const { t } = useTranslation();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<'OVERVIEW' | 'SKU' | 'WAREHOUSE'>('OVERVIEW');
  const [search, setSearch] = useState('');

  // Settings
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Modals
  const [actionModal, setActionModal] = useState<{
    type: 'RECEIVE' | 'ISSUE' | 'TRANSFER';
    sku?: string;
    whId?: string;
  } | null>(null);
  const [historySku, setHistorySku] = useState<string | null>(null);

  // Filtering
  const filteredProducts = products.filter(
    p =>
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- Statistics Logic ---
  const stats = useMemo(() => {
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalItems = 0;

    products.forEach(p => {
      const pStock = inventory.filter(i => i.sku === p.sku);
      const totalOnHand = pStock.reduce((acc, curr) => acc + curr.onHand, 0);

      totalValue += totalOnHand * p.price;
      if (totalOnHand === 0) outOfStockCount++;
      else if (totalOnHand <= lowStockThreshold) lowStockCount++;
      totalItems += totalOnHand;
    });

    // Today's Movements
    const todayStr = new Date().toLocaleDateString();
    const todayMovements = movements.filter(m => m.timestamp.includes(todayStr)).length;

    return { totalValue, lowStockCount, outOfStockCount, totalItems, todayMovements };
  }, [products, inventory, movements, lowStockThreshold]);

  const getStock = (sku: string, whId: string) => {
    const rec = inventory.find(i => i.sku === sku && i.warehouseId === whId);
    return rec || { onHand: 0, reserved: 0, inTransitIn: 0, inTransitOut: 0 };
  };

  const getTotalStock = (sku: string) => {
    return inventory.filter(i => i.sku === sku).reduce((acc, curr) => acc + curr.onHand, 0);
  };

  const getProductDetails = (sku: string) => products.find(p => p.sku === sku);
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;
  const getWarehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || id;

  const handleActionConfirm = (form: {
    quantity: number;
    from: string;
    to: string;
    reason: string;
  }) => {
    if (!actionModal?.sku) return;
    const qty = form.quantity;
    if (qty <= 0) {
      toast.error(t('alerts.inventory.qty_positive'));
      return;
    }

    if (actionModal.type === 'RECEIVE') {
      if (!form.to) {
        toast.error(t('alerts.inventory.select_wh'));
        return;
      }
      adjustInventory(actionModal.sku, form.to, qty, 'RECEIVE');
      toast.success(t('alerts.inventory.adjust_success'));
    } else if (actionModal.type === 'ISSUE') {
      if (!form.from) {
        toast.error(t('alerts.inventory.select_wh'));
        return;
      }
      const current = getStock(actionModal.sku, form.from);
      if (current.onHand < qty) {
        toast.error(t('alerts.inventory.insufficient_stock'));
        return;
      }
      adjustInventory(actionModal.sku, form.from, qty, 'ISSUE');
      toast.success(t('alerts.inventory.adjust_success'));
    } else {
      if (!form.from || !form.to) {
        toast.error(t('alerts.inventory.select_source_dest'));
        return;
      }
      if (form.from === form.to) {
        toast.error(t('alerts.inventory.same_wh'));
        return;
      }
      const current = getStock(actionModal.sku, form.from);
      if (current.onHand < qty) {
        toast.error(t('alerts.inventory.insufficient_source'));
        return;
      }
      transferInventory(actionModal.sku, form.from, form.to, qty);
      toast.success(t('alerts.inventory.transfer_success'));
    }
    setActionModal(null);
  };

  // --- Views ---

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('inventory.stats.total_value')}
          current={stats.totalValue}
          total={0}
          unit="$"
          variant="gradient"
          icon={TrendingUp}
        />
        <StatCard
          title={t('inventory.stats.low_stock')}
          current={stats.lowStockCount}
          total={products.length}
          variant="grid"
          icon={AlertTriangle}
        />
        <StatCard
          title={t('inventory.stats.out_of_stock')}
          current={stats.outOfStockCount}
          total={products.length}
          variant="grid"
          icon={PackageX}
        />
        <StatCard
          title={t('inventory.stats.movements')}
          current={stats.todayMovements}
          total={movements.length}
          variant="grid"
          icon={History}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary">{t('inventory.recent_movements')}</h3>
            <button
              onClick={() => setViewMode('SKU')}
              className="text-xs text-brand hover:underline"
            >
              {t('common.view_all')}
            </button>
          </div>
          <div className="space-y-4">
            {movements.slice(0, 5).map(m => (
              <div
                key={m.id}
                className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  {/* Semantic colors for movement types */}
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center
                                     ${
                                       m.type === 'RECEIVE'
                                         ? 'bg-success-light text-success'
                                         : m.type === 'ISSUE'
                                           ? 'bg-danger-light text-danger-text'
                                           : 'bg-brand-light text-brand'
                                     }`}
                  >
                    {m.type === 'RECEIVE' ? (
                      <PackagePlus size={16} />
                    ) : m.type === 'ISSUE' ? (
                      <PackageMinus size={16} />
                    ) : (
                      <ArrowRightLeft size={16} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-primary">{m.sku}</div>
                    <div className="text-xs text-gray-400">{getWarehouseName(m.warehouseId)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">
                    {m.type === 'RECEIVE' ? '+' : '-'}
                    {m.quantity}
                  </div>
                  <div className="text-xs text-gray-400">{m.timestamp.split(' ')[0]}</div>
                </div>
              </div>
            ))}
            {movements.length === 0 && <EmptyState description={t('common.no_data')} />}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <AlertTriangle size={16} className="text-warning" />
              {t('inventory.low_stock_alerts')}
            </h3>
            <span className="text-xs text-gray-400">
              {t('inventory.threshold')}: &lt; {lowStockThreshold}
            </span>
          </div>
          <div className="space-y-3">
            {products
              .filter(p => getTotalStock(p.sku) <= lowStockThreshold)
              .slice(0, 5)
              .map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 bg-warning-light/30 rounded border border-warning-light"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl} className="w-8 h-8 rounded object-cover" />
                    <div>
                      <div className="text-sm font-medium text-primary">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-warning-text">
                      {getTotalStock(p.sku)} {t('inventory.left')}
                    </div>
                    <button
                      onClick={() => {
                        setActionModal({ type: 'RECEIVE', sku: p.sku });
                      }}
                      className="text-xs text-brand hover:underline"
                    >
                      {t('inventory.restock')}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderWarehouseView = () => (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in">
      {warehouses.map(wh => {
        // Get all non-zero stock items for this warehouse
        const whItems = inventory.filter(i => i.warehouseId === wh.id && i.onHand > 0);

        return (
          <Card key={wh.id} noPadding className="overflow-hidden">
            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center ${wh.type === 'DC' ? 'bg-purple-100 text-purple-600' : 'bg-brand-light text-brand'}`}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="font-bold text-primary">{wh.name}</div>
                  <div className="text-xs text-gray-500 uppercase font-bold">
                    {t(`consts.warehouse_type.${wh.type}`)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{whItems.length}</div>
                <div className="text-xs text-gray-500">{t('inventory.table.in_stock_skus')}</div>
              </div>
            </div>
            {whItems.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white text-gray-500 border-b text-xs uppercase">
                    <th className="py-2 px-4">{t('inventory.table.sku_prod')}</th>
                    <th className="py-2 px-4 text-right">{t('inventory.table.on_hand')}</th>
                    <th className="py-2 px-4 text-right">{t('inventory.table.reserved')}</th>
                    <th className="py-2 px-4 text-right">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {whItems.map(item => {
                    const prod = getProductDetails(item.sku);
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/40"
                      >
                        <td className="py-2 px-4">
                          <div className="font-medium text-primary">{prod?.name || 'Unknown'}</div>
                          <div className="font-mono text-xs text-gray-500">{item.sku}</div>
                        </td>
                        <td className="py-2 px-4 text-right font-mono font-bold text-primary">
                          {item.onHand}
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-gray-500">
                          {item.reserved}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <button
                            onClick={() => {
                              setActionModal({ type: 'ISSUE', sku: item.sku, whId: wh.id });
                            }}
                            className="text-xs text-danger-text hover:underline"
                          >
                            {t('inventory.actions.adjust')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8">
                <EmptyState description={t('common.no_data')} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('OVERVIEW')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${viewMode === 'OVERVIEW' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
          >
            <LayoutDashboard size={14} /> {t('inventory.tabs.overview')}
          </button>
          <button
            onClick={() => setViewMode('SKU')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'SKU' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
          >
            {t('inventory.tabs.by_sku')}
          </button>
          <button
            onClick={() => setViewMode('WAREHOUSE')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'WAREHOUSE' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
          >
            {t('inventory.tabs.by_warehouse')}
          </button>
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500"
            title={t('inventory.settings.title')}
          >
            <Settings size={18} />
          </button>
          {viewMode === 'SKU' && (
            <div className="relative w-full max-w-xs">
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-brand"
              />
            </div>
          )}
        </div>
      </div>

      {viewMode === 'OVERVIEW' && renderOverview()}
      {viewMode === 'WAREHOUSE' && renderWarehouseView()}

      {viewMode === 'SKU' && (
        <div className="grid gap-6 animate-in fade-in">
          {filteredProducts.map(p => {
            const total = getTotalStock(p.sku);
            return (
              <Card key={p.id} noPadding className="overflow-hidden group">
                <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded border border-gray-200 p-1 relative">
                      <img src={p.imageUrl} className="w-full h-full object-cover rounded" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-primary">{p.name}</div>
                      <div className="font-mono text-xs text-gray-500">{p.sku}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 uppercase font-bold">
                        {t('inventory.table.total_on_hand')}
                      </div>
                      <div
                        className={`text-lg font-bold ${total <= lowStockThreshold ? 'text-warning-text' : 'text-primary'}`}
                      >
                        {total}
                      </div>
                    </div>
                    {currentUser.role !== 'STORE_STAFF' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setHistorySku(p.sku)}
                          className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-600"
                          title={t('inventory.ledger')}
                        >
                          <ClipboardList size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setActionModal({ type: 'RECEIVE', sku: p.sku });
                          }}
                          className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-100 text-success"
                          title={t('inventory.actions.receive')}
                        >
                          <PackagePlus size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setActionModal({ type: 'TRANSFER', sku: p.sku });
                          }}
                          className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-100 text-brand"
                          title={t('inventory.actions.transfer')}
                        >
                          <ArrowRightLeft size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-white text-gray-500 border-b border-gray-100">
                        <th className="py-2 px-4 font-normal">{t('inventory.table.warehouse')}</th>
                        <th className="py-2 px-4 font-normal">{t('inventory.table.on_hand')}</th>
                        <th className="py-2 px-4 font-normal">{t('inventory.table.reserved')}</th>
                        <th className="py-2 px-4 font-normal">{t('inventory.table.available')}</th>
                        <th className="py-2 px-4 font-normal">{t('common.status')}</th>
                        <th className="py-2 px-4 font-normal text-right">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warehouses.map(wh => {
                        const stock = getStock(p.sku, wh.id);
                        const available = Math.max(0, stock.onHand - stock.reserved);

                        // Status Logic
                        let statusKey = 'UNAVAILABLE';
                        let variant: 'success' | 'warning' | 'default' | 'neutral' = 'neutral';

                        if (available > 0) {
                          statusKey = 'IN_STOCK';
                          variant = 'success';
                        } else if (p.allowBackorder) {
                          statusKey = 'BACKORDER';
                          variant = 'warning';
                        } else if (p.allowTransfer) {
                          statusKey = 'TRANSFERABLE';
                          variant = 'default';
                        }

                        return (
                          <tr
                            key={wh.id}
                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                          >
                            <td className="py-3 px-4 flex items-center gap-2 text-primary">
                              <MapPin size={14} className="text-gray-400" />
                              {wh.name}
                              {wh.type === 'DC' && (
                                <span className="text-[10px] bg-gray-200 px-1 rounded text-gray-600">
                                  {t('consts.warehouse_type.DC')}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono">{stock.onHand}</td>
                            <td className="py-3 px-4 font-mono text-gray-400">{stock.reserved}</td>
                            <td className="py-3 px-4 font-mono font-bold">{available}</td>
                            <td className="py-3 px-4">
                              <Badge variant={variant}>{t(`consts.stock.${statusKey}`)}</Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {(stock.onHand > 0 || currentUser.role === 'SUPER_ADMIN') && (
                                <button
                                  onClick={() => {
                                    setActionModal({ type: 'ISSUE', sku: p.sku, whId: wh.id });
                                  }}
                                  className="p-1 text-gray-400 hover:text-danger-text opacity-0 group-hover:opacity-100 transition-opacity"
                                  title={t('inventory.actions.issue')}
                                >
                                  <PackageMinus size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
          {filteredProducts.length === 0 && (
            <EmptyState onAction={() => setSearch('')} actionLabel={t('common.clear_filters')} />
          )}
        </div>
      )}

      {/* Modals */}
      <InventorySettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lowStockThreshold={lowStockThreshold}
        setLowStockThreshold={setLowStockThreshold}
      />

      <StockActionModal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        type={actionModal?.type || 'RECEIVE'}
        sku={actionModal?.sku || ''}
        preSelectedWhId={actionModal?.whId}
        warehouses={warehouses}
        getStock={getStock}
        onConfirm={handleActionConfirm}
      />

      <LedgerModal
        sku={historySku}
        onClose={() => setHistorySku(null)}
        movements={movements}
        getWarehouseName={getWarehouseName}
        getUserName={getUserName}
      />
    </div>
  );
};
