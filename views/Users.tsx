import React, { useState } from 'react';
import { useApp } from '../lib/context';
import { Card } from '../components/common/Card';
import { Toggle } from '../components/Toggle';
import { User } from '../types';
import { UserModal } from '../components/admin/UserModal';
import { useTranslation } from 'react-i18next';

/**
 * 用户管理视图 (UsersView)
 * 职责:
 * 1. 展示系统用户列表
 * 2. 管理用户状态 (启用/禁用)
 * 3. 创建新用户和编辑现有用户
 * 4. 处理角色分配 (RBAC) 和 租户绑定 (Tenant Scope)
 * 注意: 此页面通常仅限 SUPER_ADMIN 访问
 */
export const UsersView: React.FC = () => {
  const { users, tenants, updateUser, addUser } = useApp();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // 辅助方法: 获取租户名称
  const getTenantName = (id?: string) => tenants.find(t => t.id === id)?.name || 'Global';

  // 打开创建模式
  const openCreateModal = () => {
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  // 打开编辑模式
  const openEditModal = (user: User) => {
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  // 处理保存 (创建或更新)
  const handleSaveUser = (userData: any) => {
    if (editingUserId) {
      updateUser(editingUserId, userData);
    } else {
      // 模拟生成头像
      addUser({
        ...userData,
        avatarUrl: `https://i.pravatar.cc/150?u=${Math.random()}`
      });
    }
    setIsModalOpen(false);
  };

  // 获取当前正在编辑的用户对象
  const userToEdit = editingUserId ? users.find(u => u.id === editingUserId) || null : null;

  return (
    <div className="space-y-6">
      <Card noPadding>
        {/* 表头操作区 */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-primary">{t('users.title')}</h2>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-sm hover:bg-primary-hover transition-colors"
          >
            {t('users.create_btn')}
          </button>
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
                    {/* 显示用户所属的门店范围，全局用户显示 Global */}
                    {getTenantName(user.tenantId)}
                  </td>
                  <td className="py-4 px-6">
                    <Toggle
                      enabled={user.status === 'ACTIVE'}
                      onToggle={() => updateUser(user.id, { status: user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' })}
                    />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-sm text-brand font-medium hover:underline"
                    >
                      {t('common.edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 用户编辑/创建模态框 */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
        tenants={tenants}
        onSave={handleSaveUser}
      />
    </div>
  );
};