import React, { useEffect } from 'react';
import { User, Tenant } from '../../types';
import { RoleId } from '../../constants/roles';
import { Modal } from '../common/Modal';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '../ui';
import { useZodForm } from '../../hooks';
import { userSchema, UserFormData } from '../../lib/schemas';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null;
  tenants: Tenant[];
  onSave: (data: UserFormData) => void;
}

/**
 * 用户创建/编辑模态框
 *
 * 使用封装:
 * - useZodForm: 表单验证 (react-hook-form + zod)
 * - userSchema: Zod 验证 schema
 */
export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  tenants,
  onSave,
}) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useZodForm({
    schema: userSchema,
    defaultValues: {
      name: '',
      email: '',
      role: 'STORE_MANAGER',
      tenantId: '',
      isActive: true,
    },
  });

  const role = watch('role');

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        reset({
          name: userToEdit.name,
          email: userToEdit.email,
          role: userToEdit.role,
          tenantId: userToEdit.tenantId || '',
          isActive: userToEdit.status === 'ACTIVE',
        });
      } else {
        reset({
          name: '',
          email: '',
          role: 'STORE_MANAGER',
          tenantId: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, userToEdit, reset]);

  const onSubmit = (data: UserFormData) => {
    const isStoreRole = data.role === 'STORE_MANAGER' || data.role === 'STORE_STAFF';
    onSave({
      ...data,
      tenantId: isStoreRole ? data.tenantId : undefined,
    });
  };

  const roleOptions = [
    { value: 'SUPER_ADMIN', label: t('consts.role.SUPER_ADMIN') },
    { value: 'OPS_GLOBAL', label: t('consts.role.OPS_GLOBAL') },
    { value: 'STORE_MANAGER', label: t('consts.role.STORE_MANAGER') },
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
      {/* @ts-expect-error - Known react-hook-form + zod type compatibility issue */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('users.modal.name')}
          {...register('name')}
          error={errors.name?.message}
          placeholder="e.g. Jane Doe"
        />

        <Input
          label={t('users.modal.email')}
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="jane@company.com"
        />

        <Select
          label={t('users.modal.role')}
          options={roleOptions}
          value={role}
          onChange={e => setValue('role', e.target.value as RoleId)}
        />

        {(role === 'STORE_MANAGER' || role === 'STORE_STAFF') && (
          <Select
            label={t('users.modal.assign_store')}
            placeholder={t('users.modal.select_store')}
            options={storeOptions}
            {...register('tenantId')}
            error={errors.tenantId?.message}
          />
        )}

        <div className="mt-8 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {userToEdit ? t('common.save') : t('users.create_btn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
