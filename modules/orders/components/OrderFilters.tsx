import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { OrderStatus } from '../types';

interface OrderFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (status: OrderStatus | 'all') => void;
  currentStatus: string;
}

export function OrderFilters({ onSearchChange, onStatusChange, currentStatus }: OrderFiltersProps) {
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'all', label: t('allStatus') },
    { value: 'pending', label: t('status.pending') },
    { value: 'confirmed', label: t('status.confirmed') },
    { value: 'processing', label: t('status.processing') },
    { value: 'shipped', label: t('status.shipped') },
    { value: 'delivered', label: t('status.delivered') },
    { value: 'cancelled', label: t('status.cancelled') },
    { value: 'refunded', label: t('status.refunded') },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder={t('searchOrders')}
          className="pl-10 w-full"
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full md:w-48">
        <Select
          options={statusOptions}
          value={currentStatus}
          onChange={e => onStatusChange(e.target.value as OrderStatus | 'all')}
        />
      </div>
    </div>
  );
}
