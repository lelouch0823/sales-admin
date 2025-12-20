import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { Card } from '../components/common/Card';
import { Toggle } from '../components/Toggle';
import { User } from '../types';
import { UserModal } from '../components/admin/UserModal';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui';
import { AnimatedBox } from '../components/motion';
import { Tooltip, TooltipProvider } from '../components/primitives';

/**
 * 用户管理视图 (UsersView)
 * 
 * 使用封装:
 * - AnimatedBox: 入场动画
 * - Tooltip: 操作按钮提示
 */
export const UsersView: React.FC = () => {
  const { users, tenants, updateUser, addUser } = useApp();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const getTenantName = (id?: string) => tenants.find(t => t.id === id)?.name || 'Global';

  const openCreateModal = () => {
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData: any) => {
    if (editingUserId) {
      updateUser(editingUserId, userData);
    } else {
      addUser({
        ...userData,
        avatarUrl: `https://i.pravatar.cc/150?u=${Math.random()}`
      });
    }
    setIsModalOpen(false);
  };

  const userToEdit = editingUserId ? users.find(u => u.id === editingUserId) || null : null;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <AnimatedBox animation="fadeInUp">
          <Card noPadding>
            {/* 表头操作区 */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-primary">{t('users.title')}</h2>
              <Tooltip content={t('users.modal.title_create')}>
                <Button variant="primary" onClick={openCreateModal}>
                  {t('users.create_btn')}
                </Button>
              </Tooltip>
            </div>

            {/* 用户列表 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-4 px-6">{t('users.table.user')}</th>
                    <th className="py-4 px-6">{t('users.table.role')}</th>
                    <th className="py-4 px-6">{t('users.table.tenant_scope')}</th>
                    <th className="py-4 px-6">{t('users.table.status')}</th>
                    <th className="py-4 px-6 text-right">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/40">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                          <div>
                            <div className="font-medium text-primary text-sm">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {t(`consts.role.${user.role}`)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {getTenantName(user.tenantId)}
                      </td>
                      <td className="py-4 px-6">
                        <Tooltip content={user.status === 'ACTIVE' ? t('consts.status.ACTIVE') : t('consts.status.DISABLED')}>
                          <span>
                            <Toggle
                              enabled={user.status === 'ACTIVE'}
                              onToggle={() => updateUser(user.id, { status: user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' })}
                            />
                          </span>
                        </Tooltip>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Tooltip content={t('users.modal.title_edit')}>
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-sm text-brand font-medium hover:underline"
                          >
                            {t('common.edit')}
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </AnimatedBox>

        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userToEdit={userToEdit}
          tenants={tenants}
          onSave={handleSaveUser}
        />
      </div>
    </TooltipProvider>
  );
};