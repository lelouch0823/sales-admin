import React, { memo } from 'react';
import { Customer } from '../types';
import { Badge } from '../../../components/common/Badge';
import { Tooltip } from '../../../components/primitives';
import { Button } from '../../../components/ui';
import { CheckSquare, Square, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { dateUtils } from '../../../utils';
import { useToast } from '../../../lib/toast';
import type { User } from '../../../types';

interface CustomerRowProps {
  customer: Customer;
  currentUser: Pick<User, 'id'>;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onSelectCustomer: (customer: Customer) => void;
  onClaim: (customerId: string, userId: string) => void;
  onRelease: (customerId: string) => void;
}

export const CustomerRow: React.FC<CustomerRowProps> = memo(
  ({
    customer,
    currentUser,
    isSelected,
    onToggleSelection,
    onSelectCustomer,
    onClaim,
    onRelease,
  }) => {
    const { t } = useTranslation();
    const toast = useToast();

    const isOverdue = (dateStr?: string) => {
      if (!dateStr) return false;
      return new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));
    };

    return (
      <tr
        className={`group hover:bg-gray-50/40 cursor-pointer ${isSelected ? 'bg-brand-light/30' : ''}`}
        onClick={() => onSelectCustomer(customer)}
      >
        <td className="py-4 px-6" onClick={e => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleSelection(customer.id)}
            className={`p-0 h-auto hover:bg-transparent text-gray-400 hover:text-gray-600 ${isSelected ? 'text-brand' : ''}`}
          >
            {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
          </Button>
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
        <td className="py-4 px-6">
          {customer.nextFollowUp ? (
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue(customer.nextFollowUp) ? 'text-red-600' : 'text-gray-600'}`}
            >
              <Calendar
                size={14}
                className={isOverdue(customer.nextFollowUp) ? 'text-red-500' : 'text-gray-400'}
              />
              {dateUtils.formatSmart(customer.nextFollowUp)}
            </div>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </td>
        <td className="py-4 px-6 text-right" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-2">
            {!customer.ownerUserId && (
              <Tooltip content={t('crm.actions.claim')}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClaim(customer.id, currentUser.id);
                    toast.success(t('alerts.crm.claim_success'));
                  }}
                  className="bg-brand hover:bg-brand-hover border-none"
                >
                  {t('crm.actions.claim')}
                </Button>
              </Tooltip>
            )}

            {customer.ownerUserId === currentUser.id && (
              <Tooltip content={t('crm.actions.return_pool')}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRelease(customer.id)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {t('crm.actions.return_pool')}
                </Button>
              </Tooltip>
            )}
          </div>
        </td>
      </tr>
    );
  }
);
