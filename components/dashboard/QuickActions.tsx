import React from 'react';
import { Plus, PackagePlus, Users, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { useTranslation } from 'react-i18next';

interface QuickActionsProps {
  currentUserRole: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ currentUserRole }) => {
  const { t } = useTranslation();
  
  // 定义所有可用的快捷操作及其需要的权限
  const actions = [
    { 
      label: t('dashboard.qa.new_product'), 
      icon: Plus, 
      color: 'bg-brand', 
      role: ['SUPER_ADMIN', 'OPS_GLOBAL'] // 仅总部可创建商品
    },
    { 
      label: t('dashboard.qa.stock_in'), 
      icon: PackagePlus, 
      color: 'bg-success', 
      role: ['SUPER_ADMIN', 'STORE_MANAGER'] // 店长可操作入库
    },
    { 
      label: t('dashboard.qa.create_user'), 
      icon: Users, 
      color: 'bg-purple-600', 
      role: ['SUPER_ADMIN'] // 仅超管可创建用户
    }, 
    { 
      label: t('dashboard.qa.view_audit'), 
      icon: FileText, 
      color: 'bg-gray-600', 
      role: ['SUPER_ADMIN', 'OPS_GLOBAL', 'STORE_MANAGER'] 
    },
  ];

  // 根据当前用户角色过滤可见的操作
  const visibleActions = actions.filter(action => action.role.includes(currentUserRole));

  return (
    <Card>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">{t('dashboard.quick_actions')}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {visibleActions.map((action, idx) => (
                <button key={idx} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-surface hover:shadow-md transition-all group">
                    <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                        <action.icon size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
            ))}
            {visibleActions.length === 0 && <p className="text-gray-400 text-sm">{t('common.no_data')}</p>}
        </div>
    </Card>
  );
};