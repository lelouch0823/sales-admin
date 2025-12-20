import React from 'react';
import { UserCheck } from 'lucide-react';
import { User } from '../../../types'; // Cross-domain
import { Modal } from '../../../components/common/Modal';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui';

interface BatchAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  users: User[];
  onAssign: (userId: string) => void;
}

// BatchAssignModal is a simple selection list, not a complex form. 
// Refactoring it to useZodForm might be overkill unless validaton (e.g. requires selection) is critical.
// But current implementation handles click-to-assign immediately.
// We can keep it simple or wrap it if we want to add "Reason" or other fields later.
// For now, I will keep it simple but ensure it uses the UI components correctly.

export const BatchAssignModal: React.FC<BatchAssignModalProps> = ({ isOpen, onClose, count, users, onAssign }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('crm.batch.modal_title', { count })} className="max-w-sm">
      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
        {users.map(u => (
          <div
            key={u.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group transition-colors"
            onClick={() => onAssign(u.id)}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">{u.name.charAt(0)}</div>
              <div>
                <div className="text-sm font-medium text-primary">{u.name}</div>
                <div className="text-[10px] text-muted">{u.role}</div>
              </div>
            </div>
            <UserCheck size={16} className="text-gray-300 group-hover:text-brand transition-colors" />
          </div>
        ))}
      </div>
      <Button variant="ghost" fullWidth onClick={onClose}>{t('common.cancel')}</Button>
    </Modal>
  );
};
