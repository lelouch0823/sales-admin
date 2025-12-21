import React, { useState } from 'react';
import { Search, Filter, CheckSquare, Square, UserCheck } from 'lucide-react';
import { useApp } from '../lib/context';
import { useToast } from '../lib/toast';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Customer } from '../types';
import { CustomerDetailPanel } from '../components/crm/CustomerDetailPanel';
import { BatchAssignModal } from '../components/crm/BatchAssignModal';
import { useTranslation } from 'react-i18next';

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
  const [tab, setTab] = useState<'MY' | 'POOL' | 'SHARED' | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Detail Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const filteredCustomers = customers.filter(c => {
    // Role Filter: Store Manager/Staff should only see their tenant's customers in ALL/POOL
    if (currentUser.role === 'STORE_MANAGER' || currentUser.role === 'STORE_STAFF') {
      if (currentUser.tenantId && c.tenantId !== currentUser.tenantId) return false;
    }

    // 1. Tab Filter
    let matchesTab = false;
    if (tab === 'ALL') matchesTab = true;
    if (tab === 'POOL') matchesTab = c.ownerUserId === null;
    if (tab === 'MY') matchesTab = c.ownerUserId === currentUser.id;
    if (tab === 'SHARED') matchesTab = c.sharedWith.some(s => s.userId === currentUser.id);

    // 2. Search Filter
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);

    return matchesTab && matchesSearch;
  });

  const canShare =
    selectedCustomer &&
    (selectedCustomer.ownerUserId === currentUser.id ||
      currentUser.role === 'SUPER_ADMIN' ||
      selectedCustomer.sharedWith.some(s => s.userId === currentUser.id && s.role === 'MANAGER'));

  const canEdit = canShare;

  // Batch Actions
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
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex p-1 bg-gray-100 rounded-lg">
          {['ALL', 'MY', 'POOL', 'SHARED'].map(t => (
            <button
              key={t}
              onClick={() => {
                setTab(t as 'MY' | 'POOL' | 'SHARED' | 'ALL');
                setSelectedIds(new Set());
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                tab === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {getTabLabel(t)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder={t('crm.search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-brand transition-colors"
            />
          </div>
          <button className="p-2 border border-gray-200 bg-white rounded-lg text-gray-500 hover:bg-gray-50">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Batch Action Bar - Uses Primary for strong visual hierarchy */}
      {selectedIds.size > 0 && (
        <div className="bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <div className="text-sm font-medium pl-2">
            {selectedIds.size} {t('common.selected')}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-gray-400 hover:text-white text-sm"
            >
              {t('common.cancel')}
            </button>
            {tab === 'POOL' && (
              <button
                onClick={handleBatchClaim}
                className="bg-white text-primary px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-100"
              >
                {t('crm.batch.claim')}
              </button>
            )}
            {/* Admin/Manager Batch Assign */}
            {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'STORE_MANAGER') && (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="flex items-center gap-1 bg-brand text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-brand-hover"
              >
                <UserCheck size={16} /> {t('crm.batch.assign')}
              </button>
            )}
          </div>
        </div>
      )}

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
                <th className="py-4 px-6">{t('crm.table.last_interaction')}</th>
                <th className="py-4 px-6 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map(customer => (
                <tr
                  key={customer.id}
                  className={`group hover:bg-gray-50/40 cursor-pointer ${selectedIds.has(customer.id) ? 'bg-brand-light/30' : ''}`}
                  onClick={() => {
                    setSelectedCustomer(customer);
                  }}
                >
                  <td className="py-4 px-6" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleSelection(customer.id)}
                      className={`text-gray-400 hover:text-gray-600 ${selectedIds.has(customer.id) ? 'text-brand' : ''}`}
                    >
                      {selectedIds.has(customer.id) ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-primary">{customer.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{customer.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-1 flex-wrap">
                      {customer.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {!customer.ownerUserId ? (
                      <Badge variant="neutral">{t('crm.badges.pool')}</Badge>
                    ) : customer.ownerUserId === currentUser.id ? (
                      <Badge variant="success">{t('crm.badges.mine')}</Badge>
                    ) : (
                      <Badge variant="warning">{t('crm.badges.shared')}</Badge>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{customer.lastInteraction}</td>
                  <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {/* Claim Action */}
                      {!customer.ownerUserId && (
                        <button
                          onClick={() => {
                            claimCustomer(customer.id, currentUser.id);
                            toast.success(t('alerts.crm.claim_success'));
                          }}
                          className="text-xs bg-brand text-white px-3 py-1.5 rounded hover:bg-brand-hover transition-colors font-medium shadow-sm"
                        >
                          {t('crm.actions.claim')}
                        </button>
                      )}

                      {/* Release Action */}
                      {customer.ownerUserId === currentUser.id && (
                        <button
                          onClick={() => releaseCustomer(customer.id)}
                          className="text-xs text-danger-text hover:bg-danger-light px-3 py-1.5 rounded border border-transparent hover:border-danger-border transition-colors"
                        >
                          {t('crm.actions.return_pool')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
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

      <BatchAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        count={selectedIds.size}
        users={users}
        onAssign={handleBatchAssign}
      />

      <CustomerDetailPanel
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        canEdit={!!canEdit}
        canShare={!!canShare}
        users={users}
        onUpdate={updateCustomer}
        onAddShared={addSharedMember}
        onRemoveShared={removeSharedMember}
      />
    </div>
  );
};
