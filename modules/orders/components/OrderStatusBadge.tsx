import { useTranslation } from 'react-i18next';
import { Badge } from '../../../components/common/Badge';
import { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return 'neutral';
      case 'delivered':
        return 'success';
      case 'cancelled':
      case 'refunded':
      case 'failed':
        return 'danger';
      case 'returned':
        return 'warning';
      default:
        return 'default';
    }
  };

  return <Badge variant={getStatusColor(status)}>{t(`status.${status}`)}</Badge>;
}
