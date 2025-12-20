import React from 'react';
import { UserCheck } from 'lucide-react';
import { User } from '../../types';
import { Modal } from '../common/Modal';
import { useTranslation } from 'react-i18next';

interface BatchAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  users: User[];
  onAssign: (userId: string) => void;
}

export const BatchAssignModal: React.FC<BatchAssignModalProps> = ({ isOpen, onClose, count, users, onAssign }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('crm.batch.modal_title', { count })} className="max-w-sm">
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group" onClick={() => onAssign(u.id)}>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">{u.name.charAt(0)}</div>
                        <div>
                            <div className="text-sm font-medium">{u.name}</div>
                            <div className="text-[10px] text-gray-400">{u.role}</div>
                        </div>
                    </div>
                    <UserCheck size={16} className="text-gray-400 group-hover:text-blue-600" />
                </div>
            ))}
        </div>
        <button onClick={onClose} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700">{t('common.cancel')}</button>
    </Modal>
  );
};