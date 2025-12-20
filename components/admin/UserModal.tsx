import React, { useState, useEffect } from 'react';
import { User, Role, Tenant } from '../../types';
import { Modal } from '../common/Modal';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '../ui';

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
    if (!formData.name || !formData.email) return alert('Name and Email are required');

    const isStoreRole = formData.role === 'STORE_MANAGER' || formData.role === 'STORE_STAFF';
    if (isStoreRole && !formData.tenantId) return alert('Store roles require a Tenant selection');

    onSave({
      name: formData.name,
      email: formData.email,
      role: formData.role as Role,
      tenantId: isStoreRole ? formData.tenantId : undefined,
      status: formData.status as 'ACTIVE' | 'DISABLED',
    });
  };

  const roleOptions = [
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'OPS_GLOBAL', label: 'Global Ops' },
    { value: 'STORE_MANAGER', label: 'Store Manager' },
    { value: 'STORE_STAFF', label: 'Store Staff' },
  ];

  const storeOptions = tenants
    .filter(t => t.type === 'STORE')
    .map(t => ({ value: t.id, label: t.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={userToEdit ? t('users.modal.title_edit') : t('users.modal.title_create')}
      className="max-w-md"
    >
      <div className="space-y-4">
        <Input
          label={t('users.modal.name')}
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Jane Doe"
        />

        <Input
          label={t('users.modal.email')}
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="jane@company.com"
        />

        <Select
          label={t('users.modal.role')}
          options={roleOptions}
          value={formData.role}
          onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
        />

        {(formData.role === 'STORE_MANAGER' || formData.role === 'STORE_STAFF') && (
          <Select
            label={t('users.modal.assign_store')}
            placeholder={t('users.modal.select_store')}
            options={storeOptions}
            value={formData.tenantId}
            onChange={e => setFormData({ ...formData, tenantId: e.target.value })}
          />
        )}
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {userToEdit ? t('common.save') : t('users.create_btn')}
        </Button>
      </div>
    </Modal>
  );
};