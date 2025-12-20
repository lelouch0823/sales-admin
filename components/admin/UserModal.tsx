import React, { useState, useEffect } from 'react';
import { User, Role, Tenant } from '../../types';
import { Modal } from '../common/Modal';
import { useTranslation } from 'react-i18next';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null; // null = create mode
  tenants: Tenant[];
  onSave: (data: any) => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userToEdit, tenants, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'STORE_MANAGER',
    tenantId: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (isOpen) {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                email: userToEdit.email,
                role: userToEdit.role,
                tenantId: userToEdit.tenantId || '',
                status: userToEdit.status
            });
        } else {
            setFormData({ name: '', email: '', role: 'STORE_MANAGER', tenantId: '', status: 'ACTIVE' });
        }
    }
  }, [isOpen, userToEdit]);

  const handleSubmit = () => {
    if(!formData.name || !formData.email) return alert('Name and Email are required');
    
    // Logic: Global roles don't need tenantId. Store roles do.
    const isStoreRole = formData.role === 'STORE_MANAGER' || formData.role === 'STORE_STAFF';
    if(isStoreRole && !formData.tenantId) return alert('Store roles require a Tenant selection');

    onSave({
      name: formData.name,
      email: formData.email,
      role: formData.role as Role,
      tenantId: isStoreRole ? formData.tenantId : undefined,
      status: formData.status as 'ACTIVE' | 'DISABLED',
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={userToEdit ? t('users.modal.title_edit') : t('users.modal.title_create')} 
      className="max-w-md"
    >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.modal.name')}</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.modal.email')}</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="jane@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.modal.role')}</label>
            <select 
               value={formData.role}
               onChange={e => setFormData({...formData, role: e.target.value as Role})}
               className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none"
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="OPS_GLOBAL">Global Ops</option>
              <option value="STORE_MANAGER">Store Manager</option>
              <option value="STORE_STAFF">Store Staff</option>
            </select>
          </div>

          {(formData.role === 'STORE_MANAGER' || formData.role === 'STORE_STAFF') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.modal.assign_store')}</label>
              <select 
                 value={formData.tenantId}
                 onChange={e => setFormData({...formData, tenantId: e.target.value})}
                 className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none"
              >
                <option value="">{t('users.modal.select_store')}</option>
                {tenants.filter(t => t.type === 'STORE').map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-white bg-gray-900 hover:bg-black rounded-lg transition-colors shadow-sm"
          >
            {userToEdit ? t('common.save') : t('users.create_btn')}
          </button>
        </div>
    </Modal>
  );
};