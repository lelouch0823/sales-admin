import React, { useState } from 'react';
import { Search, Filter, CheckSquare, Square, UserCheck, Calendar } from 'lucide-react';
import { useApp } from '../../lib/context';
import { useToast } from '../../lib/toast';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Customer } from './types';
import { CustomerDetailPanel } from './components/CustomerDetailPanel';
import { BatchAssignModal } from './components/BatchAssignModal';
import { useTranslation } from 'react-i18next';

/**
 * 客户管理视图 (CustomersView)
 * 职责:
 * 1. 展示客户列表，支持多种维度过滤 (我的/公海/共享)
 * 2. 处理客户的领取(Claim)与退回公海(Release)
 * 3. 批量操作 (批量领取/批量分配)
 * 4. 唤起详情抽屉进行编辑和跟进记录
 */
export const CustomersView: React.FC = () => {
  const { customers, currentUser, users, claimCustomer, releaseCustomer, addSharedMember, removeSharedMember, updateCustomer } = useApp();
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
    // 门店店长/员工只能看到本租户(Tenant)的数据
    if (currentUser.role === 'STORE_MANAGER' || currentUser.role === 'STORE_STAFF') {
        if (currentUser.tenantId && c.tenantId !== currentUser.tenantId) return false;
    }

    // 2. Tab 维度过滤
    let matchesTab = false;
    if (tab === 'ALL') matchesTab = true;
    if (tab === 'POOL') matchesTab = c.ownerUserId === null; // 无 owner 即为公海
    if (tab === 'MY') matchesTab = c.ownerUserId === currentUser.id;
    if (tab === 'SHARED') matchesTab = c.sharedWith.some(s => s.userId === currentUser.id); // 检查共享列表

    // 3. 搜索关键词过滤 (姓名或电话)
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);

    return matchesTab && matchesSearch;
  });

  // 权限检查: 是否有权共享此客户
  // 规则: 只有 Owner, Super Admin 或 Manager 级别的共享成员可以再次共享
  const canShare = selectedCustomer && (
      selectedCustomer.ownerUserId === currentUser.id || 
      currentUser.role === 'SUPER_ADMIN' ||
      selectedCustomer.sharedWith.some(s => s.userId === currentUser.id && s.role === 'MANAGER')
  );

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
    switch(key) {
        case 'ALL': return t('crm.tabs.all');
        case 'MY': return t('crm.tabs.my');
        case 'POOL': return t('crm.tabs.pool');
        case 'SHARED': return t('crm.tabs.shared');
        default: return key;
    }
  }

  // 格式化辅助: 检查是否逾期
  const isOverdue = (dateStr?: string) => {
      if(!dateStr) return false;
      return new Date(dateStr) < new Date(new Date().setHours(0,0,0,0));
  };

  return (
    <div className="space-y-6">
      {/* 顶部过滤器和搜索栏 */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Tab 切换器 */}
        <div className="flex p-1 bg-gray-100 rounded-lg">
           {['ALL', 'MY', 'POOL', 'SHARED'].map((t) => (
             <button
               key={t}
               onClick={() => { setTab(t as any); setSelectedIds(new Set()); }}
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
             <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
             <input 
               type="text" 
               placeholder={t('crm.search_placeholder')}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-brand transition-colors"
             />
           </div>
           <button className="p-2 border border-gray-200 bg-white rounded-lg text-gray-500 hover:bg-gray-50">
             <Filter size={18} />
           </button>
        </div>
      </div>
      
      {/* 批量操作栏 - 当有选中项时显示 */}
      {selectedIds.size > 0 && (
        <div className="bg-primary text-white px-4 py-3 rounded-lg flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-bottom-2">
           <div className="text-sm font-medium pl-2">{selectedIds.size} {t('common.selected')}</div>
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setSelectedIds(new Set())}
               className="text-gray-400 hover:text-white text-sm"
             >
               {t('common.cancel')}
             </button>
             {/* 公海池特殊操作: 批量领取 */}
             {tab === 'POOL' && (
               <button 
                onClick={handleBatchClaim}
                className="bg-white text-primary px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-100"
               >
                 {t('crm.batch.claim')}
               </button>
             )}
             {/* 管理员/经理特殊操作: 批量分配 */}
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
                     {selectedIds.size > 0 && selectedIds.size === filteredCustomers.length ? <CheckSquare size={16}/> : <Square size={16}/>}
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
                <tr 
                    key={customer.id} 
                    className={`group hover:bg-gray-50/40 cursor-pointer ${selectedIds.has(customer.id) ? 'bg-brand-light/30' : ''}`}
                    onClick={() => { setSelectedCustomer(customer); }}
                >
                  <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                     <button onClick={() => toggleSelection(customer.id)} className={`text-gray-400 hover:text-gray-600 ${selectedIds.has(customer.id) ? 'text-brand' : ''}`}>
                       {selectedIds.has(customer.id) ? <CheckSquare size={16}/> : <Square size={16}/>}
                     </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-primary">{customer.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{customer.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-1 flex-wrap">
                      {customer.tags.map(tag => (
                        <span key={tag} className="inline-flex px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600">
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
                  <td className="py-4 px-6">
                    {customer.nextFollowUp ? (
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue(customer.nextFollowUp) ? 'text-red-600' : 'text-gray-600'}`}>
                            <Calendar size={14} className={isOverdue(customer.nextFollowUp) ? 'text-red-500' : 'text-gray-400'} />
                            {customer.nextFollowUp}
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                       {/* 领取动作 */}
                       {!customer.ownerUserId && (
                         <button 
                           onClick={() => { claimCustomer(customer.id, currentUser.id); toast.success(t('alerts.crm.claim_success')); }}
                           className="text-xs bg-brand text-white px-3 py-1.5 rounded hover:bg-brand-hover transition-colors font-medium shadow-sm"
                         >
                           {t('crm.actions.claim')}
                         </button>
                       )}
                       
                       {/* 退回公海动作 */}
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

      {/* 批量分配模态框 */}
      <BatchAssignModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        count={selectedIds.size}
        users={users}
        onAssign={handleBatchAssign}
      />

      {/* 客户详情抽屉 */}
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
  );
};