import React, { useState } from 'react';
import { Search, Filter, CheckSquare, Square, UserCheck } from 'lucide-react';
import { useApp } from '../../lib/context';
import { useToast } from '../../lib/toast';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Customer } from './types';
import { CustomerDetailPanel } from './components/CustomerDetailPanel';
import { CustomerRow } from './components/CustomerRow';
import { BatchAssignModal } from './components/BatchAssignModal';
import { useTranslation } from 'react-i18next';
import { AnimatedBox } from '../../components/motion';
import { Tooltip, TooltipProvider } from '../../components/primitives';
import { Button, Input } from '../../components/ui';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

/**
 * 客户管理视图 (CustomersView)
 *
 * 使用封装:
 * - AnimatedBox: 列表和批量操作栏动画
 * - Tooltip: 操作按钮提示
 * - dateUtils: 日期比较逻辑
 */
export const CustomersView: React.FC = () => {
  const {
    customers,
    currentUser,
    users,
    claimCustomer,
    releaseCustomer,
    addSharedMember,
    removeSharedMember,
    updateCustomer,
  } = useApp();
  const { t } = useTranslation();
  const toast = useToast();

  // Tab 状态: MY(我的), POOL(公海), SHARED(协作), ALL(全部)
  const [tab, setTab] = useState<'MY' | 'POOL' | 'SHARED' | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  // 多选状态集合
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 详情/模态框状态
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // --- 列表过滤逻辑 ---
  const filteredCustomers = customers.filter(c => {
    // 1. 角色级数据隔离 (Role Filter)
    if (currentUser.role === 'STORE_MANAGER' || currentUser.role === 'STORE_STAFF') {
      if (currentUser.tenantId && c.tenantId !== currentUser.tenantId) return false;
    }

    // 2. Tab 维度过滤
    let matchesTab = false;
    if (tab === 'ALL') matchesTab = true;
    if (tab === 'POOL') matchesTab = c.ownerUserId === null; // 无 owner 即为公海
    if (tab === 'MY') matchesTab = c.ownerUserId === currentUser.id;
    if (tab === 'SHARED') matchesTab = c.sharedWith.some(s => s.userId === currentUser.id);

    // 3. 搜索关键词过滤
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);

    return matchesTab && matchesSearch;
  });

  // 权限检查
  const canShare =
    selectedCustomer &&
    (selectedCustomer.ownerUserId === currentUser.id ||
      currentUser.role === 'SUPER_ADMIN' ||
      selectedCustomer.sharedWith.some(s => s.userId === currentUser.id && s.role === 'MANAGER'));

  const canEdit = canShare;

  // --- 批量操作逻辑 ---
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredCustomers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCustomers.map(c => c.id)));
    }
  };

  const handleBatchClaim = () => {
    selectedIds.forEach(id => claimCustomer(id, currentUser.id));
    toast.success(t('alerts.crm.claim_success'));
    setSelectedIds(new Set());
  };

  const handleBatchAssign = (userId: string) => {
    selectedIds.forEach(id => claimCustomer(id, userId));
    toast.success(t('alerts.crm.assign_success'));
    setSelectedIds(new Set());
    setIsAssignModalOpen(false);
  };

  const getTabLabel = (key: string) => {
    switch (key) {
      case 'ALL':
        return t('crm.tabs.all');
      case 'MY':
        return t('crm.tabs.my');
      case 'POOL':
        return t('crm.tabs.pool');
      case 'SHARED':
        return t('crm.tabs.shared');
      default:
        return key;
    }
  };

  return (
    <TooltipProvider>
      <ErrorBoundary>
        <div className="space-y-6">
          {/* 顶部过滤器和搜索栏 */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Tab 切换器 */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              {['ALL', 'MY', 'POOL', 'SHARED'].map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t as 'MY' | 'POOL' | 'SHARED' | 'ALL');
                    setSelectedIds(new Set());
                  }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    tab === t
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {getTabLabel(t)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400 z-10" />
                <Input
                  placeholder={t('crm.search_placeholder')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                  fullWidth
                />
              </div>
              <Tooltip content={t('common.filters')}>
                <Button variant="secondary" className="p-2 h-auto">
                  <Filter size={18} />
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* 批量操作栏 */}
          {selectedIds.size > 0 && (
            <AnimatedBox
              animation="fadeInUp"
              className="bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-between shadow-lg"
            >
              <div className="text-sm font-medium pl-2">
                {selectedIds.size} {t('common.selected')}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-gray-200 hover:text-white hover:bg-white/10"
                >
                  {t('common.cancel')}
                </Button>
                {tab === 'POOL' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleBatchClaim}
                    className="font-bold text-primary"
                  >
                    {t('crm.batch.claim')}
                  </Button>
                )}
                {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'STORE_MANAGER') && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="bg-brand hover:bg-brand-hover text-white border-none"
                  >
                    <UserCheck size={16} className="mr-1" /> {t('crm.batch.assign')}
                  </Button>
                )}
              </div>
            </AnimatedBox>
          )}

          <AnimatedBox animation="fadeInUp">
            <Card noPadding>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-4 px-6 w-12">
                        <button onClick={toggleAll} className="text-gray-400 hover:text-gray-600">
                          {selectedIds.size > 0 && selectedIds.size === filteredCustomers.length ? (
                            <CheckSquare size={16} />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </th>
                      <th className="py-4 px-6">{t('crm.table.name_phone')}</th>
                      <th className="py-4 px-6">{t('crm.table.tags')}</th>
                      <th className="py-4 px-6">{t('crm.table.status')}</th>
                      <th className="py-4 px-6">{t('crm.table.next_followup')}</th>
                      <th className="py-4 px-6 text-right">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map(customer => (
                      <CustomerRow
                        key={customer.id}
                        customer={customer}
                        currentUser={currentUser}
                        isSelected={selectedIds.has(customer.id)}
                        onToggleSelection={toggleSelection}
                        onSelectCustomer={setSelectedCustomer}
                        onClaim={claimCustomer}
                        onRelease={releaseCustomer}
                      />
                    ))}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={6}>
                          <EmptyState
                            onAction={() => setSearch('')}
                            actionLabel={t('common.clear_filters')}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </AnimatedBox>

          <BatchAssignModal
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            count={selectedIds.size}
            users={users}
            onAssign={handleBatchAssign}
          />

          <CustomerDetailPanel
            customer={selectedCustomer}
            currentUser={currentUser}
            onClose={() => setSelectedCustomer(null)}
            canEdit={!!canEdit}
            canShare={!!canShare}
            users={users}
            onUpdate={updateCustomer}
            onAddShared={addSharedMember}
            onRemoveShared={removeSharedMember}
          />
        </div>
      </ErrorBoundary>
    </TooltipProvider>
  );
};
